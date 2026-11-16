'use client';

import { Box, Typography } from '@mui/material';
import { WhatsApp as WhatsAppIcon } from '@mui/icons-material';

const WHATSAPP_NUMBER = '5493525312959';

const WhatsAppButton = () => {
  return (
    <Box
      component="a"
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20me%20comunico%20con%20Mesa%20de%20Entrada%20de%20la%20Municipalidad.`}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        position: 'fixed',
        bottom: { xs: 16, md: 24 },
        right: { xs: 16, md: 24 },
        // Se mantiene por encima de cualquier aviso flotante.
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: '#25D366',
        color: 'white',
        borderRadius: '50px',
        px: 2,
        py: 1.5,
        textDecoration: 'none',
        boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: '#1EBE5D',
          transform: 'scale(1.05)',
          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.5)',
        },
      }}
    >
      <WhatsAppIcon sx={{ fontSize: 28 }} />
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '0.875rem',
          display: { xs: 'none', sm: 'block' },
          whiteSpace: 'nowrap',
        }}
      >
        Mesa de Entrada
      </Typography>
    </Box>
  );
};

export default WhatsAppButton;
