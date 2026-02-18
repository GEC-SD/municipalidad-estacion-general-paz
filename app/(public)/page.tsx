'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Skeleton,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  InfoOutlined as InfoOutlinedIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@/state/redux/store';
import { getFeaturedNewsAsync } from '@/state/redux/news';
import { useCachedFetch } from '@/hooks';
import { CACHE_TTL } from '@/constants/cache';
import { PUBLIC_ROUTES, SERVICES } from '@/constants';
import { SAMPLE_OBRAS } from '@/constants/sampleObras';
import HeroCarousel from './components/HeroCarousel';
import AnimatedSection from './components/AnimatedSection';
import SectionTitle from './components/SectionTitle';
import NewsCard from './components/NewsCard';
import EmergencyPhones from './components/EmergencyPhones';

const heroSlides = [
  {
    id: '1',
    title: 'Bienvenidos a Estación General Paz',
    subtitle: 'Trabajando juntos por una ciudad mejor. Accedé a todos los servicios municipales desde un solo lugar.',
    ctaText: 'Ver Novedades',
    ctaHref: PUBLIC_ROUTES.NOVEDADES,
    backgroundImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1600&q=80',
    overlayColor: 'rgba(26, 95, 139, 0.85)',
    overlayColorEnd: 'rgba(46, 134, 193, 0.65)',
  },
  {
    id: '2',
    title: 'Areas Municipales a tu Alcance',
    subtitle: 'Salud, cultura, deporte y educación. Todo lo que necesitás al alcance de un click.',
    ctaText: 'Explorar Areas',
    ctaHref: PUBLIC_ROUTES.SERVICIOS,
    backgroundImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80',
    overlayColor: 'rgba(67, 160, 71, 0.82)',
    overlayColorEnd: 'rgba(46, 134, 193, 0.7)',
  },
  {
    id: '3',
    title: 'Transparencia y Compromiso',
    subtitle: 'Consultá normativas, ordenanzas y toda la información institucional de nuestra ciudad.',
    ctaText: 'Ver Transparencia',
    ctaHref: PUBLIC_ROUTES.TRANSPARENCIA,
    backgroundImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1600&q=80',
    overlayColor: 'rgba(181, 42, 28, 0.82)',
    overlayColorEnd: 'rgba(245, 166, 35, 0.65)',
  },
];

