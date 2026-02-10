'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Paper,
  Skeleton,
  Alert,
} from '@mui/material';
import { Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { useAppSelector } from '@/state/redux/store';
import { getAuthoritiesByCategoryAsync } from '@/state/redux/authorities';
import { useCachedFetch } from '@/hooks';
import { CACHE_TTL } from '@/constants/cache';
import PageHero from '../../components/PageHero';
import AnimatedSection from '../../components/AnimatedSection';

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
        <PageHero title="Concejo Deliberante" subtitle="Cuerpo legislativo municipal" />
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
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Skeleton variant="text" width="40%" height={60} sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {Array.from(new Array(6)).map((_, index) => (
            <Box key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      <PageHero title="Concejo Deliberante" subtitle="Cuerpo legislativo municipal" />

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
                <Box key={authority.id}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        p: 3,
                      }}
                    >
                      <Avatar
                        src={authority.photo_url}
                        alt={authority.full_name}
                        sx={{
                          width: 100,
                          height: 100,
                          mb: 2,
                          boxShadow: 2,
                        }}
                      />
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {authority.full_name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="primary"
                        gutterBottom
                        sx={{ fontWeight: 500 }}
                      >
                        {authority.position}
                      </Typography>

                      {authority.department && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {authority.department}
                        </Typography>
                      )}

                      {/* Contact */}
                      {(authority.email || authority.phone) && (
                        <Box sx={{ mt: 2, width: '100%' }}>
                          {authority.email && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 0.5,
                              }}
                            >
                              <EmailIcon
                                sx={{
                                  fontSize: 16,
                                  mr: 0.5,
                                  color: 'text.secondary',
                                }}
                              />
                              <Typography variant="caption">
                                <a
                                  href={`mailto:${authority.email}`}
                                  style={{
                                    color: 'inherit',
                                    textDecoration: 'none',
                                  }}
                                >
                                  {authority.email}
                                </a>
                              </Typography>
                            </Box>
                          )}
                          {authority.phone && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <PhoneIcon
                                sx={{
                                  fontSize: 16,
                                  mr: 0.5,
                                  color: 'text.secondary',
                                }}
                              />
                              <Typography variant="caption">
                                <a
                                  href={`tel:${authority.phone}`}
                                  style={{
                                    color: 'inherit',
                                    textDecoration: 'none',
                                  }}
                                >
                                  {authority.phone}
                                </a>
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>
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
