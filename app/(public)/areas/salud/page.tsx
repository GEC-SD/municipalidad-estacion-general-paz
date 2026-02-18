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

const SALUD_PHOTOS: GalleryPhoto[] = [
  { src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80', alt: 'Atención médica', title: 'Atención Primaria de la Salud' },
  { src: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=600&q=80', alt: 'Enfermería comunitaria', title: 'Enfermería Comunitaria' },
  { src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80', alt: 'Centro de salud', title: 'Centro de Salud Municipal' },
  { src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80', alt: 'Vacunación', title: 'Campaña de Vacunación' },
  { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', alt: 'Salud y bienestar', title: 'Bienestar Comunitario' },
  { src: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=600&q=80', alt: 'Feria de salud', title: 'Feria de Salud' },
  { src: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&q=80', alt: 'Farmacia', title: 'Farmacia Municipal' },
  { src: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=600&q=80', alt: 'Pediatría', title: 'Pediatría' },
  { src: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=600&q=80', alt: 'Laboratorio', title: 'Laboratorio Clínico' },
  { src: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80', alt: 'Telemedicina', title: 'Telemedicina' },
  { src: 'https://images.unsplash.com/photo-1588776814546-1ffbb7f6c3e5?w=600&q=80', alt: 'Consulta médica', title: 'Consulta General' },
  { src: 'https://images.unsplash.com/photo-1516841273335-e39b37888115?w=600&q=80', alt: 'Kinesiología', title: 'Kinesiología y Rehabilitación' },
];

const SaludPage = () => {
  const { servicesByCategory, status } = useAppSelector(
    (state) => state.services
  );

  useCachedFetch({
    selector: (state) => state.services.lastFetched,
    dataKey: 'servicesByCategory.salud',
    fetchAction: () => getServicesByCategoryAsync('salud'),
    ttl: CACHE_TTL.SERVICES,
    hasData: servicesByCategory.salud.length > 0,
  });

  const services = servicesByCategory.salud;
  const loading = status.getServicesByCategoryAsync?.loading;
  const error = status.getServicesByCategoryAsync?.response === 'rejected';

  if (error && !services.length) {
    return (
      <Box>
        <PageHero title="Servicios de Salud" subtitle="Atención médica y programas de prevención para toda la comunidad" backgroundImage="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80" overlayColor="rgba(46,134,193,0.88)" overlayColorEnd="rgba(26,95,139,0.72)" />
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
      <PageHero title="Servicios de Salud" subtitle="Atención médica y programas de prevención para toda la comunidad" backgroundImage="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80" overlayColor="rgba(46,134,193,0.88)" overlayColorEnd="rgba(26,95,139,0.72)" />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <AnimatedSection animation="fadeInUp">
        {services.length === 0 ? (
          <Alert severity="info">
            La información de servicios de salud no está disponible en este
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
                      sx={{ fontWeight: 600, color: '#2E86C1' }}
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

                    {/* Requirements */}
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

                    {/* Contact Info */}
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
          photos={SALUD_PHOTOS}
          accentColor="#2E86C1"
          sectionTitle="Galería de Salud"
        />
      </Container>
    </Box>
  );
};

export default SaludPage;
