'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Chip,
  Breadcrumbs,
  Paper,
  Divider,
  Button,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  ContactPhone as ContactPhoneIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import { getEventBySlugAsync, clearCurrentEvent } from '@/state/redux/events';
import { PUBLIC_ROUTES, EVENT_CATEGORIES } from '@/constants';
import { sanitizeHtml } from '@/utils/sanitize';
import PageHero from '../../components/PageHero';
import AnimatedSection from '../../components/AnimatedSection';

const EventDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentEvent, status } = useAppSelector((state) => state.events);

  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      dispatch(getEventBySlugAsync(slug));
    }

    return () => {
      dispatch(clearCurrentEvent());
    };
  }, [dispatch, slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getCategoryColor = (cat: string): 'primary' | 'secondary' | 'warning' | 'info' | 'success' => {
    const colors: Record<string, 'primary' | 'secondary' | 'warning' | 'info' | 'success'> = {
      cultural: 'secondary',
      deportivo: 'warning',
      institucional: 'primary',
      educativo: 'info',
      social: 'success',
    };
    return colors[cat] || 'primary';
  };

  const loading = status.getEventBySlugAsync?.loading;
  const error = status.getEventBySlugAsync?.response === 'rejected';

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Skeleton variant="text" width="60%" height={60} />
        <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={300} sx={{ mb: 3 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </Container>
    );
  }

  if (error || !currentEvent) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          No se pudo cargar el evento. Es posible que no exista o haya sido eliminado.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(PUBLIC_ROUTES.AGENDA)}
        >
          Volver a Agenda
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      <PageHero title={currentEvent.title} subtitle={formatDate(currentEvent.event_date)} />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <AnimatedSection animation="fadeInUp">
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: 3 }}
          >
            <Link
              href={PUBLIC_ROUTES.HOME}
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
              Inicio
            </Link>
            <Link
              href={PUBLIC_ROUTES.AGENDA}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Agenda
            </Link>
            <Typography color="text.primary">{currentEvent.title}</Typography>
          </Breadcrumbs>

          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push(PUBLIC_ROUTES.AGENDA)}
            sx={{ mb: 3 }}
          >
            Volver a Agenda
          </Button>

          {/* Event Content */}
          <Paper sx={{ p: { xs: 3, md: 4 } }}>
            {/* Category */}
            <Chip
              label={EVENT_CATEGORIES.find((c) => c.value === currentEvent.category)?.label || currentEvent.category}
              color={getCategoryColor(currentEvent.category)}
              sx={{ mb: 2 }}
            />

            {/* Title */}
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.75rem', md: '2.5rem' },
              }}
            >
              {currentEvent.title}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Event Details */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2,
                mb: 3,
                p: 2,
                backgroundColor: 'grey.50',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CalendarIcon color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Fecha</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatDate(currentEvent.event_date)}
                  </Typography>
                  {currentEvent.end_date && currentEvent.end_date !== currentEvent.event_date && (
                    <Typography variant="caption" color="text.secondary">
                      hasta {formatDate(currentEvent.end_date)}
                    </Typography>
                  )}
                </Box>
              </Box>

              {currentEvent.event_time && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <TimeIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Horario</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {currentEvent.event_time} hs
                    </Typography>
                  </Box>
                </Box>
              )}

              {currentEvent.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LocationIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Lugar</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {currentEvent.location}
                    </Typography>
                  </Box>
                </Box>
              )}

              {currentEvent.organizer && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PersonIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Organizador</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {currentEvent.organizer}
                    </Typography>
                  </Box>
                </Box>
              )}

              {currentEvent.contact_info && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ContactPhoneIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Contacto</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {currentEvent.contact_info}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Image */}
            {currentEvent.image_url && (
              <Box
                component="img"
                src={currentEvent.image_url}
                alt={currentEvent.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  mb: 3,
                }}
              />
            )}

            {/* Description */}
            <Box
              className="rich-text-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentEvent.description) }}
            />
          </Paper>

          {/* Back Button Bottom */}
          <Box sx={{ mt: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push(PUBLIC_ROUTES.AGENDA)}
              variant="outlined"
            >
              Volver a Agenda
            </Button>
          </Box>
        </AnimatedSection>
      </Container>
    </Box>
  );
};

export default EventDetailPage;
