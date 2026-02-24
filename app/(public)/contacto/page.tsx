/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Skeleton,
  Alert,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAppSelector } from '@/state/redux/store';
import { getContactsAsync } from '@/state/redux/contact';
import { useCachedFetch } from '@/hooks';
import { CACHE_TTL } from '@/constants/cache';
import PageHero from '../components/PageHero';
import AnimatedSection from '../components/AnimatedSection';

const ContactoPage = () => {
  const {
    contacts,
    emergencyContacts,
    administrativeContacts,
    serviceContacts,
    status,
  } = useAppSelector((state) => state.contact);

  const [tabValue, setTabValue] = useState(0);

  useCachedFetch({
    selector: (state) => state.contact.lastFetched,
    dataKey: 'contacts',
    fetchAction: () => getContactsAsync(),
    ttl: CACHE_TTL.CONTACTS,
    hasData: contacts.length > 0,
  });

  const handleTabChange = (_: any, newValue: number) => {
    setTabValue(newValue);
  };

  const loading = status.getContactsAsync?.loading;
  const error = status.getContactsAsync?.response === 'rejected';

  const renderContactCard = (contact: any) => (
    <Paper key={contact.id} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        {contact.department}
      </Typography>

      {contact.description && (
        <Typography variant="body2" color="text.secondary" paragraph>
          {contact.description}
        </Typography>
      )}

      <Box sx={{ mt: 2 }}>
        {contact.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <PhoneIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            <Typography variant="body1">
              <a
                href={`tel:${contact.phone}`}
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                {contact.phone}
              </a>
            </Typography>
          </Box>
        )}

        {contact.email && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <EmailIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            <Typography variant="body1">
              <a
                href={`mailto:${contact.email}`}
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                {contact.email}
              </a>
            </Typography>
          </Box>
        )}

        {contact.address && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <LocationOnIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            <Typography variant="body1">{contact.address}</Typography>
          </Box>
        )}

        {contact.hours && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ScheduleIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            <Typography variant="body1">{contact.hours}</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );

  const getTabContent = () => {
    if (tabValue === 0) {
      return emergencyContacts.length > 0 ? (
        <Box>
          <Alert severity="error" icon={<WarningIcon />} sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Números de Emergencia
            </Typography>
            <Typography variant="body2">
              En caso de emergencia, comunícate inmediatamente con los siguientes
              números.
            </Typography>
          </Alert>
          {emergencyContacts.map(renderContactCard)}
        </Box>
      ) : (
        <Alert severity="info">
          No hay información de contactos de emergencia disponible.
        </Alert>
      );
    } else if (tabValue === 1) {
      return administrativeContacts.length > 0 ? (
        administrativeContacts.map(renderContactCard)
      ) : (
        <Alert severity="info">
          No hay información de contactos administrativos disponible.
        </Alert>
      );
    } else {
      return serviceContacts.length > 0 ? (
        serviceContacts.map(renderContactCard)
      ) : (
        <Alert severity="info">
          No hay información de contactos de servicios disponible.
        </Alert>
      );
    }
  };

  if (error && !contacts.length) {
    return (
      <Box>
        <PageHero title="Contacto" subtitle="Información de contacto y canales de atención para la comunidad." backgroundImage="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80" overlayColor="rgba(67,160,71,0.88)" overlayColorEnd="rgba(46,134,193,0.72)" />
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
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Skeleton variant="text" width="40%" height={60} sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" height={60} sx={{ mb: 3 }} />
        {Array.from(new Array(4)).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={150}
            sx={{ mb: 2 }}
          />
        ))}
      </Container>
    );
  }

  return (
    <Box>
      <PageHero title="Contacto" subtitle="Información de contacto y canales de atención para la comunidad." backgroundImage="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80" overlayColor="rgba(67,160,71,0.88)" overlayColorEnd="rgba(46,134,193,0.72)" />

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <AnimatedSection animation="fadeInUp">
          {/* Main Municipal Info */}
          <Paper sx={{ p: 4, mb: 4, backgroundColor: 'primary.main', color: 'white' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Municipalidad de Estación General Paz
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 1.5 }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Teléfono Central
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      3525-312959
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 1.5 }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      municipiogpaz@gmail.com
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ mr: 1.5 }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Dirección
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Buenos Aires, esq. Sgo. del Estero
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={200}>
          {/* Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Emergencias" />
              <Tab label="Administrativo" />
              <Tab label="Servicios" />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          {getTabContent()}
        </AnimatedSection>
      </Container>
    </Box>
  );
};

export default ContactoPage;