const HomePage = () => {
  const { featuredNews, status } = useAppSelector((state) => state.news);

  useCachedFetch({
    selector: (state) => state.news.lastFetched,
    dataKey: 'featuredNews',
    fetchAction: () => getFeaturedNewsAsync(4),
    ttl: CACHE_TTL.FEATURED_NEWS,
    hasData: featuredNews.length > 0,
  });

  const loading = status.getFeaturedNewsAsync?.loading;
  const error = status.getFeaturedNewsAsync?.response === 'rejected';

  return (
    <Box>
      {/* ── Hero Carousel ─────────────────────────────── */}
      <HeroCarousel slides={heroSlides} />

      {/* ── Novedades Destacadas ──────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <AnimatedSection animation="fadeInUp">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 2,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <SectionTitle
                title="Novedades Destacadas"
                subtitle="Mantente informado sobre las últimas noticias de nuestra ciudad"
                align="left"
              />
              <Button
                component={Link}
                href={PUBLIC_ROUTES.NOVEDADES}
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 1, flexShrink: 0 }}
              >
                Ver todas
              </Button>
            </Box>
          </AnimatedSection>

          {error && !featuredNews.length ? (
            <Alert severity="error">
              No se pudo cargar la información. Intente nuevamente más tarde.
            </Alert>
          ) : loading ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: 3,
              }}
            >
              {Array.from(new Array(4)).map((_, index) => (
                <Card key={index}>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="100%" />
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : featuredNews.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: 3,
              }}
            >
              {featuredNews.map((news, index) => (
                <AnimatedSection
                  key={news.id}
                  animation="fadeInUp"
                  delay={index * 100}
                >
                  <NewsCard news={news} />
                </AnimatedSection>
              ))}
            </Box>
          ) : (
            <Alert
              severity="info"
              icon={<InfoOutlinedIcon />}
              sx={{ borderRadius: 2 }}
            >
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h6" gutterBottom>
                  No hay novedades disponibles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Las novedades destacadas aparecerán aquí una vez que se
                  publiquen.
                </Typography>
              </Box>
            </Alert>
          )}
        </Container>
      </Box>

      {/* ── Areas Municipales ──────────────────────────── */}
      <Box sx={{ position: 'relative', py: { xs: 6, md: 8 }, overflow: 'hidden' }}>
        {/* Decorative background */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #FAFBFC 0%, #EBF5FB 50%, #E8F5E9 100%)',
          zIndex: 0,
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <AnimatedSection animation="fadeInUp">
            <SectionTitle
              title="Areas Municipales"
              subtitle="Accedé a todos los servicios que ofrece la municipalidad"
            />
          </AnimatedSection>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {SERVICES.map((service, index) => {
              const ServiceIcon = service.icon;
              return (
                <AnimatedSection
                  key={service.title}
                  animation="fadeInUp"
                  delay={index * 100}
                >
                  <Paper
                    component={Link}
                    href={service.href}
                    sx={{
                      position: 'relative',
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 240,
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: '2px solid transparent',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: `0 16px 40px ${service.color}30`,
                        borderColor: `${service.color}50`,
                        '& .service-image': {
                          opacity: 1,
                          transform: 'scale(1)',
                        },
                        '& .service-overlay': {
                          opacity: 1,
                        },
                        '& .service-content': {
                          opacity: 0,
                          transform: 'translateY(10px)',
                        },
                        '& .service-hover-content': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                      },
                    }}
                  >
                    {/* Background image (hidden by default, shown on hover) */}
                    <Box
                      className="service-image"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${service.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0,
                        transform: 'scale(1.1)',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                    {/* Gradient overlay on image */}
                    <Box
                      className="service-overlay"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(180deg, ${service.color}99 0%, ${service.color}DD 100%)`,
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                      }}
                    />

                    {/* Default content (visible, hidden on hover) */}
                    <Box
                      className="service-content"
                      sx={{
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'center',
                        p: 3,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Box
                        sx={{
                          width: 72,
                          height: 72,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          mx: 'auto',
                          backgroundColor: `${service.color}12`,
                          color: service.color,
                        }}
                      >
                        <ServiceIcon sx={{ fontSize: 36 }} />
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {service.description}
                      </Typography>
                    </Box>

                    {/* Hover content (hidden, visible on hover) */}
                    <Box
                      className="service-hover-content"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                        opacity: 0,
                        transform: 'translateY(10px)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        p: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 0.5,
                        }}
                      >
                        <ArrowForwardIcon sx={{ fontSize: 26, color: 'white' }} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: 'white', textAlign: 'center' }}
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255,255,255,0.9)',
                          textAlign: 'center',
                          fontSize: '0.8rem',
                        }}
                      >
                        {service.description}
                      </Typography>
                    </Box>
                  </Paper>
                </AnimatedSection>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* ── Obras Públicas ──────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <AnimatedSection animation="fadeInUp">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 2,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <SectionTitle
                title="Obras e Infraestructura"
                subtitle="Construimos una ciudad más conectada y accesible para todos"
                align="left"
              />
              <Button
                component={Link}
                href={PUBLIC_ROUTES.OBRAS_PUBLICAS}
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 1, flexShrink: 0 }}
              >
                Ver todas
              </Button>
            </Box>
          </AnimatedSection>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {SAMPLE_OBRAS.slice(0, 3).map((obra, index) => (
              <AnimatedSection
                key={obra.id}
                animation="fadeInUp"
                delay={index * 100}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    cursor: 'default',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 32px rgba(67, 160, 71, 0.15)',
                      borderColor: 'rgba(67, 160, 71, 0.3)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <Box
                      component="img"
                      src={obra.image_url}
                      alt={obra.title}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                        '&:hover': { transform: 'scale(1.05)' },
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flex: 1, p: 2.5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#43A047',
                        mb: 1,
                        fontSize: '1rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {obra.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.6,
                      }}
                    >
                      {obra.description}
                    </Typography>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Teléfonos de Emergencia ───────────────────── */}
      <EmergencyPhones />

      {/* ── Banner Institucional ──────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 8, md: 10 },
          overflow: 'hidden',
          color: 'white',
        }}
      >
        {/* Colored gradient background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #1A5F8B 0%, #2E86C1 40%, #43A047 100%)',
          }}
        />
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -40, right: '15%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(253,216,53,0.1)' }} />
        <Box sx={{ position: 'absolute', bottom: -30, left: '10%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 4, md: 6 },
              alignItems: 'center',
            }}
          >
            <AnimatedSection animation="fadeInLeft">
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                  Nuestro Gobierno
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.8, maxWidth: 480 }}>
                  Conocé la historia, autoridades y el compromiso institucional con la comunidad de Estación General Paz.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    component={Link}
                    href={PUBLIC_ROUTES.MUNICIPALIDAD}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      backgroundColor: '#FDD835',
                      color: '#2D3436',
                      fontWeight: 700,
                      borderRadius: '50px',
                      px: 3,
                      '&:hover': {
                        backgroundColor: '#FFEE58',
                        boxShadow: '0 4px 16px rgba(253,216,53,0.4)',
                      },
                    }}
                  >
                    Conocer más
                  </Button>
                  <Button
                    variant="outlined"
                    component={Link}
                    href={PUBLIC_ROUTES.MUNICIPALIDAD_INTENDENTE}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.5)',
                      borderRadius: '50px',
                      px: 3,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Intendente
                  </Button>
                </Box>
              </Box>
            </AnimatedSection>
            <AnimatedSection animation="fadeInRight">
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Image
                  src="/logo.webp"
                  alt="Municipalidad de Estación General Paz"
                  width={240}
                  height={288}
                  style={{ opacity: 0.9, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.2))' }}
                />
              </Box>
            </AnimatedSection>
          </Box>
        </Container>
      </Box>

    </Box>
  );
};

export default HomePage;
