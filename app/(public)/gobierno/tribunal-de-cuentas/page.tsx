'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
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

const TribunalPage = () => {
  const { tribunal = [], status } = useAppSelector((state) => state.authorities);

  useCachedFetch({
    selector: (state) => state.authorities.lastFetched,
    dataKey: 'tribunal',
    fetchAction: () => getAuthoritiesByCategoryAsync('tribunal'),
    ttl: CACHE_TTL.AUTHORITIES,
    hasData: tribunal.length > 0,
  });

  const loading = status.getAuthoritiesByCategoryAsync?.loading;
  const error = status.getAuthoritiesByCategoryAsync?.response === 'rejected';

  if (error && !tribunal.length) {
    return (
      <Box>
        <PageHero title="Honorable Tribunal de Cuentas" subtitle="Órgano de control y fiscalización municipal" backgroundImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80" overlayColor="rgba(26,95,139,0.88)" overlayColorEnd="rgba(46,134,193,0.72)" />
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
        <PageHero title="Honorable Tribunal de Cuentas" subtitle="Órgano de control y fiscalización municipal" backgroundImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80" overlayColor="rgba(26,95,139,0.88)" overlayColorEnd="rgba(46,134,193,0.72)" />
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Skeleton variant="rectangular" height={120} sx={{ mb: 4, borderRadius: 2 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {Array.from({ length: 3 }).map((_, i) => (
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
      <PageHero title="Honorable Tribunal de Cuentas" subtitle="Órgano de control y fiscalización municipal" backgroundImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80" overlayColor="rgba(26,95,139,0.88)" overlayColorEnd="rgba(46,134,193,0.72)" />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <AnimatedSection animation="fadeInUp">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Sobre el Tribunal de Cuentas
          </Typography>
          <Typography variant="body1" paragraph>
            El Honorable Tribunal de Cuentas es el órgano encargado de controlar
            y fiscalizar la administración financiera y patrimonial del municipio.
            Tiene la responsabilidad de examinar las cuentas de la gestión
            municipal, verificando la legalidad, regularidad y corrección de los
            actos administrativos.
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 6 }}>
            Su función principal es garantizar la transparencia en el uso de los
            recursos públicos, realizando auditorías y emitiendo dictámenes sobre
            la rendición de cuentas del Departamento Ejecutivo y demás
            organismos municipales.
          </Typography>
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={200}>
          {tribunal.length === 0 ? (
            <Alert severity="info">
              La información del Tribunal de Cuentas no está disponible en este
              momento.
            </Alert>
          ) : (
            <>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
                Miembros
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {tribunal.map((authority) => (
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

export default TribunalPage;
