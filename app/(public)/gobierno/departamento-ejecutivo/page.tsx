'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Card,
  CardContent,
  Skeleton,
  Alert,
  Chip,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@/state/redux/store';
import { getAuthoritiesByCategoryAsync } from '@/state/redux/authorities';
import { useCachedFetch } from '@/hooks';
import { CACHE_TTL } from '@/constants/cache';
import { sanitizeHtml } from '@/utils/sanitize';
import PageHero from '../../components/PageHero';
import AnimatedSection from '../../components/AnimatedSection';

const DepartamentoEjecutivoPage = () => {
  const { intendente, gabinete, status } = useAppSelector(
    (state) => state.authorities
  );

  const loading = status.getAuthoritiesByCategoryAsync?.loading;

  useCachedFetch({
    selector: (state) => state.authorities.lastFetched,
    dataKey: 'intendente',
    fetchAction: () => getAuthoritiesByCategoryAsync('intendente'),
    ttl: CACHE_TTL.AUTHORITIES,
    hasData: intendente !== null,
  });

  useCachedFetch({
    selector: (state) => state.authorities.lastFetched,
    dataKey: 'gabinete',
    fetchAction: () => getAuthoritiesByCategoryAsync('gabinete'),
    ttl: CACHE_TTL.AUTHORITIES,
    hasData: gabinete.length > 0,
  });

  if (loading && !intendente && gabinete.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Skeleton variant="rectangular" height={400} sx={{ mb: 3, borderRadius: 3 }} />
        <Skeleton variant="text" width="60%" height={60} />
        <Skeleton variant="text" width="40%" sx={{ mb: 4 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      <PageHero
        title="Departamento Ejecutivo"
        subtitle="Autoridades del poder ejecutivo municipal"
        backgroundImage="/pages-hero/gobierno-hero.webp"
        overlayColor="rgba(26,95,139,0.88)"
        overlayColorEnd="rgba(46,134,193,0.72)"
      />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>

        {/* ── INTENDENTE ─────────────────────────────────────────────── */}
        <AnimatedSection animation="fadeInUp">
          {!intendente ? (
            <Alert severity="info" sx={{ mb: 4 }}>
              La información del Intendente no está disponible en este momento.
            </Alert>
          ) : (
            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                mb: 2,
              }}
            >
              {/* Accent left bar */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 5,
                  bgcolor: 'primary.main',
                  borderRadius: '3px 0 0 3px',
                }}
              />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '280px 1fr' },
                  gap: { xs: 3, md: 5 },
                  alignItems: 'flex-start',
                }}
              >
                {/* Photo + role badge */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Avatar
                    src={intendente.photo_url}
                    alt={intendente.full_name}
                    sx={{
                      width: { xs: 180, md: 240 },
                      height: { xs: 180, md: 240 },
                      boxShadow: '0 8px 32px rgba(26,95,139,0.18)',
                      border: '4px solid',
                      borderColor: 'primary.light',
                    }}
                  />
                  <Chip
                    icon={<AccountBalanceIcon sx={{ fontSize: '16px !important' }} />}
                    label="Poder Ejecutivo"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600, letterSpacing: '0.03em' }}
                  />
                </Box>

                {/* Info */}
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      fontSize: '0.72rem',
                    }}
                  >
                    Intendente Municipal
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      color: '#1a1a2e',
                      lineHeight: 1.2,
                      mt: 0.5,
                      mb: 1,
                    }}
                  >
                    {intendente.full_name}
                  </Typography>

                  {intendente.position && (
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        color: 'text.secondary',
                        mb: 2,
                      }}
                    >
                      {intendente.position}
                    </Typography>
                  )}

                  {intendente.department && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {intendente.department}
                    </Typography>
                  )}

                  {/* Contact */}
                  {(intendente.email || intendente.phone) && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.75,
                        p: 2,
                        bgcolor: 'rgba(26,95,139,0.04)',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'rgba(26,95,139,0.12)',
                        mb: 3,
                      }}
                    >
                      {intendente.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon sx={{ fontSize: 16, color: 'primary.main' }} />
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: 16, color: 'primary.main' }} />
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

                  {/* Biography */}
                  {intendente.bio && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 1, color: '#333', letterSpacing: '0.02em' }}
                      >
                        Biografía
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ lineHeight: 1.85, color: 'text.secondary' }}
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(intendente.bio) }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          )}
        </AnimatedSection>

        {/* ── SECTION DIVIDER ─────────────────────────────────────────── */}
        <AnimatedSection animation="fadeInUp">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              my: 7,
            }}
          >
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(0,0,0,0.1)' }} />
            <Box
              sx={{
                px: 3,
                py: 0.875,
                border: '1.5px solid',
                borderColor: 'primary.main',
                borderRadius: 8,
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              Secretarías
            </Box>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(0,0,0,0.1)' }} />
          </Box>
        </AnimatedSection>

        {/* ── GABINETE ────────────────────────────────────────────────── */}
        <AnimatedSection animation="fadeInUp">
          {gabinete.length === 0 ? (
            <Alert severity="info">
              La información del Gabinete Municipal no está disponible en este momento.
            </Alert>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
              }}
            >
              {gabinete.map((authority) => (
                <Card
                  key={authority.id}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 14px 36px rgba(26,95,139,0.15)',
                    },
                    '&:hover .card-accent': {
                      transform: 'scaleY(1)',
                    },
                  }}
                >
                  {/* Left accent bar on hover */}
                  <Box
                    className="card-accent"
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      bgcolor: 'primary.main',
                      transform: 'scaleY(0)',
                      transformOrigin: 'top center',
                      transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                      zIndex: 2,
                      borderRadius: '3px 0 0 3px',
                    }}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                    }}
                  >
                    {/* Photo */}
                    <Box
                      sx={{
                        width: { xs: '100%', sm: 160 },
                        minHeight: { xs: 200, sm: 220 },
                        flexShrink: 0,
                        position: 'relative',
                        overflow: 'hidden',
                        bgcolor: 'grey.100',
                      }}
                    >
                      <Avatar
                        src={authority.photo_url}
                        alt={authority.full_name}
                        variant="square"
                        sx={{
                          width: '100%',
                          height: '100%',
                          position: 'absolute',
                          inset: 0,
                          '& .MuiAvatar-img': {
                            objectFit: 'cover',
                          },
                        }}
                      />
                    </Box>

                    {/* Info */}
                    <CardContent
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2.5,
                        '&:last-child': { pb: 2.5 },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          fontSize: '1.05rem',
                          lineHeight: 1.3,
                          color: '#1a1a2e',
                          mb: 0.75,
                        }}
                      >
                        {authority.full_name}
                      </Typography>

                      <Chip
                        label={authority.position}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{
                          alignSelf: 'flex-start',
                          fontWeight: 600,
                          fontSize: '0.68rem',
                          height: 24,
                          mb: 0.75,
                          letterSpacing: '0.01em',
                        }}
                      />

                      {authority.department && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 500,
                            mb: 1,
                            display: 'block',
                          }}
                        >
                          {authority.department}
                        </Typography>
                      )}

                      {authority.bio && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.8rem',
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 1,
                          }}
                        >
                          {authority.bio.replace(/<[^>]*>/g, '')}
                        </Typography>
                      )}

                      {/* Contact - pushed to bottom */}
                      {(authority.email || authority.phone) && (
                        <Box
                          sx={{
                            mt: 'auto',
                            pt: 1.5,
                            borderTop: '1px solid',
                            borderColor: 'rgba(0,0,0,0.06)',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1.5,
                          }}
                        >
                          {authority.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <EmailIcon sx={{ fontSize: 13, color: 'primary.main' }} />
                              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                <a
                                  href={`mailto:${authority.email}`}
                                  style={{ color: 'inherit', textDecoration: 'none' }}
                                >
                                  {authority.email}
                                </a>
                              </Typography>
                            </Box>
                          )}
                          {authority.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PhoneIcon sx={{ fontSize: 13, color: 'primary.main' }} />
                              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                <a
                                  href={`tel:${authority.phone}`}
                                  style={{ color: 'inherit', textDecoration: 'none' }}
                                >
                                  {authority.phone}
                                </a>
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </AnimatedSection>
      </Container>
    </Box>
  );
};

export default DepartamentoEjecutivoPage;
