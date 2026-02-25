'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Gavel as OrdenanzaIcon,
  Description as DecretoIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import {
  getRegulationsAsync,
  setRegulationFilters,
} from '@/state/redux/regulations';
import { REGULATION_CATEGORIES } from '@/constants';
import { usePagination } from '@/hooks';
import { useDebounce } from '@/hooks';
import { Regulation, RegulationType } from '@/types';
import PageHero from '../components/PageHero';
import AnimatedSection from '../components/AnimatedSection';

// react-pdf usa canvas/worker — no soporta SSR
const PdfViewerModal = dynamic(() => import('./PdfViewerModal'), {
  ssr: false,
});

const TAB_CONFIG: { value: RegulationType; label: string }[] = [
  { value: 'ordenanza', label: 'Ordenanzas' },
  { value: 'decreto', label: 'Decretos' },
];

const TransparenciaPage = () => {
  const dispatch = useAppDispatch();
  const { regulations, pagination, filters, status } = useAppSelector(
    (state) => state.regulations
  );

  const { page, setPage } = usePagination({ initialPage: 1, initialLimit: 12 });
  const debouncedSearch = useDebounce(filters.search || '', 500);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Modal state
  const [selectedRegulation, setSelectedRegulation] = useState<Regulation | null>(null);

  const currentType = TAB_CONFIG[activeTab].value;

  useEffect(() => {
    dispatch(
      getRegulationsAsync({
        page,
        limit: 12,
        filters: { ...filters, type: currentType },
      })
    );
  }, [dispatch, page, filters.year, filters.category, debouncedSearch, currentType]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPage(1);
  };

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
      <PageHero
        title="Transparencia"
        subtitle="Consultá ordenanzas, decretos y toda la normativa municipal"
        backgroundImage="/pages-hero/transparencia-hero.webp"
        overlayColor="rgba(181,42,28,0.85)"
        overlayColorEnd="rgba(245,166,35,0.7)"
      />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        {/* Tabs */}
        <AnimatedSection animation="fadeInUp">
          <Box
            sx={{
              mb: 4,
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: '#fff',
              borderRadius: '12px 12px 0 0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  py: 2,
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  gap: 1,
                },
              }}
            >
              {TAB_CONFIG.map((tab) => (
                <Tab
                  key={tab.value}
                  icon={tab.value === 'ordenanza' ? <OrdenanzaIcon /> : <DecretoIcon />}
                  iconPosition="start"
                  label={tab.label}
                />
              ))}
            </Tabs>
          </Box>
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={100}>
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
                        cursor: 'pointer',
                        borderTop: 3,
                        borderColor: regulation.type === 'ordenanza' ? 'primary.main' : 'secondary.main',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-2px)',
                        },
                      }}
                      onClick={() => setSelectedRegulation(regulation)}
                    >
                      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                              color={regulation.type === 'ordenanza' ? 'primary' : 'secondary'}
                              sx={{ fontWeight: 600 }}
                            >
                              N° {regulation.regulation_number}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Año {regulation.year}
                            </Typography>
                          </Box>
                        </Box>

                        {regulation.category && (
                          <Chip
                            label={
                              REGULATION_CATEGORIES.find(
                                (c) => c.value === regulation.category
                              )?.label || regulation.category
                            }
                            size="small"
                            sx={{ mb: 1, alignSelf: 'flex-start' }}
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
                              flex: 1,
                            }}
                          >
                            {regulation.description}
                          </Typography>
                        )}

                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          fullWidth
                          color={regulation.type === 'ordenanza' ? 'primary' : 'secondary'}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRegulation(regulation);
                          }}
                        >
                          Consultar
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
                No se encontraron {currentType === 'ordenanza' ? 'ordenanzas' : 'decretos'}
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

      {/* PDF Viewer Modal */}
      {selectedRegulation && (
        <PdfViewerModal
          open={!!selectedRegulation}
          onClose={() => setSelectedRegulation(null)}
          pdfUrl={selectedRegulation.pdf_url}
          title={selectedRegulation.title}
          regulationNumber={selectedRegulation.regulation_number}
        />
      )}
    </Box>
  );
};

export default TransparenciaPage;
