'use client';

import { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Phone as PhoneIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import { getContactsByCategoryAsync } from '@/state/redux/contact';
import AnimatedSection from './AnimatedSection';
import SectionTitle from './SectionTitle';
import classes from './classes';

const EmergencyPhones = () => {
  const dispatch = useAppDispatch();
  const { emergencyContacts } = useAppSelector((state) => state.contact);

  useEffect(() => {
    dispatch(getContactsByCategoryAsync('emergencia'));
  }, [dispatch]);

  if (emergencyContacts.length === 0) return null;

  return (
    <Box sx={classes.emergencySection}>
      <Container maxWidth="lg">
        <SectionTitle
          title="Teléfonos Útiles"
          subtitle="Números de emergencia y contacto disponibles las 24 horas"
          light
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {emergencyContacts.map((contact, index) => (
            <AnimatedSection
              key={contact.id}
              animation="fadeInUp"
              delay={index * 100}
            >
              <Box
                component="a"
                href={contact.phone ? `tel:${contact.phone}` : undefined}
                sx={{
                  ...classes.emergencyCard,
                  textDecoration: 'none',
                  color: 'white',
                  cursor: contact.phone ? 'pointer' : 'default',
                }}
              >
                <Box sx={classes.emergencyIcon}>
                  <PhoneIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {contact.department}
                  </Typography>
                  {contact.phone && (
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {contact.phone}
                    </Typography>
                  )}
                  {contact.description && (
                    <Typography
                      variant="body2"
                      sx={{ opacity: 0.8, mt: 0.5 }}
                    >
                      {contact.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            </AnimatedSection>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default EmergencyPhones;
