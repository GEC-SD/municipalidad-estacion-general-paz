/**
 * Traduce errores de Supabase/PostgreSQL a mensajes amigables en español.
 * Se usa en todos los thunks de Redux para que los errores mostrados
 * al usuario en el panel de admin sean comprensibles.
 */

type ErrorPattern = {
  pattern: RegExp;
  message: string | ((match: RegExpMatchArray) => string);
};

const COLUMN_TRANSLATIONS: Record<string, string> = {
  title: 'título',
  slug: 'slug',
  description: 'descripción',
  content: 'contenido',
  event_date: 'fecha del evento',
  end_date: 'fecha de finalización',
  event_time: 'hora del evento',
  location: 'lugar',
  category: 'categoría',
  image_url: 'imagen',
  name: 'nombre',
  position: 'cargo',
  email: 'correo electrónico',
  phone: 'teléfono',
  address: 'dirección',
  file_url: 'archivo',
  pdf_url: 'archivo PDF',
  year: 'año',
  number: 'número',
  type: 'tipo',
  status: 'estado',
  area: 'área',
  published_at: 'fecha de publicación',
  created_at: 'fecha de creación',
  updated_at: 'fecha de actualización',
  is_active: 'estado activo',
  is_featured: 'destacado',
  order_index: 'orden',
  requirements: 'requisitos',
  contact_info: 'información de contacto',
  organizer: 'organizador',
};

function translateColumn(column: string): string {
  return COLUMN_TRANSLATIONS[column] || column.replace(/_/g, ' ');
}

