'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { SERVICES } from '@/constants';
import PageHero from '../components/PageHero';
import AnimatedSection from '../components/AnimatedSection';

const ServiciosPage = () => {
  return (
    <Box>
      <PageHero
        title="Áreas Municipales"
        subtitle="Servicios, programas y atención a la comunidad."
        backgroundImage="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1600&q=80"
        overlayColor="rgba(67,160,71,0.88)"
        overlayColorEnd="rgba(46,134,193,0.72)"
      />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <AnimatedSection animation="fadeInUp">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 4,
            }}
          >
            {SERVICES.map((service, index) => {
              const ServiceIcon = service.icon;
              return (
                <AnimatedSection key={service.title} animation="fadeInUp" delay={index * 100}>
                  <Paper
                    component={Link}
                    href={service.href}
                    sx={{
                      position: 'relative',
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 260,
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: '2px solid transparent',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: `0 16px 40px ${service.color}30`,
                        borderColor: `${service.color}50`,
                        '& .service-image': {
                          opacity: 1,
                          transform: 'scale(1)',
                        },
                        '& .service-overlay': {
                          opacity: 1,
                        },
                        '& .service-content': {
                          opacity: 0,
                          transform: 'translateY(10px)',
                        },
                        '& .service-hover-content': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                      },
                    }}
                  >
                    {/* Background image (shown on hover) */}
                    <Box
                      className="service-image"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${service.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0,
                        transform: 'scale(1.1)',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                    {/* Gradient overlay */}
                    <Box
                      className="service-overlay"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(180deg, ${service.color}99 0%, ${service.color}DD 100%)`,
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                      }}
                    />

                    {/* Default content */}
                    <Box
                      className="service-content"
                      sx={{
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'center',
                        p: 4,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          mx: 'auto',
                          backgroundColor: `${service.color}12`,
                          color: service.color,
                        }}
                      >
                        <ServiceIcon sx={{ fontSize: 40 }} />
                      </Box>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.description}
                      </Typography>
                    </Box>

                    {/* Hover content */}
                    <Box
                      className="service-hover-content"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                        opacity: 0,
                        transform: 'translateY(10px)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        p: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 0.5,
                        }}
                      >
                        <ArrowForwardIcon sx={{ fontSize: 26, color: 'white' }} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: 'white', textAlign: 'center' }}
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255,255,255,0.9)',
                          textAlign: 'center',
                          fontSize: '0.85rem',
                        }}
                      >
                        {service.description}
                      </Typography>
                    </Box>
                  </Paper>
                </AnimatedSection>
              );
            })}
          </Box>
        </AnimatedSection>
      </Container>
    </Box>
  );
};

export default ServiciosPage;
