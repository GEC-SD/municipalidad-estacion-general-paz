'use client';

import { useState } from 'react';
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
  Button,
  Chip,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  PictureAsPdf as PdfIcon,
  TextSnippet as TextIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@/state/redux/store';
import { getActiveTramitesAsync } from '@/state/redux/tramites';
import { useCachedFetch } from '@/hooks';
import { CACHE_TTL } from '@/constants/cache';
import { Tramite } from '@/types';
import PageHero from '../components/PageHero';
import AnimatedSection from '../components/AnimatedSection';
import TramiteDetailModal from './TramiteDetailModal';

const TramitesPage = () => {
  const { tramites, status } = useAppSelector((state) => state.tramites);
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null);

  useCachedFetch({
    selector: (state) => state.tramites.lastFetched,
    dataKey: 'activeTramites',
    fetchAction: () => getActiveTramitesAsync(),
    ttl: CACHE_TTL.SERVICES,
    hasData: tramites.length > 0,
  });

  const loading = status.getActiveTramitesAsync?.loading;
  const error = status.getActiveTramitesAsync?.response === 'rejected';

  if (error && !tramites.length) {
    return (
      <Box>
        <PageHero
          title="Trámites Municipales"
          subtitle="Gestiones administrativas, documentación y trámites online y presenciales"
          backgroundImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=80"
          overlayColor="rgba(26,95,139,0.88)"
          overlayColorEnd="rgba(46,134,193,0.72)"
        />
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
          {Array.from(new Array(4)).map((_, index) => (
            <Box key={index}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
            </Box>
          ))}
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      <PageHero
        title="Trámites Municipales"
        subtitle="Gestiones administrativas, documentación y trámites online y presenciales"
        backgroundImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=80"
        overlayColor="rgba(26,95,139,0.88)"
        overlayColorEnd="rgba(46,134,193,0.72)"
      />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <AnimatedSection animation="fadeInUp">
          {tramites.length === 0 ? (
            <Alert severity="info">
              La información de trámites no está disponible en este momento.
            </Alert>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
              {tramites.map((tramite) => (
                <Box key={tramite.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1A5F8B' }}>
                          {tramite.title}
                        </Typography>
                        <Chip
                          icon={tramite.content_type === 'pdf' ? <PdfIcon /> : <TextIcon />}
                          label={tramite.content_type === 'pdf' ? 'PDF' : 'Info'}
                          size="small"
                          variant="outlined"
                          color={tramite.content_type === 'pdf' ? 'error' : 'info'}
                        />
                      </Box>

                      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                        {tramite.description}
                      </Typography>

                      {tramite.requirements && tramite.requirements.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                            Requisitos:
                          </Typography>
                          <List dense>
                            {tramite.requirements.map((req, index) => (
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

                      {tramite.contact_info && (
                        <Paper variant="outlined" sx={{ p: 2, mt: 'auto', mb: 2, backgroundColor: 'grey.50' }}>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                            Información de Contacto
                          </Typography>
                          {tramite.contact_info.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <PhoneIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                <a href={`tel:${tramite.contact_info.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                  {tramite.contact_info.phone}
                                </a>
                              </Typography>
                            </Box>
                          )}
                          {tramite.contact_info.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <EmailIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                <a href={`mailto:${tramite.contact_info.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                  {tramite.contact_info.email}
                                </a>
                              </Typography>
                            </Box>
                          )}
                          {tramite.contact_info.address && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <LocationOnIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">{tramite.contact_info.address}</Typography>
                            </Box>
                          )}
                          {tramite.contact_info.hours && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <ScheduleIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">{tramite.contact_info.hours}</Typography>
                            </Box>
                          )}
                        </Paper>
                      )}

                      <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        fullWidth
                        onClick={() => setSelectedTramite(tramite)}
                        sx={{ mt: 'auto' }}
                      >
                        Ver trámite
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          )}
        </AnimatedSection>
      </Container>

      <TramiteDetailModal
        tramite={selectedTramite}
        open={!!selectedTramite}
        onClose={() => setSelectedTramite(null)}
      />
    </Box>
  );
};

export default TramitesPage;
