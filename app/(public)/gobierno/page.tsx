'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Paper,
} from '@mui/material';
import {
  Gavel as GavelIcon,
  AccountBalance as AccountBalanceIcon,
  HistoryEdu as HistoryEduIcon,
  Policy as PolicyIcon,
  Apartment as ApartmentIcon,
} from '@mui/icons-material';
import { PUBLIC_ROUTES } from '@/constants';
import PageHero from '../components/PageHero';
import AnimatedSection from '../components/AnimatedSection';

const MunicipalidadPage = () => {
  const sections = [
    {
      title: 'Departamento Ejecutivo',
      description: 'Intendente y Secretarías',
      icon: <ApartmentIcon sx={{ fontSize: 64, color: 'primary.main' }} />,
      href: PUBLIC_ROUTES.MUNICIPALIDAD_DEPARTAMENTO_EJECUTIVO,
    },
    {
      title: 'Honorable Concejo Deliberante',
      description: 'Concejales y Secretarías',
      icon: <GavelIcon sx={{ fontSize: 64, color: 'primary.main' }} />,
      href: PUBLIC_ROUTES.MUNICIPALIDAD_CONCEJO,
    },
    {
      title: 'Honorable Tribunal de Cuentas',
      description: 'Tribunos y Secretarías',
      icon: <AccountBalanceIcon sx={{ fontSize: 64, color: 'primary.main' }} />,
      href: PUBLIC_ROUTES.MUNICIPALIDAD_TRIBUNAL,
    },
    {
      title: 'Historia del Municipio',
      description: 'Historia y Patrimonio',
      icon: <HistoryEduIcon sx={{ fontSize: 64, color: 'primary.main' }} />,
      href: PUBLIC_ROUTES.MUNICIPALIDAD_HISTORIA,
    },
    {
      title: 'Transparencia',
      description: 'Ordenanzas y Decretos',
      icon: <PolicyIcon sx={{ fontSize: 64, color: 'primary.main' }} />,
      href: PUBLIC_ROUTES.TRANSPARENCIA,
    },
  ];

  return (
    <Box>
      <PageHero title="Gobierno" subtitle="Autoridades, organización y gestión municipal." backgroundImage="/pages-hero/gobierno-hero.webp" overlayColor="rgba(26,95,139,0.88)" overlayColorEnd="rgba(46,134,193,0.72)" />

      {/* Sections Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <AnimatedSection animation="fadeInUp">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {sections.map((section) => (
              <Box key={section.title}>
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
                    href={section.href}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 4,
                    }}
                  >
                    <Box sx={{ mb: 2 }}>{section.icon}</Box>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 600, textAlign: 'center' }}
                    >
                      {section.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: 'center' }}
                    >
                      {section.description}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Box>
            ))}
          </Box>
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={200}>
          {/* About Section */}
          <Paper sx={{ p: 4, mt: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Nuestro Gobierno
            </Typography>
            <Typography variant="body1" paragraph>
              El Gobierno de Estación General Paz es el gobierno local
              encargado de administrar y gestionar los servicios públicos,
              promover el desarrollo sostenible y mejorar la calidad de vida de
              todos los habitantes de nuestro municipio.
            </Typography>
            <Typography variant="body1" paragraph>
              Nuestro equipo de gobierno está comprometido con la transparencia,
              la participación ciudadana y el trabajo constante para construir una
              ciudad más inclusiva, moderna y próspera.
            </Typography>
            <Typography variant="body1">
              Trabajamos día a día para fortalecer la democracia local, promover
              el desarrollo económico y social, y garantizar el bienestar de
              todas las familias de nuestra comunidad.
            </Typography>
          </Paper>
        </AnimatedSection>
      </Container>
    </Box>
  );
};

export default MunicipalidadPage;
