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
  AccountBalance as AccountBalanceIcon,
  Gavel as GavelIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@/state/redux/store';
import { getFeaturedNewsAsync } from '@/state/redux/news';
import { useCachedFetch } from '@/hooks';
import { CACHE_TTL } from '@/constants/cache';
import { PUBLIC_ROUTES, SERVICES } from '@/constants';
import HeroCarousel from './components/HeroCarousel';
import QuickAccessBar from './components/QuickAccessBar';
import AnimatedSection from './components/AnimatedSection';
import SectionTitle from './components/SectionTitle';
import NewsCard from './components/NewsCard';
import EmergencyPhones from './components/EmergencyPhones';
import classes from './components/classes';

const heroSlides = [
  {
    id: '1',
    title: 'Bienvenido a la Municipalidad de Estación General Paz',
    subtitle: 'Trabajando juntos por una ciudad mejor. Accede a todos los servicios municipales desde un solo lugar.',
    ctaText: 'Ver Novedades',
    ctaHref: PUBLIC_ROUTES.NOVEDADES,
  },
  {
    id: '2',
    title: 'Servicios Municipales a tu Alcance',
    subtitle: 'Salud, cultura, deporte y trámites. Todo lo que necesitás al alcance de un click.',
    ctaText: 'Explorar Servicios',
    ctaHref: PUBLIC_ROUTES.SERVICIOS,
  },
  {
    id: '3',
    title: 'Transparencia y Compromiso',
    subtitle: 'Consultá normativas, ordenanzas y toda la información institucional de nuestra ciudad.',
    ctaText: 'Ver Normativa',
    ctaHref: PUBLIC_ROUTES.NORMATIVA,
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

      {/* ── Quick Access Bar ──────────────────────────── */}
      <QuickAccessBar />

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

      {/* ── Servicios Municipales ─────────────────────── */}
      <Box sx={{ backgroundColor: 'grey.50', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <AnimatedSection animation="fadeInUp">
            <SectionTitle
              title="Servicios Municipales"
              subtitle="Accede a todos los servicios que ofrece la municipalidad"
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
                      ...classes.serviceCard,
                      borderTopColor: service.color,
                    }}
                  >
                    <Box
                      sx={{
                        ...classes.serviceIconWrapper,
                        backgroundColor: `${service.color}15`,
                        color: service.color,
                      }}
                    >
                      <ServiceIcon sx={{ fontSize: 36 }} />
                    </Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
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
                  </Paper>
                </AnimatedSection>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* ── Teléfonos de Emergencia ───────────────────── */}
      <EmergencyPhones />

      {/* ── Banner Institucional ──────────────────────── */}
      <Box sx={classes.institutionalBanner}>
        <Container maxWidth="lg">
          <Box sx={classes.institutionalBannerContent}>
            <AnimatedSection animation="fadeInLeft">
              <Box>
                <SectionTitle
                  title="Nuestra Municipalidad"
                  subtitle="Conocé la historia, autoridades y el compromiso institucional con la comunidad de Estación General Paz."
                  align="left"
                />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    component={Link}
                    href={PUBLIC_ROUTES.MUNICIPALIDAD}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Conocer más
                  </Button>
                  <Button
                    variant="outlined"
                    component={Link}
                    href={PUBLIC_ROUTES.MUNICIPALIDAD_INTENDENTE}
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
                  style={{ opacity: 0.9 }}
                />
              </Box>
            </AnimatedSection>
          </Box>
        </Container>
      </Box>

      {/* ── Accesos Rápidos ───────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <AnimatedSection animation="fadeInUp">
            <SectionTitle
              title="Accesos Rápidos"
              subtitle="Enlaces directos a las secciones más consultadas"
            />
          </AnimatedSection>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {[
              {
                title: 'Municipalidad',
                description: 'Conoce a nuestras autoridades y la historia de nuestra ciudad',
                href: PUBLIC_ROUTES.MUNICIPALIDAD,
                buttonText: 'Ver más',
                icon: <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />,
              },
              {
                title: 'Normativa',
                description: 'Consulta ordenanzas y regulaciones municipales',
                href: PUBLIC_ROUTES.NORMATIVA,
                buttonText: 'Ver normativa',
                icon: <GavelIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />,
              },
              {
                title: 'Contacto',
                description: 'Números útiles y datos de contacto',
                href: PUBLIC_ROUTES.CONTACTO,
                buttonText: 'Contactar',
                icon: <PhoneIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />,
              },
            ].map((item, index) => (
              <AnimatedSection
                key={item.title}
                animation="fadeInUp"
                delay={index * 100}
              >
                <Card sx={classes.quickLinkCard}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    {item.icon}
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      {item.description}
                    </Typography>
                    <Button
                      variant="contained"
                      component={Link}
                      href={item.href}
                      fullWidth
                    >
                      {item.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
