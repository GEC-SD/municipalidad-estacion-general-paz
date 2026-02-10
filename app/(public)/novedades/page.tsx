'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  Pagination,
  TextField,
  MenuItem,
  Skeleton,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import {
  getPublishedNewsAsync,
  setNewsFilters,
  clearNewsFilters,
} from '@/state/redux/news';
import { PUBLIC_ROUTES, NEWS_CATEGORIES } from '@/constants';
import { usePagination } from '@/hooks';
import { useDebounce } from '@/hooks';
import PageHero from '../components/PageHero';
import AnimatedSection from '../components/AnimatedSection';

const NovedadesPage = () => {
  const dispatch = useAppDispatch();
  const { newsList, pagination, filters, status } = useAppSelector(
    (state) => state.news
  );

  const { page, setPage } = usePagination({ initialPage: 1, initialLimit: 9 });
  const debouncedSearch = useDebounce(filters.search || '', 500);

  useEffect(() => {
    dispatch(
      getPublishedNewsAsync({
        page,
        limit: 9,
        category: filters.category,
      })
    );
  }, [dispatch, page, filters.category, debouncedSearch]);

  const handleCategoryChange = (e: any) => {
    const category = e.target.value;
    dispatch(
      setNewsFilters({
        ...filters,
        category: category === 'all' ? undefined : category,
      })
    );
    setPage(1);
  };

  const handleSearchChange = (e: any) => {
    dispatch(setNewsFilters({ ...filters, search: e.target.value }));
    setPage(1);
  };

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const loading = status.getPublishedNewsAsync?.loading;

  return (
    <Box>
      <PageHero
        title="Novedades"
        subtitle="Mantente informado sobre las últimas noticias y eventos de nuestra ciudad"
      />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
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
          placeholder="Buscar por título o contenido..."
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
          {NEWS_CATEGORIES.map((cat) => (
            <MenuItem key={cat.value} value={cat.value}>
              {cat.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      </AnimatedSection>

      <AnimatedSection animation="fadeInUp" delay={200}>
      {/* News Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        {loading
          ? Array.from(new Array(9)).map((_, index) => (
              <Box key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="100%" />
                  </CardContent>
                </Card>
              </Box>
            ))
          : newsList.map((news) => (
              <Box key={news.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardActionArea
                    component={Link}
                    href={PUBLIC_ROUTES.NOVEDADES_DETALLE(news.slug)}
                    sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    {news.featured_image_url && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={news.featured_image_url}
                        alt={news.title}
                      />
                    )}
                    <CardContent sx={{ flex: 1 }}>
                      {news.category && (
                        <Chip
                          label={
                            NEWS_CATEGORIES.find((c) => c.value === news.category)
                              ?.label || news.category
                          }
                          size="small"
                          color="primary"
                          sx={{ mb: 1 }}
                        />
                      )}
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {news.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mb: 1 }}
                      >
                        {formatDate(news.published_at || news.created_at)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {news.excerpt}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            ))}
      </Box>

      {/* Empty State */}
      {!loading && newsList.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron novedades
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

export default NovedadesPage;
