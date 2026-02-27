import { useState } from 'react';
import { supabase } from '@/state/supabase/config';
import { FILE_SIZE_LIMITS, FILE_UPLOAD_ERRORS } from '@/constants';
import { compressImage } from '@/utils/compressImage';
import { translateError } from '@/utils/translateError';

type UseFileUploadOptions = {
  bucket: string;
  maxSize?: number; // en MB
  allowedTypes?: string[];
  path?: string; // Ruta dentro del bucket
};

type UploadProgress = {
  loaded: number;
  total: number;
  percentage: number;
};

// Magic bytes para validación de contenido real del archivo
const MAGIC_BYTES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
};

/**
 * Valida los magic bytes del archivo para verificar que el contenido
 * coincide con el tipo MIME declarado.
 */
const validateMagicBytes = async (file: File, declaredType: string): Promise<boolean> => {
  const signatures = MAGIC_BYTES[declaredType];
  if (!signatures) return true; // Si no tenemos signature, aceptar

  const buffer = await file.slice(0, 8).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  return signatures.some((sig) =>
    sig.every((byte, i) => bytes[i] === byte)
  );
};

/**
 * Sanitiza el nombre de archivo para prevenir path traversal
 */
const sanitizeFileName = (name: string): string => {
  return name
    .replace(/\.\./g, '') // Prevenir path traversal
    .replace(/[/\\]/g, '') // Eliminar separadores de path
    .replace(/[^a-zA-Z0-9._-]/g, '_'); // Solo caracteres seguros
};

/**
 * Valida la extensión del archivo contra su tipo MIME
 */
const validateExtension = (fileName: string, mimeType: string): boolean => {
  const ext = ('.' + (fileName.split('.').pop() || '')).toLowerCase();
  const mimeToExt: Record<string, string[]> = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  };

  const allowedExts = mimeToExt[mimeType];
  if (!allowedExts) return true;
  return allowedExts.includes(ext);
};

/**
 * Hook para subir archivos a Supabase Storage
 * Maneja validación, progress y errores
 */
export const useFileUpload = (options: UseFileUploadOptions) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });
  const [error, setError] = useState<string | null>(null);

  /**
   * Valida el archivo antes de subir
   */
  const validateFile = async (file: File): Promise<boolean> => {
    setError(null);

    if (!file) {
      setError(FILE_UPLOAD_ERRORS.NO_FILE_SELECTED);
      return false;
    }

    // Validar tamaño
    const maxSize = options.maxSize || FILE_SIZE_LIMITS.ATTACHMENT_MAX_SIZE;
    if (file.size > maxSize * 1024 * 1024) {
      setError(FILE_UPLOAD_ERRORS.SIZE_EXCEEDED(maxSize));
      return false;
    }

    // Validar tipo MIME
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      setError(FILE_UPLOAD_ERRORS.INVALID_TYPE);
      return false;
    }

    // Validar extensión coincide con MIME
    if (!validateExtension(file.name, file.type)) {
      setError('La extensión del archivo no coincide con su tipo');
      return false;
    }

    // Validar magic bytes (contenido real del archivo)
    const validContent = await validateMagicBytes(file, file.type);
    if (!validContent) {
      setError('El contenido del archivo no coincide con su tipo declarado');
      return false;
    }

    return true;
  };

  /**
   * Sube un archivo a Supabase Storage
   */
  const upload = async (file: File, customPath?: string): Promise<string | null> => {
    const isValid = await validateFile(file);
    if (!isValid) return null;

    setUploading(true);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });
    setError(null);

    try {
      // Comprimir imagen antes de subir (reduce peso en storage)
      const processedFile = await compressImage(file);

      // Generar nombre de archivo seguro y único
      const safeOriginalName = sanitizeFileName(processedFile.name);
      const fileExt = safeOriginalName.split('.').pop()?.toLowerCase();
      const timestamp = Date.now();
      const randomString = crypto.getRandomValues(new Uint8Array(6))
        .reduce((s, b) => s + b.toString(36).padStart(2, '0'), '');
      const fileName = customPath
        ? sanitizeFileName(customPath)
        : `${timestamp}-${randomString}.${fileExt}`;

      // Path completo dentro del bucket (sanitizado)
      const safePath = options.path ? sanitizeFileName(options.path) : '';
      const fullPath = safePath ? `${safePath}/${fileName}` : fileName;

      // Subir archivo (comprimido si es imagen)
      const { error: uploadError } = await supabase.storage
        .from(options.bucket)
        .upload(fullPath, processedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: processedFile.type,
        });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(fullPath);

      setProgress({ loaded: processedFile.size, total: processedFile.size, percentage: 100 });
      return urlData.publicUrl;
    } catch (err: any) {
      setError(translateError(err, FILE_UPLOAD_ERRORS.UPLOAD_FAILED));
      return null;
    } finally {
      setUploading(false);
    }
  };

  /**
   * Elimina un archivo del storage
   */
  const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase.storage
        .from(options.bucket)
        .remove([filePath]);

      if (deleteError) throw deleteError;
      return true;
    } catch (err: any) {
      setError(translateError(err, 'Error al eliminar el archivo'));
      return false;
    }
  };

  const reset = () => {
    setUploading(false);
    setProgress({ loaded: 0, total: 0, percentage: 0 });
    setError(null);
  };

  return {
    upload,
    deleteFile,
    uploading,
    progress,
    error,
    reset,
  };
};
