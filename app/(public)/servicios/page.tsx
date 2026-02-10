'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import {
  LocalHospital as LocalHospitalIcon,
  TheaterComedy as TheaterComedyIcon,
  SportsFootball as SportsFootballIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { PUBLIC_ROUTES } from '@/constants';
import PageHero from '../components/PageHero';
import AnimatedSection from '../components/AnimatedSection';

const ServiciosPage = () => {
  const services = [
    {
      title: 'Salud',
      description:
        'Centros de salud, atención médica y programas de prevención para toda la comunidad.',
      icon: <LocalHospitalIcon sx={{ fontSize: 64 }} />,
      href: PUBLIC_ROUTES.SERVICIOS_SALUD,
      color: '#2E86C1',
    },
    {
      title: 'Cultura',
      description:
        'Eventos culturales, talleres artísticos y actividades para el desarrollo cultural.',
      icon: <TheaterComedyIcon sx={{ fontSize: 64 }} />,
      href: PUBLIC_ROUTES.SERVICIOS_CULTURA,
      color: '#B52A1C',
    },
    {
      title: 'Deporte',
      description:
        'Polideportivos, clases de deporte y actividades recreativas para todas las edades.',
      icon: <SportsFootballIcon sx={{ fontSize: 64 }} />,
      href: PUBLIC_ROUTES.SERVICIOS_DEPORTE,
      color: '#F5A623',
    },
    {
      title: 'Trámites',
      description:
        'Gestiones administrativas, documentación y trámites municipales online y presenciales.',
      icon: <DescriptionIcon sx={{ fontSize: 64 }} />,
      href: PUBLIC_ROUTES.SERVICIOS_TRAMITES,
      color: '#1A5F8B',
    },
  ];

  return (
    <Box>
      <PageHero title="Servicios Municipales" subtitle="Conoce todos los servicios que ofrecemos para la comunidad" />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <AnimatedSection animation="fadeInUp">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
          {services.map((service) => (
            <Box key={service.title}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardActionArea
                  component={Link}
                  href={service.href}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                  }}
                >
                  <Box sx={{ color: service.color, mb: 2 }}>
                    {service.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600, textAlign: 'center' }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center' }}
                  >
                    {service.description}
                  </Typography>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
        </AnimatedSection>
      </Container>
    </Box>
  );
};

export default ServiciosPage;
