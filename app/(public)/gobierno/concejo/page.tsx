'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  Skeleton,
  Alert,
} from '@mui/material';
import { useAppSelector } from '@/state/redux/store';
import { getAuthoritiesByCategoryAsync } from '@/state/redux/authorities';
import { useCachedFetch } from '@/hooks';
import { CACHE_TTL } from '@/constants/cache';
import PageHero from '../../components/PageHero';
import AnimatedSection from '../../components/AnimatedSection';
import { AuthorityCard } from '../../components/AuthorityCard';

const ConcejoPage = () => {
  const { concejo, status } = useAppSelector((state) => state.authorities);

  useCachedFetch({
    selector: (state) => state.authorities.lastFetched,
    dataKey: 'concejo',
    fetchAction: () => getAuthoritiesByCategoryAsync('concejo'),
    ttl: CACHE_TTL.AUTHORITIES,
    hasData: concejo.length > 0,
  });

  const loading = status.getAuthoritiesByCategoryAsync?.loading;
  const error = status.getAuthoritiesByCategoryAsync?.response === 'rejected';

  if (error && !concejo.length) {
    return (
      <Box>
        <PageHero title="Concejo Deliberante" subtitle="Cuerpo legislativo municipal" backgroundImage="https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1600&q=80" overlayColor="rgba(26,95,139,0.88)" overlayColorEnd="rgba(46,134,193,0.72)" />
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Alert severity="error">
            No se pudo cargar la información. Intente nuevamente más tarde.
          </Alert>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box>
        <PageHero title="Honorable Concejo Deliberante" subtitle="Cuerpo legislativo municipal" backgroundImage="https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1600&q=80" overlayColor="rgba(26,95,139,0.88)" overlayColorEnd="rgba(46,134,193,0.72)" />
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Skeleton variant="rectangular" height={120} sx={{ mb: 4, borderRadius: 2 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent sx={{ p: 2.5 }}>
                  <Skeleton variant="text" width="75%" height={28} />
                  <Skeleton variant="rounded" width={120} height={24} sx={{ my: 1 }} />
                  <Skeleton variant="text" width="90%" />
                  <Skeleton variant="text" width="70%" />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <PageHero title="Honorable Concejo Deliberante" subtitle="Cuerpo legislativo municipal" backgroundImage="https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1600&q=80" overlayColor="rgba(26,95,139,0.88)" overlayColorEnd="rgba(46,134,193,0.72)" />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <AnimatedSection animation="fadeInUp">
          {/* About Section */}
          <Paper sx={{ p: 4, mb: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Sobre el Concejo Deliberante
            </Typography>
            <Typography variant="body1" paragraph>
              El Concejo Deliberante es el órgano legislativo de la Municipalidad.
              Está integrado por concejales elegidos por el voto popular, quienes
              tienen la responsabilidad de sancionar ordenanzas, aprobar el
              presupuesto municipal y fiscalizar los actos del Departamento
              Ejecutivo.
            </Typography>
            <Typography variant="body1">
              Los concejales representan los intereses de los ciudadanos y trabajan
              para promover el bienestar general de la comunidad a través de la
              elaboración de normas y el control de la gestión municipal.
            </Typography>
          </Paper>
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={200}>
          {/* Concejales Grid */}
          {concejo.length === 0 ? (
            <Alert severity="info">
              La información del Concejo Deliberante no está disponible en este
              momento.
            </Alert>
          ) : (
            <>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
                Concejales
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {concejo.map((authority) => (
                  <AuthorityCard key={authority.id} authority={authority} />
                ))}
              </Box>
            </>
          )}
        </AnimatedSection>
      </Container>
    </Box>
  );
};

export default ConcejoPage;
