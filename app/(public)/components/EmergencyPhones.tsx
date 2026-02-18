'use client';

import { useEffect } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import {
  Phone as PhoneIcon,
  LocalHospital as AmbulanceIcon,
  LocalPolice as PoliceIcon,
  Shield as GuardIcon,
  HealthAndSafety as HealthIcon,
  Business as MunicipalityIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import { getContactsByCategoryAsync } from '@/state/redux/contact';
import { ContactInfo } from '@/types';
import AnimatedSection from './AnimatedSection';
import SectionTitle from './SectionTitle';

/**
 * Color + icon mapping by department keyword.
 * Each service gets a distinct identity — like colored markers on a city map.
 */
const getServiceStyle = (department: string) => {
  const lower = department.toLowerCase();
  if (lower.includes('ambulancia') || lower.includes('médica') || lower.includes('emergencia'))
    return { color: '#D32F2F', icon: <AmbulanceIcon /> };
  if (lower.includes('policía') || lower.includes('policia'))
    return { color: '#1565C0', icon: <PoliceIcon /> };
  if (lower.includes('guardia'))
    return { color: '#E65100', icon: <GuardIcon /> };
  if (lower.includes('salud'))
    return { color: '#2E7D32', icon: <HealthIcon /> };
  if (lower.includes('municipalidad') || lower.includes('mesa'))
    return { color: '#2E86C1', icon: <MunicipalityIcon /> };
  return { color: '#546E7A', icon: <PhoneIcon /> };
};

const formatPhone = (phone: string) => {
  if (/^\d{10}$/.test(phone)) {
    return `${phone.slice(0, 4)}-${phone.slice(4)}`;
  }
  return phone;
};

const EmergencyCard = ({ contact, index }: { contact: ContactInfo; index: number }) => {
  const { color, icon } = getServiceStyle(contact.department);

  return (
    <AnimatedSection animation="fadeInUp" delay={index * 80}>
      <Paper
        component="a"
        href={contact.phone ? `tel:${contact.phone}` : undefined}
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
          p: 2.5,
          textDecoration: 'none',
          color: 'text.primary',
          cursor: contact.phone ? 'pointer' : 'default',
          borderRadius: 3,
          borderLeft: `4px solid ${color}`,
          backgroundColor: 'white',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateX(4px)',
            boxShadow: `0 4px 20px ${color}20`,
          },
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2.5,
            backgroundColor: `${color}12`,
            color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            '& .MuiSvgIcon-root': { fontSize: 26 },
          }}
        >
          {icon}
        </Box>

        {/* Content — phone number leads */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.15rem', md: '1.3rem' },
              letterSpacing: '0.5px',
              color,
              lineHeight: 1.2,
            }}
          >
            {contact.phone ? formatPhone(contact.phone) : '—'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: 'text.secondary',
              mt: 0.25,
              fontSize: '0.85rem',
            }}
          >
            {contact.department}
          </Typography>
        </Box>

        {/* Call indicator */}
        {contact.phone && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: `${color}10`,
              color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s ease',
              '.MuiPaper-root:hover &': {
                backgroundColor: color,
                color: 'white',
              },
            }}
          >
            <PhoneIcon sx={{ fontSize: 20 }} />
          </Box>
        )}
      </Paper>
    </AnimatedSection>
  );
};

const EmergencyPhones = () => {
  const dispatch = useAppDispatch();
  const { emergencyContacts } = useAppSelector((state) => state.contact);

  useEffect(() => {
    dispatch(getContactsByCategoryAsync('emergencia'));
  }, [dispatch]);

  if (emergencyContacts.length === 0) return null;

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: '#F5F7FA',
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          title="Teléfonos Útiles"
          subtitle="Números de emergencia y contacto disponibles las 24 horas"
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 2,
          }}
        >
          {emergencyContacts.map((contact, index) => (
            <EmergencyCard key={contact.id} contact={contact} index={index} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default EmergencyPhones;
