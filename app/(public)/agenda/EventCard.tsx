'use client';

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { Event, EventCategory } from '@/types';
import { EVENT_CATEGORIES, PUBLIC_ROUTES } from '@/constants';

const CATEGORY_HEX: Record<EventCategory, { main: string; light: string }> = {
  cultural: { main: '#B52A1C', light: '#D4554A' },
  deportivo: { main: '#F5A623', light: '#F7BC5A' },
  institucional: { main: '#2E86C1', light: '#5DA9D9' },
  educativo: { main: '#0288d1', light: '#03a9f4' },
  social: { main: '#2E7D32', light: '#4caf50' },
};

const CATEGORY_MUI: Record<string, 'primary' | 'secondary' | 'warning' | 'info' | 'success'> = {
  cultural: 'secondary',
  deportivo: 'warning',
  institucional: 'primary',
  educativo: 'info',
  social: 'success',
};

type EventCardProps = {
  event: Event;
};

const EventCard = ({ event }: EventCardProps) => {
  const d = new Date(event.event_date + 'T00:00:00');
  const day = d.getDate();
  const month = d.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase();
  const isPast = new Date(event.end_date || event.event_date + 'T23:59:59') < new Date();
  const catLabel = EVENT_CATEGORIES.find((c) => c.value === event.category)?.label || event.category;
  const colors = CATEGORY_HEX[event.category] || CATEGORY_HEX.institucional;

  const hasRange = event.end_date && event.end_date !== event.event_date;
  let rangeBadge = '';
  if (hasRange) {
    const endD = new Date(event.end_date + 'T00:00:00');
    const endDay = endD.getDate();
    const endMonth = endD.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase();
    rangeBadge = month === endMonth ? `${day} - ${endDay} ${month}` : `${day} ${month} - ${endDay} ${endMonth}`;
  }

  return (
    <Card
      component={Link}
      href={PUBLIC_ROUTES.AGENDA_DETALLE(event.slug)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        textDecoration: 'none',
        color: 'inherit',
        opacity: isPast ? 0.65 : 1,
        '&:hover': {
          transform: isPast ? 'none' : 'translateY(-4px)',
          boxShadow: isPast ? 1 : 6,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {event.image_url ? (
          <CardMedia
            component="img"
            height={180}
            image={event.image_url}
            alt={event.title}
            sx={{
              objectFit: 'cover',
              filter: isPast ? 'grayscale(0.8)' : 'none',
            }}
          />
        ) : (
          <Box
            sx={{
              height: 180,
              background: `linear-gradient(135deg, ${colors.main} 0%, ${colors.light} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: isPast ? 'grayscale(0.8)' : 'none',
            }}
          >
            <CalendarIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.3)' }} />
          </Box>
        )}

        {/* Date badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: 'white',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            minWidth: 48,
          }}
        >
          {hasRange ? (
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.7rem', lineHeight: 1.3, display: 'block' }}>
              {rangeBadge}
            </Typography>
          ) : (
            <>
              <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1, color: 'primary.main' }}>
                {day}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.65rem' }}>
                {month}
              </Typography>
            </>
          )}
        </Box>

        {/* Category chip */}
        <Chip
          label={catLabel}
          size="small"
          color={CATEGORY_MUI[event.category] || 'primary'}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        />

        {/* Finalizado badge */}
        {isPast && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              py: 0.5,
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, fontSize: '0.7rem', letterSpacing: 1 }}>
              FINALIZADO
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {event.description.replace(/<[^>]*>/g, '')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 'auto' }}>
          {event.event_time && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimeIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.secondary">
                {event.event_time} hs
              </Typography>
            </Box>
          )}
          {event.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {event.location}
              </Typography>
            </Box>
          )}
          {event.organizer && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {event.organizer}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;
