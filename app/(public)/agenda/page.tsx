'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  MenuItem,
  Skeleton,
  Pagination,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import { getEventsAsync, setEventFilters } from '@/state/redux/events';
import { EVENT_CATEGORIES, PUBLIC_ROUTES } from '@/constants';
import { EventCategory } from '@/types';
import PageHero from '../components/PageHero';
import AnimatedSection from '../components/AnimatedSection';

const AgendaPage = () => {
  const dispatch = useAppDispatch();
  const { events, pagination, filters, status } = useAppSelector((state) => state.events);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    dispatch(
      getEventsAsync({
        page: pagination.page,
        limit: 9,
        filters: {
          ...filters,
          upcoming: !showPast,
        },
      })
    );
  }, [dispatch, pagination.page, filters, showPast]);

  const handleSearch = (value: string) => {
    setSearch(value);
    dispatch(setEventFilters({ ...filters, search: value || undefined }));
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    dispatch(
      setEventFilters({
        ...filters,
        category: (value as EventCategory) || undefined,
      })
    );
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(getEventsAsync({ page, limit: 9, filters: { ...filters, upcoming: !showPast } }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (date: string) => {
    return new Date(date + 'T00:00:00').toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatShortDate = (date: string) => {
    const d = new Date(date + 'T00:00:00');
    return {
      day: d.getDate(),
      month: d.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase(),
    };
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

  const getCategoryLabel = (cat: string) => {
    return EVENT_CATEGORIES.find((c) => c.value === cat)?.label || cat;
  };

  const loading = status.getEventsAsync?.loading;

  return (
    <>
      <PageHero
        title="Agenda de Eventos"
        subtitle="Actividades culturales, deportivas e institucionales de nuestra ciudad"
      />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Filters */}
        <AnimatedSection>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
              gap: 2,
              mb: 4,
            }}
          >
            <TextField
              size="small"
              label="Buscar evento"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              fullWidth
            />
            <TextField
              size="small"
              select
              label="Categoría"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Todas</MenuItem>
              {EVENT_CATEGORIES.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              select
              label="Mostrar"
              value={showPast ? 'past' : 'upcoming'}
              onChange={(e) => setShowPast(e.target.value === 'past')}
              fullWidth
            >
              <MenuItem value="upcoming">Próximos eventos</MenuItem>
              <MenuItem value="past">Eventos pasados</MenuItem>
            </TextField>
          </Box>
        </AnimatedSection>

        {/* Events Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {loading
            ? Array.from(new Array(6)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={320}
                  sx={{ borderRadius: 3 }}
                />
              ))
            : events.map((event, index) => {
                const shortDate = formatShortDate(event.event_date);
                return (
                  <AnimatedSection key={event.id} delay={index * 100}>
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
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6,
                        },
                      }}
                    >
                      {/* Date Badge + Image */}
                      <Box sx={{ position: 'relative' }}>
                        {event.image_url ? (
                          <CardMedia
                            component="img"
                            height={180}
                            image={event.image_url}
                            alt={event.title}
                            sx={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: 180,
                              background: `linear-gradient(135deg, ${
                                getCategoryColor(event.category) === 'secondary'
                                  ? '#B52A1C'
                                  : getCategoryColor(event.category) === 'warning'
                                  ? '#F5A623'
                                  : getCategoryColor(event.category) === 'info'
                                  ? '#0288d1'
                                  : getCategoryColor(event.category) === 'success'
                                  ? '#2E7D32'
                                  : '#2E86C1'
                              } 0%, ${
                                getCategoryColor(event.category) === 'secondary'
                                  ? '#D4554A'
                                  : getCategoryColor(event.category) === 'warning'
                                  ? '#F7BC5A'
                                  : getCategoryColor(event.category) === 'info'
                                  ? '#03a9f4'
                                  : getCategoryColor(event.category) === 'success'
                                  ? '#4caf50'
                                  : '#5DA9D9'
                              } 100%)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
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
                            boxShadow: 2,
                            minWidth: 48,
                          }}
                        >
                          <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1, color: 'primary.main' }}>
                            {shortDate.day}
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.65rem' }}>
                            {shortDate.month}
                          </Typography>
                        </Box>

                        {/* Category chip */}
                        <Chip
                          label={getCategoryLabel(event.category)}
                          size="small"
                          color={getCategoryColor(event.category)}
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
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
                          {event.description}
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
                  </AnimatedSection>
                );
              })}
        </Box>

        {/* Empty state */}
        {!loading && events.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CalendarIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {showPast ? 'No hay eventos pasados' : 'No hay eventos próximos'}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {showPast
                ? 'Aún no se han registrado eventos anteriores'
                : 'Próximamente se publicarán nuevos eventos'}
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>
    </>
  );
};

export default AgendaPage;
