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
  Person as PersonIcon,
  Group as GroupIcon,
  Gavel as GavelIcon,
  HistoryEdu as HistoryEduIcon,
} from '@mui/icons-material';
import { PUBLIC_ROUTES } from '@/constants';
import PageHero from '../components/PageHero';
import AnimatedSection from '../components/AnimatedSection';

const MunicipalidadPage = () => {
  const sections = [
    {
      title: 'Intendente',
      description: 'Conoce al Intendente de nuestra ciudad',
      icon: <PersonIcon sx={{ fontSize: 64, color: 'primary.main' }} />,
      href: PUBLIC_ROUTES.MUNICIPALIDAD_INTENDENTE,
    },
    {
      title: 'Gabinete Municipal',
      description: 'Secretarías y áreas del gobierno municipal',
      icon: <GroupIcon sx={{ fontSize: 64, color: 'primary.main' }} />,
      href: PUBLIC_ROUTES.MUNICIPALIDAD_GABINETE,
    },
    {
      title: 'Concejo Deliberante',
      description: 'Concejales y cuerpo legislativo',
      icon: <GavelIcon sx={{ fontSize: 64, color: 'primary.main' }} />,
      href: PUBLIC_ROUTES.MUNICIPALIDAD_CONCEJO,
    },
    {
      title: 'Historia de la Ciudad',
      description: 'Conoce nuestra historia y patrimonio',
      icon: <HistoryEduIcon sx={{ fontSize: 64, color: 'primary.main' }} />,
      href: PUBLIC_ROUTES.MUNICIPALIDAD_HISTORIA,
    },
  ];

  return (
    <Box>
      <PageHero title="Municipalidad" subtitle="Conoce a las autoridades y la historia de nuestra ciudad" />

      {/* Sections Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <AnimatedSection animation="fadeInUp">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
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
            Nuestra Municipalidad
          </Typography>
          <Typography variant="body1" paragraph>
            La Municipalidad de Estación General Paz es el gobierno local
            encargado de administrar y gestionar los servicios públicos,
            promover el desarrollo sostenible y mejorar la calidad de vida de
            todos los habitantes de nuestra ciudad.
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
