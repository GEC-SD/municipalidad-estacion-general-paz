'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Skeleton,
  Alert,
} from '@mui/material';
import { useAppSelector } from '@/state/redux/store';
import { getMunicipalityInfoAsync } from '@/state/redux/settings';
import { useCachedFetch } from '@/hooks';
import { CACHE_TTL } from '@/constants/cache';
import { sanitizeHtml } from '@/utils/sanitize';
import PageHero from '../../components/PageHero';
import AnimatedSection from '../../components/AnimatedSection';

const HistoriaPage = () => {
  const { municipalityInfo, status } = useAppSelector(
    (state) => state.settings
  );

  useCachedFetch({
    selector: (state) => state.settings.lastFetched,
    dataKey: 'municipalityInfo',
    fetchAction: () => getMunicipalityInfoAsync(),
    ttl: CACHE_TTL.SETTINGS,
    hasData: municipalityInfo !== null,
  });

  const loading = status.getMunicipalityInfoAsync?.loading;
  const error = status.getMunicipalityInfoAsync?.response === 'rejected';

  if (error && !municipalityInfo) {
    return (
      <Box>
        <PageHero title="Historia de la Ciudad" subtitle="Conoce nuestras raíces y patrimonio" />
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
          <Alert severity="error">
            No se pudo cargar la información. Intente nuevamente más tarde.
          </Alert>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Skeleton variant="text" width="60%" height={60} sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" height={300} sx={{ mb: 3 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </Container>
    );
  }

  return (
    <Box>
      <PageHero title="Historia de la Ciudad" subtitle="Conoce nuestras raíces y patrimonio" />

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <AnimatedSection animation="fadeInUp">
        {/* Historia */}
        <Paper sx={{ p: { xs: 3, md: 5 }, mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Nuestra Historia
          </Typography>
          {municipalityInfo?.historia ? (
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.8, textAlign: 'justify' }}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(municipalityInfo.historia) }}
            />
          ) : (
            <Alert severity="info">
              La información histórica no está disponible en este momento.
            </Alert>
          )}
        </Paper>
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={200}>
        {/* Misión y Visión */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
          <Box>
            <Paper
              sx={{
                p: 4,
                height: '100%',
                backgroundColor: 'primary.main',
                color: 'white',
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Misión
              </Typography>
              {municipalityInfo?.mision ? (
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(municipalityInfo.mision) }}
                />
              ) : (
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Trabajar por el bienestar de todos los ciudadanos, promoviendo
                  el desarrollo sostenible, la inclusión social y la calidad de
                  vida de nuestra comunidad.
                </Typography>
              )}
            </Paper>
          </Box>

          <Box>
            <Paper
              sx={{
                p: 4,
                height: '100%',
                backgroundColor: 'secondary.main',
                color: 'white',
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Visión
              </Typography>
              {municipalityInfo?.vision ? (
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(municipalityInfo.vision) }}
                />
              ) : (
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Ser una ciudad modelo en gestión pública, desarrollo
                  económico y social, que garantice oportunidades y bienestar
                  para todas las generaciones.
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={400}>
        {/* Valores */}
        {municipalityInfo?.valores && municipalityInfo.valores.length > 0 && (
          <Paper sx={{ p: { xs: 3, md: 5 }, mt: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Nuestros Valores
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              {municipalityInfo.valores.map((valor: string, index: number) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    border: '2px solid',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {valor}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        )}
        </AnimatedSection>
      </Container>
    </Box>
  );
};

export default HistoriaPage;
