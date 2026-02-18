const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const JPEG_QUALITY = 0.8;
const WEBP_QUALITY = 0.8;

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Comprime una imagen usando canvas antes de subirla a Supabase Storage.
 * - Redimensiona si supera 1200px de ancho o alto (mantiene proporción)
 * - Comprime JPEG/WebP a calidad 0.8
 * - Convierte PNG a WebP para mejor compresión (si el browser soporta WebP)
 * - Retorna el archivo original si no es imagen o si ya es más pequeño
 */
export const compressImage = (file: File): Promise<File> => {
  if (!IMAGE_TYPES.includes(file.type)) {
    return Promise.resolve(file);
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Calcular nuevas dimensiones manteniendo proporción
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      } else if (file.type !== 'image/png') {
        // Si no necesita redimensionar y no es PNG, solo re-comprimir si vale la pena
        // Para archivos ya pequeños (<200KB), no comprimir
        if (file.size < 200 * 1024) {
          resolve(file);
          return;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Determinar formato de salida y calidad
      let outputType: string;
      let quality: number;
      let ext: string;

      if (file.type === 'image/png') {
        // PNG → WebP para mejor compresión
        outputType = 'image/webp';
        quality = WEBP_QUALITY;
        ext = '.webp';
      } else if (file.type === 'image/webp') {
        outputType = 'image/webp';
        quality = WEBP_QUALITY;
        ext = '.webp';
      } else {
        // JPEG
        outputType = 'image/jpeg';
        quality = JPEG_QUALITY;
        ext = file.name.endsWith('.jpeg') ? '.jpeg' : '.jpg';
      }

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            // Si la compresión no redujo el tamaño, usar original
            resolve(file);
            return;
          }

          // Generar nombre con extensión correcta
          const baseName = file.name.replace(/\.[^.]+$/, '');
          const compressedFile = new File([blob], `${baseName}${ext}`, {
            type: outputType,
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        outputType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
};