const ERROR_PATTERNS: ErrorPattern[] = [
  // Tipo de dato inválido (ej: fecha vacía "")
  {
    pattern: /invalid input syntax for type (\w+): "(.*)"/i,
    message: (match) => {
      const type = match[1];
      const value = match[2];
      if (type === 'date') {
        return value === ''
          ? 'Se ingresó una fecha vacía. Completá el campo de fecha o dejalo sin seleccionar.'
          : `La fecha "${value}" no es válida. Usá el formato correcto (AAAA-MM-DD).`;
      }
      if (type === 'uuid') {
        return 'El identificador del registro no es válido.';
      }
      if (type === 'integer' || type === 'numeric') {
        return value === ''
          ? 'Se ingresó un número vacío. Completá el campo numérico o dejalo sin seleccionar.'
          : `El valor "${value}" no es un número válido.`;
      }
      if (type === 'boolean') {
        return `El valor "${value}" no es válido para un campo de verdadero/falso.`;
      }
      if (type === 'timestamp' || type === 'timestamptz') {
        return value === ''
          ? 'Se ingresó una fecha/hora vacía.'
          : `La fecha/hora "${value}" no es válida.`;
      }
      return `El valor "${value}" no es válido para el tipo de dato esperado.`;
    },
  },

  // Violación de clave única
  {
    pattern: /duplicate key value violates unique constraint "(\w+)"/i,
    message: (match) => {
      const constraint = match[1];
      if (constraint.includes('slug')) {
        return 'Ya existe un registro con ese slug. Modificá el título para generar uno diferente.';
      }
      if (constraint.includes('email')) {
        return 'Ya existe un registro con ese correo electrónico.';
      }
      if (constraint.includes('area')) {
        return 'Ya existe un registro para esta área.';
      }
      return 'Ya existe un registro con esos datos. Verificá que no esté duplicado.';
    },
  },

  // Violación NOT NULL
  {
    pattern: /null value in column "(\w+)" of relation "(\w+)" violates not-null constraint/i,
    message: (match) => {
      const column = translateColumn(match[1]);
      return `El campo "${column}" es obligatorio. Por favor completalo antes de guardar.`;
    },
  },

  // Violación NOT NULL (formato alternativo)
  {
    pattern: /null value in column "(\w+)".*not-null/i,
    message: (match) => {
      const column = translateColumn(match[1]);
      return `El campo "${column}" es obligatorio.`;
    },
  },

  // Violación de CHECK constraint
  {
    pattern: /violates check constraint "(\w+)"/i,
    message: (match) => {
      const constraint = match[1];
      if (constraint.includes('category')) {
        return 'La categoría seleccionada no es válida.';
      }
      if (constraint.includes('year')) {
        return 'El año ingresado no es válido.';
      }
      if (constraint.includes('type')) {
        return 'El tipo seleccionado no es válido.';
      }
      if (constraint.includes('status')) {
        return 'El estado seleccionado no es válido.';
      }
      return 'Uno de los valores ingresados no es válido. Revisá los campos del formulario.';
    },
  },

  // Violación de foreign key
  {
    pattern: /violates foreign key constraint/i,
    message:
      'No se puede realizar esta acción porque el registro tiene datos asociados.',
  },

  // RLS policy violation
  {
    pattern: /new row violates row-level security policy/i,
    message:
      'No tenés permisos para realizar esta acción. Verificá que tu sesión esté activa.',
  },

  // Row not found (single row expected)
  {
    pattern: /JSON object requested, multiple \(or no\) rows returned/i,
    message: 'No se encontró el registro solicitado.',
  },

  // String too long
  {
    pattern: /value too long for type character varying\((\d+)\)/i,
    message: (match) => {
      return `El texto ingresado es demasiado largo. El máximo permitido es ${match[1]} caracteres.`;
    },
  },

  // Connection / network errors
  {
    pattern: /Failed to fetch/i,
    message:
      'Error de conexión. Verificá tu conexión a internet e intentá nuevamente.',
  },

  {
    pattern: /NetworkError|ERR_NETWORK|ERR_CONNECTION/i,
    message:
      'Error de conexión. Verificá tu conexión a internet e intentá nuevamente.',
  },

  // Timeout
  {
    pattern: /timeout|AbortError/i,
    message:
      'La operación tardó demasiado tiempo. Intentá nuevamente en unos momentos.',
  },

  // Storage errors
  {
    pattern: /The resource already exists/i,
    message: 'El archivo ya existe. Intentá con otro nombre.',
  },

  {
    pattern: /exceeded the maximum allowed size|object.*(too large|size limit)/i,
    message:
      'El archivo excede el tamaño máximo permitido en el servidor. Contactá al administrador para aumentar el límite del bucket.',
  },

  {
    pattern: /Payload too large|413/i,
    message: 'El archivo es demasiado grande. Reducí su tamaño e intentá nuevamente.',
  },

  {
    pattern: /bucket not found|Bucket not public/i,
    message: 'Error de configuración del almacenamiento. Contactá al administrador.',
  },

  {
    pattern: /storage\/object.*not found|Object not found/i,
    message: 'El archivo no fue encontrado en el servidor.',
  },

  // Permission errors
  {
    pattern: /permission denied|not authorized|401|403/i,
    message: 'No tenés permisos para realizar esta acción. Tu sesión puede haber expirado.',
  },

  // Generic PostgreSQL errors
  {
    pattern: /relation "(\w+)" does not exist/i,
    message: 'Error interno del sistema. Contactá al administrador.',
  },

  {
    pattern: /column "(\w+)" of relation "(\w+)" does not exist/i,
    message: 'Error interno del sistema. Contactá al administrador.',
  },
];

/**
 * Traduce un mensaje de error de Supabase/PostgreSQL a español amigable.
 * Si no se reconoce el patrón, devuelve el fallback proporcionado.
 */
export function translateError(
  error: any,
  fallback: string = 'Ocurrió un error inesperado. Intentá nuevamente.'
): string {
  const message =
    typeof error === 'string'
      ? error
      : error?.message || error?.error_description || error?.msg || '';

  if (!message) return fallback;

  for (const { pattern, message: translation } of ERROR_PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      return typeof translation === 'function' ? translation(match) : translation;
    }
  }

  // Si el mensaje ya está en español y es legible, devolverlo tal cual
  if (/^[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü\s,.:;]+$/.test(message) && message.length < 200) {
    return message;
  }

  return fallback;
}
