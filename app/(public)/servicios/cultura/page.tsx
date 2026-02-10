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
        <PageHero title="Servicios de Cultura" subtitle="Eventos culturales, talleres artísticos y actividades para el desarrollo cultural" backgroundColor="#B52A1C" />
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
      <PageHero title="Servicios de Cultura" subtitle="Eventos culturales, talleres artísticos y actividades para el desarrollo cultural" backgroundColor="#B52A1C" />

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
      </Container>
    </Box>
  );
};

export default CulturaPage;
