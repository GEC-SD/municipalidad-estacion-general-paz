'use client';

import { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Pagination,
  TextField,
  MenuItem,
  Button,
  Skeleton,
  IconButton,
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import {
  getRegulationsAsync,
  setRegulationFilters,
  clearRegulationFilters,
} from '@/state/redux/regulations';
import { REGULATION_CATEGORIES } from '@/constants';
import { usePagination } from '@/hooks';
import { useDebounce } from '@/hooks';
import PageHero from '../components/PageHero';
import AnimatedSection from '../components/AnimatedSection';

const NormativaPage = () => {
  const dispatch = useAppDispatch();
  const { regulations, pagination, filters, status } = useAppSelector(
    (state) => state.regulations
  );

  const { page, setPage } = usePagination({ initialPage: 1, initialLimit: 12 });
  const debouncedSearch = useDebounce(filters.search || '', 500);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  useEffect(() => {
    dispatch(
      getRegulationsAsync({
        page,
        limit: 12,
        filters,
      })
    );
  }, [dispatch, page, filters.year, filters.category, debouncedSearch]);

  const handleCategoryChange = (e: any) => {
    const category = e.target.value;
    dispatch(
      setRegulationFilters({
        ...filters,
        category: category === 'all' ? undefined : category,
      })
    );
    setPage(1);
  };

  const handleYearChange = (e: any) => {
    const year = e.target.value;
    dispatch(
      setRegulationFilters({
        ...filters,
        year: year === 'all' ? undefined : Number(year),
      })
    );
    setPage(1);
  };

  const handleSearchChange = (e: any) => {
    dispatch(setRegulationFilters({ ...filters, search: e.target.value }));
    setPage(1);
  };

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  const loading = status.getRegulationsAsync?.loading;

  return (
    <Box>
      <PageHero title="Normativa Municipal" subtitle="Consulta ordenanzas y regulaciones municipales" />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <AnimatedSection animation="fadeInUp">
        {/* Filters */}
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <TextField
            label="Buscar"
            variant="outlined"
            size="small"
            value={filters.search || ''}
            onChange={handleSearchChange}
            sx={{ flex: 1 }}
            placeholder="Buscar por título o número..."
          />
          <TextField
            select
            label="Categoría"
            variant="outlined"
            size="small"
            value={filters.category || 'all'}
            onChange={handleCategoryChange}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">Todas las categorías</MenuItem>
            {REGULATION_CATEGORIES.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Año"
            variant="outlined"
            size="small"
            value={filters.year || 'all'}
            onChange={handleYearChange}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">Todos los años</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={200}>
        {/* Regulations Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          {loading
            ? Array.from(new Array(12)).map((_, index) => (
                <Box key={index}>
                  <Card>
                    <CardContent>
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="60%" />
                    </CardContent>
                  </Card>
                </Box>
              ))
            : regulations.map((regulation) => (
                <Box key={regulation.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardContent sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          >
                            N° {regulation.regulation_number}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Año {regulation.year}
                          </Typography>
                        </Box>
                        <IconButton
                          component="a"
                          href={regulation.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          color="primary"
                          size="small"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Box>

                      {regulation.category && (
                        <Chip
                          label={
                            REGULATION_CATEGORIES.find(
                              (c) => c.value === regulation.category
                            )?.label || regulation.category
                          }
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      )}

                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {regulation.title}
                      </Typography>

                      {regulation.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 2,
                          }}
                        >
                          {regulation.description}
                        </Typography>
                      )}

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PictureAsPdfIcon />}
                        component="a"
                        href={regulation.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        fullWidth
                      >
                        Ver PDF
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              ))}
        </Box>

        {/* Empty State */}
        {!loading && regulations.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No se encontró normativa
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intenta ajustar los filtros de búsqueda
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={pagination.totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
        </AnimatedSection>
      </Container>
    </Box>
  );
};

export default NormativaPage;
