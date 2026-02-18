'use client';

import Link from 'next/link';
import { Box, Container, Paper, Typography } from '@mui/material';
import {
  EventNote as EventNoteIcon,
  ReportProblem as ReportProblemIcon,
  Payment as PaymentIcon,
  Description as DescriptionIcon,
  Gavel as GavelIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { PUBLIC_ROUTES } from '@/constants';
import classes from './classes';

const quickAccessItems = [
  {
    label: 'Turnos',
    icon: <EventNoteIcon sx={{ fontSize: 28 }} />,
    href: PUBLIC_ROUTES.CONTACTO,
    color: '#2E86C1',
  },
  {
    label: 'Reclamos',
    icon: <ReportProblemIcon sx={{ fontSize: 28 }} />,
    href: PUBLIC_ROUTES.CONTACTO,
    color: '#B52A1C',
  },
  {
    label: 'Pagos',
    icon: <PaymentIcon sx={{ fontSize: 28 }} />,
    href: PUBLIC_ROUTES.SERVICIOS_TRAMITES,
    color: '#F5A623',
  },
  {
    label: 'Trámites',
    icon: <DescriptionIcon sx={{ fontSize: 28 }} />,
    href: PUBLIC_ROUTES.SERVICIOS_TRAMITES,
    color: '#1A5F8B',
  },
  {
    label: 'Transparencia',
    icon: <GavelIcon sx={{ fontSize: 28 }} />,
    href: PUBLIC_ROUTES.TRANSPARENCIA,
    color: '#5DA9D9',
  },
  {
    label: 'Contacto',
    icon: <PhoneIcon sx={{ fontSize: 28 }} />,
    href: PUBLIC_ROUTES.CONTACTO,
    color: '#2E7D32',
  },
];

const QuickAccessBar = () => {
  return (
    <Box sx={classes.quickAccessBar}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 2, md: 3 } }}>
          <Box sx={classes.quickAccessGrid}>
            {quickAccessItems.map((item) => (
              <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
                <Box sx={classes.quickAccessItem}>
                  <Box
                    sx={{
                      ...classes.quickAccessIcon,
                      backgroundColor: item.color,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, textAlign: 'center' }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Link>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default QuickAccessBar;
