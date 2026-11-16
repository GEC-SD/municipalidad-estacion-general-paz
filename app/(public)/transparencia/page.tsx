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
  AccountBalanceWallet as FinancialIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import {
  getRegulationsAsync,
  setRegulationFilters,
} from '@/state/redux/regulations';
import { REGULATION_CATEGORIES } from '@/constants';
import { usePagination } from '@/hooks';
import { useDebounce } from '@/hooks';
import { FinancialDocument, Regulation, RegulationCategory, RegulationType } from '@/types';
import { supabase } from '@/state/supabase/config';
import PageHero from '../components/PageHero';
import AnimatedSection from '../components/AnimatedSection';

// react-pdf usa canvas/worker — no soporta SSR
const PdfViewerModal = dynamic(() => import('./PdfViewerModal'), {
  ssr: false,
});

const TAB_CONFIG: { value: RegulationType | 'financial'; label: string }[] = [
  { value: 'ordenanza', label: 'Ordenanzas' },
  { value: 'decreto', label: 'Decretos' },
  { value: 'financial', label: 'Presupuestos y Balances' },
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
  const [financialDocuments, setFinancialDocuments] = useState<FinancialDocument[]>([]);
  const [financialLoading, setFinancialLoading] = useState(true);
  const [financialSearch, setFinancialSearch] = useState('');
  const [financialCategory, setFinancialCategory] = useState<'all' | FinancialDocument['document_type']>('all');
  const [selectedFinancialPdf, setSelectedFinancialPdf] = useState<{ url: string; title: string } | null>(null);

  const currentType = TAB_CONFIG[activeTab].value;
  const normalizedFinancialSearch = financialSearch.trim().toLocaleLowerCase('es-AR');
  const filteredFinancialDocuments = financialDocuments.filter((document) => {
    const matchesTitle = document.title.toLocaleLowerCase('es-AR').includes(normalizedFinancialSearch);
    const matchesCategory = financialCategory === 'all' || document.document_type === financialCategory;

    return matchesTitle && matchesCategory;
  });

  useEffect(() => {
    if (currentType === 'financial') return;
    dispatch(
      getRegulationsAsync({
        page,
        limit: 12,
        filters: {
          year: filters.year,
          category: filters.category,
          search: debouncedSearch,
          type: currentType,
        },
      })
    );
  }, [dispatch, page, filters.year, filters.category, debouncedSearch, currentType]);

  useEffect(() => {
    if (currentType !== 'financial') return;
    let active = true;
    supabase
      .from('financial_documents')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (active) {
          setFinancialDocuments((data ?? []) as FinancialDocument[]);
          setFinancialLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [currentType]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const handleMobileSectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActiveTab(Number(event.target.value));
    setPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const category = e.target.value;
    dispatch(
      setRegulationFilters({
        ...filters,
        category: category === 'all' ? undefined : category as RegulationCategory,
      })
    );
    setPage(1);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = e.target.value;
    dispatch(
      setRegulationFilters({
        ...filters,
        year: year === 'all' ? undefined : Number(year),
      })
    );
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRegulationFilters({ ...filters, search: e.target.value }));
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const loading = status.getRegulationsAsync?.loading;

  return (
    <Box>
      <PageHero
        title="Transparencia"
        subtitle="Consultá ordenanzas, decretos, presupuestos y balances municipales"
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
              border: { xs: 1, sm: 0 },
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: '#fff',
              borderRadius: { xs: 3, sm: '12px 12px 0 0' },
              boxShadow: { xs: '0 8px 24px rgba(15, 23, 42, 0.08)', sm: '0 1px 3px rgba(0,0,0,0.08)' },
              p: { xs: 2, sm: 0 },
            }}
          >
            <TextField
              select
              fullWidth
              label="Sección"
              value={activeTab}
              onChange={handleMobileSectionChange}
              sx={{
                display: { xs: 'flex', sm: 'none' },
                '& .MuiInputBase-root': {
                  minHeight: 56,
                  borderRadius: 2.5,
                  backgroundColor: '#F8FAFC',
                  fontSize: '1rem',
                },
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      mt: 1,
                      borderRadius: 2.5,
                      boxShadow: '0 12px 32px rgba(15, 23, 42, 0.16)',
                    },
                  },
                  MenuListProps: { sx: { p: 0.75 } },
                },
              }}
            >
              {TAB_CONFIG.map((tab, index) => (
                <MenuItem
                  key={tab.value}
                  value={index}
                  sx={{
                    minHeight: 52,
                    borderRadius: 2,
                    gap: 1.25,
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&.Mui-selected': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(43, 143, 198, 0.10)',
                    },
                  }}
                >
                  {tab.value === 'ordenanza' ? <OrdenanzaIcon /> : tab.value === 'decreto' ? <DecretoIcon /> : <FinancialIcon />}
                  {tab.label}
                </MenuItem>
              ))}
            </TextField>

            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                display: { xs: 'none', sm: 'flex' },
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
                  icon={tab.value === 'ordenanza' ? <OrdenanzaIcon /> : tab.value === 'decreto' ? <DecretoIcon /> : <FinancialIcon />}
                  iconPosition="start"
                  label={tab.label}
                />
              ))}
            </Tabs>
          </Box>
        </AnimatedSection>

        {currentType !== 'financial' && <AnimatedSection animation="fadeInUp" delay={100}>
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
        </AnimatedSection>}

        {currentType !== 'financial' ? <AnimatedSection animation="fadeInUp" delay={200}>
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
        </AnimatedSection> : (
          <AnimatedSection animation="fadeInUp" delay={100}>
            <Box
              sx={{
                mb: 4,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 2fr) minmax(200px, 1fr)' },
                gap: 2,
              }}
            >
              <TextField
                label="Buscar por título"
                variant="outlined"
                size="small"
                value={financialSearch}
                onChange={(event) => setFinancialSearch(event.target.value)}
                placeholder="Ej.: Presupuesto 2026"
              />
              <TextField
                select
                label="Categoría"
                variant="outlined"
                size="small"
                value={financialCategory}
                onChange={(event) => setFinancialCategory(event.target.value as 'all' | FinancialDocument['document_type'])}
              >
                <MenuItem value="all">Todas las categorías</MenuItem>
                <MenuItem value="presupuesto">Presupuesto</MenuItem>
                <MenuItem value="balance">Balance</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              {financialLoading
                ? Array.from(new Array(4)).map((_, index) => (
                    <Card key={index}><CardContent><Skeleton variant="text" width="40%" /><Skeleton variant="text" width="80%" /></CardContent></Card>
                  ))
                : filteredFinancialDocuments.map((document) => (
                    <Card key={document.id} sx={{ borderTop: 3, borderColor: document.document_type === 'presupuesto' ? 'primary.main' : 'secondary.main' }}>
                      <CardContent>
                        <Chip
                          label={document.document_type === 'presupuesto' ? 'Presupuesto' : 'Balance'}
                          color={document.document_type === 'presupuesto' ? 'primary' : 'secondary'}
                          size="small"
                          sx={{ mb: 1.5 }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{document.title}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {document.pdf_urls.map((url, index) => (
                            <Button
                              key={url}
                              variant="outlined"
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => setSelectedFinancialPdf({ url, title: `${document.title} — PDF ${index + 1}` })}
                            >
                              Visualizar PDF {document.pdf_urls.length > 1 ? index + 1 : ''}
                            </Button>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
            </Box>
            {!financialLoading && filteredFinancialDocuments.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {financialDocuments.length === 0
                    ? 'No hay presupuestos o balances publicados.'
                    : 'No se encontraron documentos.'}
                </Typography>
                {financialDocuments.length > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Intentá ajustar el título o la categoría seleccionada.
                  </Typography>
                )}
              </Box>
            )}
          </AnimatedSection>
        )}
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
      {selectedFinancialPdf && (
        <PdfViewerModal
          open
          onClose={() => setSelectedFinancialPdf(null)}
          pdfUrl={selectedFinancialPdf.url}
          title={selectedFinancialPdf.title}
        />
      )}
    </Box>
  );
};

export default TransparenciaPage;
