'use client';

import { Box, Typography, Button, Popover, Chip } from '@mui/material';
import {
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { Event, EventCategory } from '@/types';
import { PUBLIC_ROUTES, EVENT_CATEGORIES } from '@/constants';

const CATEGORY_COLORS: Record<EventCategory, string> = {
  cultural: '#B52A1C',
  deportivo: '#F5A623',
  institucional: '#2E86C1',
  educativo: '#0288d1',
  social: '#2E7D32',
};

type EventPopoverProps = {
  anchorEl: HTMLElement | null;
  events: Event[];
  onClose: () => void;
};

const EventPopover = ({ anchorEl, events, onClose }: EventPopoverProps) => {
  const isUrl = (str?: string) => str?.startsWith('http');

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            maxWidth: 340,
            maxHeight: 400,
            overflow: 'auto',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            border: '1px solid',
            borderColor: 'divider',
          },
        },
      }}
    >
      {events.map((event, index) => {
        const isPast = new Date(event.event_date + 'T23:59:59') < new Date();
        const catLabel = EVENT_CATEGORIES.find((c) => c.value === event.category)?.label || event.category;

        return (
          <Box
            key={event.id}
            sx={{
              p: 2,
              borderBottom: index < events.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
              opacity: isPast ? 0.6 : 1,
            }}
          >
            {event.image_url && (
              <Box
                component="img"
                src={event.image_url}
                alt={event.title}
                sx={{
                  width: '100%',
                  height: 120,
                  objectFit: 'cover',
                  borderRadius: 2,
                  mb: 1.5,
                  filter: isPast ? 'grayscale(0.8)' : 'none',
                }}
              />
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={catLabel}
                size="small"
                sx={{
                  backgroundColor: `${CATEGORY_COLORS[event.category]}15`,
                  color: CATEGORY_COLORS[event.category],
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 22,
                }}
              />
              {isPast && (
                <Chip
                  label="Finalizado"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.06)',
                    color: 'text.secondary',
                    fontSize: '0.65rem',
                    height: 20,
                  }}
                />
              )}
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.3 }}>
              {event.title}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, mb: 1.5 }}>
              {event.event_time && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TimeIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary">
                    {event.event_time} hs
                  </Typography>
                </Box>
              )}
              {event.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {event.location}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {isUrl(event.contact_info) ? (
                <Button
                  component="a"
                  href={event.contact_info!}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  variant="contained"
                  onClick={onClose}
                  endIcon={<OpenInNewIcon sx={{ fontSize: '14px !important' }} />}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' },
                  }}
                >
                  Ver detalle
                </Button>
              ) : (
                <Button
                  component={Link}
                  href={PUBLIC_ROUTES.AGENDA_DETALLE(event.slug)}
                  size="small"
                  variant="contained"
                  onClick={onClose}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' },
                  }}
                >
                  Ver detalle
                </Button>
              )}
            </Box>
          </Box>
        );
      })}
    </Popover>
  );
};

export default EventPopover;
