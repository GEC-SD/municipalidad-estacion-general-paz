'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import {
  HistoryEdu as HistoryIcon,
  TrackChanges as MisionIcon,
  Visibility as VisionIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import PageHero from '../../components/PageHero';
import AnimatedSection from '../../components/AnimatedSection';

const VALORES = [
  'Transparencia',
  'Compromiso',
  'Inclusión',
  'Innovación',
  'Participación Ciudadana',
  'Responsabilidad',
];

const HistoriaPage = () => {
  return (
    <Box>
      <PageHero
        title="Historia de la Ciudad"
        subtitle="Conocé nuestras raíces y patrimonio"
        backgroundImage="https://images.unsplash.com/photo-1461360370896-922624d12a74?w=1600&q=80"
        overlayColor="rgba(26,95,139,0.88)"
        overlayColorEnd="rgba(46,134,193,0.72)"
      />

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        {/* Historia */}
        <AnimatedSection animation="fadeInUp">
          <Paper
            sx={{
              p: { xs: 3, md: 5 },
              mb: 4,
              borderRadius: 3,
              borderTop: '4px solid',
              borderColor: 'primary.main',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <HistoryIcon sx={{ color: 'primary.main', fontSize: 32 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Nuestra Historia
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.9, textAlign: 'justify', color: 'text.secondary' }}>
              Estación General Paz es una localidad ubicada en el departamento Colón, en la provincia de Córdoba, Argentina.
              Su origen se remonta a la llegada del ferrocarril a fines del siglo XIX, que fue el motor del crecimiento
              de la región. La estación ferroviaria, que lleva el nombre del General José María Paz, héroe de la independencia
              argentina, dio identidad y nombre a esta comunidad.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.9, textAlign: 'justify', color: 'text.secondary', mt: 2 }}>
              A lo largo de los años, la localidad creció gracias al trabajo de sus habitantes, dedicados principalmente
              a la actividad agropecuaria y al comercio. Hoy, Estación General Paz es una comunidad pujante que combina
              su rica herencia histórica con una mirada hacia el futuro, trabajando por el bienestar y el progreso
              de todos sus vecinos.
            </Typography>
          </Paper>
        </AnimatedSection>

        {/* Misión y Visión */}
        <AnimatedSection animation="fadeInUp" delay={200}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
              mb: 4,
            }}
          >
            <Paper
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2E86C1 0%, #1A5F8B 100%)',
                color: 'white',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <MisionIcon sx={{ fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Misión
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.8, opacity: 0.95 }}>
                Trabajar por el bienestar de todos los ciudadanos, promoviendo
                el desarrollo sostenible, la inclusión social y la calidad de
                vida de nuestra comunidad, brindando servicios públicos eficientes
                y transparentes.
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #B52A1C 0%, #8C1F14 100%)',
                color: 'white',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <VisionIcon sx={{ fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Visión
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.8, opacity: 0.95 }}>
                Ser una ciudad modelo en gestión pública, desarrollo
                económico y social, que garantice oportunidades y bienestar
                para todas las generaciones, preservando nuestra identidad
                y tradiciones.
              </Typography>
            </Paper>
          </Box>
        </AnimatedSection>

        {/* Valores */}
        <AnimatedSection animation="fadeInUp" delay={400}>
          <Paper
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              borderTop: '4px solid',
              borderColor: 'secondary.main',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <StarIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Nuestros Valores
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2,
              }}
            >
              {VALORES.map((valor) => (
                <Box
                  key={valor}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    backgroundColor: 'rgba(46, 134, 193, 0.06)',
                    border: '1px solid',
                    borderColor: 'rgba(46, 134, 193, 0.15)',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(46, 134, 193, 0.12)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.dark' }}>
                    {valor}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </AnimatedSection>
      </Container>
    </Box>
  );
};

export default HistoriaPage;
