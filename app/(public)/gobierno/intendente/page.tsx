'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Skeleton,
  Alert,
} from '@mui/material';
import { Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { useAppSelector } from '@/state/redux/store';
import { getAuthoritiesByCategoryAsync } from '@/state/redux/authorities';
import { useCachedFetch } from '@/hooks';
import { CACHE_TTL } from '@/constants/cache';
import { sanitizeHtml } from '@/utils/sanitize';
import PageHero from '../../components/PageHero';
import AnimatedSection from '../../components/AnimatedSection';

const IntendentePage = () => {
  const { intendente, status } = useAppSelector((state) => state.authorities);

  useCachedFetch({
    selector: (state) => state.authorities.lastFetched,
    dataKey: 'intendente',
    fetchAction: () => getAuthoritiesByCategoryAsync('intendente'),
    ttl: CACHE_TTL.AUTHORITIES,
    hasData: intendente !== null,
  });

  const loading = status.getAuthoritiesByCategoryAsync?.loading;
  const error = status.getAuthoritiesByCategoryAsync?.response === 'rejected';

  if (error && !intendente) {
    return (
      <Box>
        <PageHero title="Intendente" subtitle="Máxima autoridad ejecutiva municipal" backgroundImage="/pages-hero/gobierno-hero.webp" overlayColor="rgba(26,95,139,0.88)" overlayColorEnd="rgba(46,134,193,0.72)" />
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
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Skeleton variant="rectangular" height={400} sx={{ mb: 3 }} />
        <Skeleton variant="text" width="60%" height={60} />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Container>
    );
  }

  if (!intendente) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Alert severity="info">
          La información del Intendente no está disponible en este momento.
        </Alert>
      </Container>
    );
  }

  return (
    <Box>
      <PageHero title="Intendente" subtitle="Máxima autoridad ejecutiva municipal" backgroundImage="/pages-hero/gobierno-hero.webp" overlayColor="rgba(26,95,139,0.88)" overlayColorEnd="rgba(46,134,193,0.72)" />

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <AnimatedSection animation="fadeInUp">
        <Paper sx={{ p: { xs: 3, md: 5 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 4 }}>
            {/* Photo */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar
                src={intendente.photo_url}
                alt={intendente.full_name}
                sx={{
                  width: { xs: 200, md: 250 },
                  height: { xs: 200, md: 250 },
                  boxShadow: 3,
                }}
              />
            </Box>

            {/* Info */}
            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                {intendente.full_name}
              </Typography>
              <Typography
                variant="h6"
                color="primary"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                {intendente.position}
              </Typography>

              {intendente.department && (
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {intendente.department}
                </Typography>
              )}

              {/* Contact Info */}
              {(intendente.email || intendente.phone) && (
                <Box sx={{ mt: 3 }}>
                  {intendente.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        <a
                          href={`mailto:${intendente.email}`}
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          {intendente.email}
                        </a>
                      </Typography>
                    </Box>
                  )}
                  {intendente.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        <a
                          href={`tel:${intendente.phone}`}
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          {intendente.phone}
                        </a>
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>

          {/* Biography */}
          {intendente.bio && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Biografía
              </Typography>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, textAlign: 'justify' }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(intendente.bio) }}
              />
            </Box>
          )}
        </Paper>
        </AnimatedSection>
      </Container>
    </Box>
  );
};

export default IntendentePage;
