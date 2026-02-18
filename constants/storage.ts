// ============================================================================
// CONFIGURACIÓN DE STORAGE - MUNICIPALIDAD GENERAL PAZ
// Optimizado para Supabase Plan Gratuito (1 GB total)
// ============================================================================

// Nombres de los buckets de Supabase Storage
export const STORAGE_BUCKETS = {
  NEWS_IMAGES: 'news-images',
  NEWS_ATTACHMENTS: 'news-attachments',
  AUTHORITY_PHOTOS: 'authority-photos',
  SERVICE_IMAGES: 'service-images',
  REGULATIONS_PDFS: 'regulations-pdfs',
  PUBLIC_WORKS_IMAGES: 'public-works-images',
  TRAMITES_PDFS: 'tramites-pdfs',
} as const;

// Límites de tamaño de archivos (en MB)
// Plan gratuito: máx 50 MB por archivo, 1 GB total
export const FILE_SIZE_LIMITS = {
  NEWS_IMAGE_MAX_SIZE: 2, // 2 MB - imágenes de novedades
  AUTHORITY_PHOTO_MAX_SIZE: 1, // 1 MB - fotos de autoridades
  SERVICE_IMAGE_MAX_SIZE: 2, // 2 MB - imágenes de servicios
  REGULATION_PDF_MAX_SIZE: 5, // 5 MB - PDFs de normativa
  ATTACHMENT_MAX_SIZE: 10, // 10 MB - adjuntos de novedades
  PUBLIC_WORK_IMAGE_MAX_SIZE: 2, // 2 MB - imágenes de obras públicas
  TRAMITE_PDF_MAX_SIZE: 5, // 5 MB - PDFs de trámites
} as const;

// Tipos MIME permitidos por categoría
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/webp'],
  PDFS: ['application/pdf'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

// Extensiones de archivo permitidas
export const ALLOWED_EXTENSIONS = {
  IMAGES: ['.jpg', '.jpeg', '.png', '.webp'],
  PDFS: ['.pdf'],
  DOCUMENTS: ['.pdf', '.doc', '.docx'],
} as const;

// Mensajes de error para validación de archivos
export const FILE_UPLOAD_ERRORS = {
  SIZE_EXCEEDED: (maxSize: number) =>
    `El archivo excede el tamaño máximo de ${maxSize}MB`,
  INVALID_TYPE: 'Tipo de archivo no permitido',
  UPLOAD_FAILED: 'Error al subir el archivo. Por favor, intenta nuevamente',
  NO_FILE_SELECTED: 'No se ha seleccionado ningún archivo',
} as const;
