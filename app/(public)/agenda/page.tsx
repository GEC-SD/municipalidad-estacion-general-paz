'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Skeleton,
  Pagination,
  Tabs,
  Tab,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  EventNote as EventNoteIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import {
  getEventsAsync,
  getMonthEventsAsync,
  setEventFilters,
} from '@/state/redux/events';
import { EVENT_CATEGORIES } from '@/constants';
import { EventCategory } from '@/types';
import PageHero from '../components/PageHero';
import AnimatedSection from '../components/AnimatedSection';
import EventCalendar from './EventCalendar';
import EventCard from './EventCard';

const AgendaPage = () => {
  const dispatch = useAppDispatch();
  const { events, monthEvents, pagination, filters, status } = useAppSelector(
    (state) => state.events
  );

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [tab, setTab] = useState(0); // 0 = Próximos, 1 = Pasados

  const showPast = tab === 1;

  // Fetch list events
  useEffect(() => {
    dispatch(
      getEventsAsync({
        page: pagination.page,
        limit: 9,
        filters: { ...filters, upcoming: !showPast },
      })
    );
  }, [dispatch, pagination.page, filters, showPast]);

  // Fetch calendar events on mount
  useEffect(() => {
    const now = new Date();
    dispatch(getMonthEventsAsync({ year: now.getFullYear(), month: now.getMonth() + 1 }));
  }, [dispatch]);

  const handleMonthChange = useCallback(
    (year: number, month: number) => {
      dispatch(getMonthEventsAsync({ year, month }));
    },
    [dispatch]
  );

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
    dispatch(
      getEventsAsync({ page, limit: 9, filters: { ...filters, upcoming: !showPast } })
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loading = status.getEventsAsync?.loading;

  return (
    <>
      <PageHero
        title="Agenda de Eventos"
        subtitle="Actividades culturales, deportivas e institucionales de nuestra ciudad"
        backgroundImage="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80"
        overlayColor="rgba(245,166,35,0.88)"
        overlayColorEnd="rgba(253,216,53,0.7)"
      />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Calendar Section */}
        <AnimatedSection>
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <CalendarIcon sx={{ fontSize: 28, color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Calendario
              </Typography>
            </Box>
            <EventCalendar events={monthEvents} onMonthChange={handleMonthChange} />
          </Box>
        </AnimatedSection>

        {/* Divider */}
        <Box
          sx={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(46,134,193,0.2) 50%, transparent)',
            mb: { xs: 4, md: 6 },
          }}
        />

        {/* Events List Section */}
        <AnimatedSection delay={200}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <EventNoteIcon sx={{ fontSize: 28, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Todos los Eventos
            </Typography>
          </Box>

          {/* Tabs */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 3,
            }}
          >
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Próximos" sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label="Pasados" sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>
          </Box>

          {/* Filters */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
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
            : events.map((event, index) => (
                <AnimatedSection key={event.id} delay={index * 100}>
                  <EventCard event={event} />
                </AnimatedSection>
              ))}
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
