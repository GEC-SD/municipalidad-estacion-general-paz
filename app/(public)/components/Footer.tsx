'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Box, Container, Typography, IconButton } from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  WhatsApp as WhatsAppIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { PUBLIC_ROUTES } from '@/constants';
import classes from './classes';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Social Media Strip */}
      <Box sx={classes.footerSocialStrip}>
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Seguinos en redes:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[
              { icon: <FacebookIcon />, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61569838749351' },
              { icon: <InstagramIcon />, label: 'Instagram', href: 'https://www.instagram.com/municipalidadgralpaz' },
              { icon: <WhatsAppIcon />, label: 'WhatsApp', href: 'https://whatsapp.com/channel/0029VbBA769DZ4LTG98htH0p' },
            ].map((social) => (
              <IconButton
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                sx={{
                  color: 'white',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.15)',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                  },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Main Footer */}
      <Box component="footer" sx={classes.footer}>
        <Container sx={classes.footerContainer}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 4,
            }}
          >
            {/* Información Institucional */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Image
                  src="/logo.webp"
                  alt="Escudo Estación General Paz"
                  width={36}
                  height={44}
                  style={{ objectFit: 'contain', opacity: 0.9 }}
                />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    Municipalidad de
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Estación General Paz
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                <LocationOnIcon fontSize="small" sx={{ mt: 0.3, opacity: 0.7 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Buenos Aires, esq. Sgo. del Estero
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PhoneIcon fontSize="small" sx={{ opacity: 0.7 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  3525-312959
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" sx={{ opacity: 0.7 }} />
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.8, wordBreak: 'break-word' }}
                >
                  municipiogpaz@gmail.com
                </Typography>
              </Box>
            </Box>

            {/* Enlaces Rápidos */}
            <Box>
              <Typography variant="h6" sx={classes.footerTitle}>
                Enlaces Rápidos
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {[
                  { label: 'Gobierno', href: PUBLIC_ROUTES.MUNICIPALIDAD },
                  { label: 'Areas', href: PUBLIC_ROUTES.SERVICIOS },
                  { label: 'Trámites', href: PUBLIC_ROUTES.SERVICIOS_TRAMITES },
                  { label: 'Transparencia', href: PUBLIC_ROUTES.TRANSPARENCIA },
                  { label: 'Contacto', href: PUBLIC_ROUTES.CONTACTO },
                ].map((link) => (
                  <Link key={link.label} href={link.href} style={classes.footerLink}>
                    <Typography
                      variant="body2"
                      sx={{
                        position: 'relative',
                        display: 'inline-block',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -1,
                          left: 0,
                          width: '0%',
                          height: '1px',
                          backgroundColor: 'rgba(255,255,255,0.6)',
                          transition: 'width 0.3s ease',
                        },
                        '&:hover::after': {
                          width: '100%',
                        },
                      }}
                    >
                      {link.label}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Box>

            {/* Servicios */}
            <Box>
              <Typography variant="h6" sx={classes.footerTitle}>
                Areas
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {[
                  { label: 'Salud', href: PUBLIC_ROUTES.SERVICIOS_SALUD },
                  { label: 'Cultura y Deporte', href: PUBLIC_ROUTES.SERVICIOS_CULTURA },
                  { label: 'Obra e infraestructura', href: PUBLIC_ROUTES.SERVICIOS_OBRAS },
                  { label: 'Educación', href: PUBLIC_ROUTES.SERVICIOS_EDUCACION },
                  { label: 'Registro Civil', href: PUBLIC_ROUTES.SERVICIOS_REGISTRO },
                ].map((link) => (
                  <Link key={link.label} href={link.href} style={classes.footerLink}>
                    <Typography
                      variant="body2"
                      sx={{
                        position: 'relative',
                        display: 'inline-block',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -1,
                          left: 0,
                          width: '0%',
                          height: '1px',
                          backgroundColor: 'rgba(255,255,255,0.6)',
                          transition: 'width 0.3s ease',
                        },
                        '&:hover::after': {
                          width: '100%',
                        },
                      }}
                    >
                      {link.label}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Box>

            {/* Horario y Redes */}
            <Box>
              <Typography variant="h6" sx={classes.footerTitle}>
                Horario de Atención
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                Lunes a Viernes
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                07:00 a 14:00 hs
              </Typography>
            </Box>
          </Box>

          {/* Copyright */}
          <Box sx={classes.footerBottom}>
            <Typography variant="body2" sx={classes.footerCopyright}>
              © {currentYear} Municipalidad de Estación General Paz. Todos los
              derechos reservados.
            </Typography>
            <Box
              component="a"
              href="https://gecdigital.dev/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mt: 1.5,
                pt: 1.5,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                opacity: 0.45,
                transition: 'opacity 0.3s ease',
                textDecoration: 'none',
                '&:hover': { opacity: 0.8 },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.02em',
                }}
              >
                Desarrollado por
              </Typography>
              <Image
                src="/logo-gec.png"
                alt="GEC Soluciones Digitales"
                width={22}
                height={22}
                style={{ objectFit: 'contain' }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}
              >
                GEC Soluciones Digitales
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
