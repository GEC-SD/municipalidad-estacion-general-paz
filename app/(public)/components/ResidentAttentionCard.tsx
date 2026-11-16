'use client';

import { useEffect, useState } from 'react';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { Close, ArrowForward } from '@mui/icons-material';

const STORAGE_KEY = 'resident-attention-card-dismissed';
const FORM_URL = 'https://forms.gle/xmPBu8LGA5BjEKpM8';
const IMAGE_URL =
  'https://rxiuuzrkcuolvjtogxez.supabase.co/storage/v1/object/public/news-images/1775579569573-4x2b5s5q4l05.webp';

export default function ResidentAttentionCard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== 'true');
    });
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  return (
    <Paper
      role="complementary"
      aria-label="Atención al vecino"
      elevation={8}
      sx={{
        position: 'fixed',
        zIndex: 1200,
        left: { xs: 12, sm: 'auto' },
        right: { xs: 12, sm: 24 },
        bottom: { xs: 84, sm: 96 },
        width: { xs: 'auto', sm: 420 },
        maxHeight: 'calc(100dvh - 108px)',
        overflowX: 'hidden',
        overflowY: 'auto',
        borderRadius: { xs: 3, sm: 4 },
        border: '1px solid',
        borderColor: 'rgba(26, 95, 139, 0.18)',
        boxShadow: '0 18px 48px rgba(18, 57, 82, 0.18)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '0 0 auto 0',
          height: 4,
          background: 'linear-gradient(90deg, #1A5F8B 0%, #2E86C1 55%, #25D366 100%)',
        },
      }}
    >
      <IconButton
        aria-label="Ocultar aviso"
        size="small"
        onClick={dismiss}
        sx={{
          position: 'absolute',
          zIndex: 1,
          top: 9,
          right: 9,
          color: 'text.secondary',
          backgroundColor: 'rgba(255,255,255,.86)',
          '&:hover': { backgroundColor: 'grey.100' },
        }}
      >
        <Close fontSize="small" />
      </IconButton>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: { xs: 1.5, sm: 2 },
          p: { xs: 1.5, sm: 2 },
          pt: { xs: 2, sm: 2.5 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: { xs: 76, sm: 92 },
            overflow: 'hidden',
            borderRadius: 2.5,
            backgroundColor: '#F4F8FB',
            border: '1px solid rgba(26, 95, 139, 0.12)',
          }}
        >
          <Box
            component="img"
            src={IMAGE_URL}
            alt="Atención al vecino"
            sx={{
              display: 'block',
              width: '90%',
              height: '100%',
              mx: 'auto',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </Box>

        <Box sx={{ minWidth: 0, pr: 3.5 }}>
          <Typography
            variant="overline"
            color="primary.main"
            sx={{ display: 'block', fontWeight: 800, fontSize: '0.68rem', letterSpacing: '0.09em', lineHeight: 1.3 }}
          >
            Participación ciudadana
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 0.4, fontWeight: 800, lineHeight: 1.2 }}>
            Atención al vecino
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.65, lineHeight: 1.5 }}>
            Dejanos tu consulta o reclamo para recibir una respuesta municipal.
          </Typography>
        </Box>

        <Button
          component="a"
          href={FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          size="small"
          endIcon={<ArrowForward />}
          sx={{
            gridColumn: '1 / -1',
            justifySelf: 'stretch',
            mt: { xs: 0.25, sm: 0.5 },
            px: 2,
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
          }}
        >
          Ir al formulario
        </Button>
      </Box>
    </Paper>
  );
}
