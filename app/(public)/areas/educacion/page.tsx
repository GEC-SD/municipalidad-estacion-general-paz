'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  Skeleton,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@/state/redux/store';
import { getServicesByCategoryAsync } from '@/state/redux/services';
import { useCachedFetch } from '@/hooks';
import { CACHE_TTL } from '@/constants/cache';
import PageHero from '../../components/PageHero';
import AnimatedSection from '../../components/AnimatedSection';
import AreaGallery, { GalleryPhoto } from '../../components/AreaGallery';

const EDUCACION_PHOTOS: GalleryPhoto[] = [
  { src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80', alt: 'Niños aprendiendo', title: 'Educación Inicial' },
  { src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80', alt: 'Aula', title: 'Clases Presenciales' },
  { src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80', alt: 'Estudiantes', title: 'Vida Estudiantil' },
  { src: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&q=80', alt: 'Lectura', title: 'Fomento a la Lectura' },
  { src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80', alt: 'Biblioteca', title: 'Biblioteca Escolar' },
  { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80', alt: 'Docentes', title: 'Capacitación Docente' },
  { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80', alt: 'Graduación', title: 'Egresados' },
  { src: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&q=80', alt: 'Escritura', title: 'Taller de Escritura' },
  { src: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80', alt: 'Tecnología', title: 'Sala de Computación' },
  { src: 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?w=600&q=80', alt: 'Talleres creativos', title: 'Talleres Creativos' },
  { src: 'https://images.unsplash.com/photo-1518534858427-e46a38edc38c?w=600&q=80', alt: 'Ciencias', title: 'Laboratorio de Ciencias' },
  { src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80', alt: 'Arte', title: 'Arte y Expresión' },
];

const EducacionPage = () => {
  const { servicesByCategory, status } = useAppSelector(
    (state) => state.services
  );

  const services = servicesByCategory?.educacion ?? [];

  useCachedFetch({
    selector: (state) => state.services.lastFetched,
    dataKey: 'servicesByCategory.educacion',
    fetchAction: () => getServicesByCategoryAsync('educacion'),
    ttl: CACHE_TTL.SERVICES,
    hasData: services.length > 0,
  });
  const loading = status.getServicesByCategoryAsync?.loading;
  const error = status.getServicesByCategoryAsync?.response === 'rejected';

  if (error && !services.length) {
    return (
      <Box>
        <PageHero title="Educación" subtitle="Programas educativos y actividades de formación para la comunidad" backgroundImage="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80" overlayColor="rgba(26,95,139,0.88)" overlayColorEnd="rgba(67,160,71,0.72)" />
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
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
          {Array.from(new Array(3)).map((_, index) => (
            <Box key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" />
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
      <PageHero title="Educación" subtitle="Programas educativos y actividades de formación para la comunidad" backgroundImage="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80" overlayColor="rgba(26,95,139,0.88)" overlayColorEnd="rgba(67,160,71,0.72)" />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <AnimatedSection animation="fadeInUp">
        {services.length === 0 ? (
          <Alert severity="info">
            La información de servicios educativos no está disponible en este
            momento.
          </Alert>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
            {services.map((service) => (
              <Box key={service.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 600, color: '#1A5F8B' }}
                    >
                      {service.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      paragraph
                      sx={{ lineHeight: 1.8 }}
                    >
                      {service.description}
                    </Typography>

                    {service.requirements && service.requirements.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          Requisitos:
                        </Typography>
                        <List dense>
                          {service.requirements.map((req, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircleIcon
                                  fontSize="small"
                                  color="success"
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={req}
                                primaryTypographyProps={{
                                  variant: 'body2',
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {service.contact_info && (
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, mt: 2, backgroundColor: 'grey.50' }}
                      >
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          Información de Contacto
                        </Typography>

                        {service.contact_info.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PhoneIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              <a
                                href={`tel:${service.contact_info.phone}`}
                                style={{ color: 'inherit', textDecoration: 'none' }}
                              >
                                {service.contact_info.phone}
                              </a>
                            </Typography>
                          </Box>
                        )}

                        {service.contact_info.email && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              <a
                                href={`mailto:${service.contact_info.email}`}
                                style={{ color: 'inherit', textDecoration: 'none' }}
                              >
                                {service.contact_info.email}
                              </a>
                            </Typography>
                          </Box>
                        )}

                        {service.contact_info.address && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOnIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {service.contact_info.address}
                            </Typography>
                          </Box>
                        )}

                        {service.contact_info.hours && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ScheduleIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {service.contact_info.hours}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    )}
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
        </AnimatedSection>

        <AreaGallery
          photos={EDUCACION_PHOTOS}
          accentColor="#1A5F8B"
          sectionTitle="Galería Educativa"
        />
      </Container>
    </Box>
  );
};

export default EducacionPage;
