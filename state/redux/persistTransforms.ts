import { createTransform } from 'redux-persist';

/**
 * Transform que quita campos transitorios al guardar en localStorage
 * y los restaura al rehidratar.
 * - status: estados de loading/error no deben sobrevivir recargas
 * - currentService, currentEvent, etc: datos de detalle no se persisten
 */
const stripTransientFields = createTransform(
  // Inbound: al guardar en storage
  (inboundState: Record<string, unknown>) => {
    const { status, ...rest } = inboundState;
    // Eliminar campos "current*" que son de detalle/edición
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rest)) {
      if (!key.startsWith('current')) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  },
  // Outbound: al restaurar desde storage
  (outboundState: Record<string, unknown>) => {
    return {
      ...outboundState,
      status: {},
    };
  },
  { whitelist: ['services', 'authorities', 'contact', 'tramites'] }
);

export default stripTransientFields;
