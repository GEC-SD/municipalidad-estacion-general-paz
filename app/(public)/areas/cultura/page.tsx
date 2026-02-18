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

const CULTURA_PHOTOS: GalleryPhoto[] = [
  { src: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80', alt: 'Taller de pintura', title: 'Taller de Pintura' },
  { src: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80', alt: 'Concierto', title: 'Concierto Municipal' },
  { src: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80', alt: 'Exposición de arte', title: 'Exposición de Arte' },
  { src: 'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=600&q=80', alt: 'Teatro', title: 'Teatro Comunitario' },
  { src: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80', alt: 'Arte urbano', title: 'Arte Urbano' },
  { src: 'https://images.unsplash.com/photo-1518674660708-0e2c0473e68e?w=600&q=80', alt: 'Cerámica', title: 'Taller de Cerámica' },
  { src: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&q=80', alt: 'Feria artesanal', title: 'Feria Artesanal' },
  { src: 'https://images.unsplash.com/photo-1544717684-1243da23b545?w=600&q=80', alt: 'Biblioteca', title: 'Biblioteca Popular' },
  { src: 'https://images.unsplash.com/photo-1452802447250-470a88ac82bc?w=600&q=80', alt: 'Cine comunitario', title: 'Cine Comunitario' },
  { src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80', alt: 'Música', title: 'Bandas Locales' },
  { src: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80', alt: 'Danza', title: 'Escuela de Danza' },
  { src: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80', alt: 'Folklore', title: 'Festival de Folklore' },
];

const CulturaPage = () => {
  const { servicesByCategory, status } = useAppSelector(
    (state) => state.services
  );

  useCachedFetch({
    selector: (state) => state.services.lastFetched,
    dataKey: 'servicesByCategory.cultura',
    fetchAction: () => getServicesByCategoryAsync('cultura'),
    ttl: CACHE_TTL.SERVICES,
    hasData: servicesByCategory.cultura.length > 0,
  });

  const services = servicesByCategory.cultura;
  const loading = status.getServicesByCategoryAsync?.loading;
  const error = status.getServicesByCategoryAsync?.response === 'rejected';

  if (error && !services.length) {
    return (
      <Box>
        <PageHero title="Servicios de Cultura" subtitle="Eventos culturales, talleres artísticos y actividades para el desarrollo cultural" backgroundImage="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&q=80" overlayColor="rgba(181,42,28,0.88)" overlayColorEnd="rgba(212,85,74,0.72)" />
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
              <Skeleton variant="rectangular" height={300} />
            </Box>
          ))}
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      <PageHero title="Servicios de Cultura" subtitle="Eventos culturales, talleres artísticos y actividades para el desarrollo cultural" backgroundImage="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&q=80" overlayColor="rgba(181,42,28,0.88)" overlayColorEnd="rgba(212,85,74,0.72)" />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <AnimatedSection animation="fadeInUp">
        {services.length === 0 ? (
          <Alert severity="info">
            La información de servicios culturales no está disponible en este momento.
          </Alert>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
            {services.map((service) => (
              <Box key={service.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#B52A1C' }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                      {service.description}
                    </Typography>

                    {service.requirements && service.requirements.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                          Requisitos:
                        </Typography>
                        <List dense>
                          {service.requirements.map((req, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircleIcon fontSize="small" color="success" />
                              </ListItemIcon>
                              <ListItemText primary={req} primaryTypographyProps={{ variant: 'body2' }} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {service.contact_info && (
                      <Paper variant="outlined" sx={{ p: 2, mt: 2, backgroundColor: 'grey.50' }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                          Información de Contacto
                        </Typography>
                        {service.contact_info.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PhoneIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              <a href={`tel:${service.contact_info.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                {service.contact_info.phone}
                              </a>
                            </Typography>
                          </Box>
                        )}
                        {service.contact_info.email && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              <a href={`mailto:${service.contact_info.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                {service.contact_info.email}
                              </a>
                            </Typography>
                          </Box>
                        )}
                        {service.contact_info.address && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOnIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{service.contact_info.address}</Typography>
                          </Box>
                        )}
                        {service.contact_info.hours && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ScheduleIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{service.contact_info.hours}</Typography>
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
          photos={CULTURA_PHOTOS}
          accentColor="#B52A1C"
          sectionTitle="Galería Cultural"
        />
      </Container>
    </Box>
  );
};

export default CulturaPage;
