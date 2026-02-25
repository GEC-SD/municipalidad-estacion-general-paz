'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
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
import { getServicesByCategoryAsync, getAreaResenaAsync } from '@/state/redux/services';
import { useCachedFetch } from '@/hooks';
import { CACHE_TTL } from '@/constants/cache';
import { sanitizeHtml } from '@/utils/sanitize';
import PageHero from '../../components/PageHero';
import AnimatedSection from '../../components/AnimatedSection';
import AreaGallery, { GalleryPhoto } from '../../components/AreaGallery';

const EducacionPage = () => {
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    fetch('/api/gallery/educacion')
      .then((res) => res.json())
      .then((photos: GalleryPhoto[]) => setGalleryPhotos(photos))
      .catch(() => setGalleryPhotos([]));
  }, []);
  const { servicesByCategory, resenas, status } = useAppSelector(
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

  useCachedFetch({
    selector: (state) => state.services.lastFetched,
    dataKey: 'resena.educacion',
    fetchAction: () => getAreaResenaAsync('educacion'),
    ttl: CACHE_TTL.SERVICES,
    hasData: !!resenas?.educacion,
  });

  const resena = resenas?.educacion;
  const loading = status.getServicesByCategoryAsync?.loading;
  const error = status.getServicesByCategoryAsync?.response === 'rejected';

  if (error && !services.length) {
    return (
      <Box>
        <PageHero title="Área de Educación" subtitle="Programas educativos y actividades de formación para la comunidad" backgroundImage="/pages-hero/educacion-hero.webp" overlayColor="rgba(26,95,139,0.88)" overlayColorEnd="rgba(67,160,71,0.72)" />
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
      <PageHero title="Área de Educación" subtitle="Programas educativos y actividades de formación para la comunidad" backgroundImage="/pages-hero/educacion-hero.webp" overlayColor="rgba(26,95,139,0.88)" overlayColorEnd="rgba(67,160,71,0.72)" />

      {resena?.content && (
        <AnimatedSection animation="fadeInUp">
          <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 }, pb: 0 }}>
            <Box
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(resena.content) }}
              sx={{
                '& h1, & h2, & h3': { mt: 2, mb: 1, fontWeight: 600 },
                '& p': { mb: 1.5, lineHeight: 1.8 },
                '& ul, & ol': { pl: 3, mb: 1.5 },
                '& a': { color: '#1A5F8B' },
              }}
            />
          </Container>
        </AnimatedSection>
      )}

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
                    {service.image_url && (
                      <CardMedia
                        component="img"
                        height="180"
                        image={service.image_url}
                        alt={service.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
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
          photos={galleryPhotos}
          accentColor="#1A5F8B"
          sectionTitle="Galería Educativa"
        />
      </Container>
    </Box>
  );
};

export default EducacionPage;
