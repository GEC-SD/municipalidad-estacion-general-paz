'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Divider,
  Skeleton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import {
  getAreaResenaAsync,
  upsertAreaResenaAsync,
  clearServicesStatus,
} from '@/state/redux/services';
import { ADMIN_ROUTES, SERVICE_CATEGORIES } from '@/constants';
import { ServiceCategory } from '@/types';
import { sanitizeHtml } from '@/utils/sanitize';

const RichTextEditor = dynamic(() => import('../../components/RichTextEditor'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />,
});

const ResenasPage = () => {
  const dispatch = useAppDispatch();
  const { resenas, status } = useAppSelector((state) => state.services);

  const [selectedArea, setSelectedArea] = useState<ServiceCategory | ''>('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (selectedArea) {
      dispatch(getAreaResenaAsync(selectedArea));
    }
  }, [dispatch, selectedArea]);

  useEffect(() => {
    if (selectedArea && resenas?.[selectedArea]) {
      setContent(resenas[selectedArea]!.content);
    } else if (selectedArea) {
      setContent('');
    }
  }, [selectedArea, resenas]);

  useEffect(() => {
    if (status.upsertAreaResenaAsync?.response === 'fulfilled') {
      const timer = setTimeout(() => {
        dispatch(clearServicesStatus('upsertAreaResenaAsync'));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status.upsertAreaResenaAsync?.response, dispatch]);

  const handleSave = () => {
    if (!selectedArea) return;
    dispatch(upsertAreaResenaAsync({ area: selectedArea, content }));
  };

  const loadingGet = status.getAreaResenaAsync?.loading;
  const loadingSave = status.upsertAreaResenaAsync?.loading;
  const saveSuccess = status.upsertAreaResenaAsync?.response === 'fulfilled';
  const saveError = status.upsertAreaResenaAsync?.response === 'rejected';
  const saveErrorMessage = status.upsertAreaResenaAsync?.message;

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={ADMIN_ROUTES.ADMIN_DASHBOARD} style={{ textDecoration: 'none', color: 'inherit' }}>
          Dashboard
        </Link>
        <Link href={ADMIN_ROUTES.ADMIN_SERVICIOS} style={{ textDecoration: 'none', color: 'inherit' }}>
          Areas
        </Link>
        <Typography color="text.primary">Reseñas</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_SERVICIOS}>
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Reseñas de Areas
        </Typography>
      </Box>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Reseña guardada correctamente
        </Alert>
      )}

      {saveError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {saveErrorMessage || 'Error al guardar la reseña'}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <TextField
          select
          label="Seleccionar Area"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value as ServiceCategory)}
          fullWidth
          sx={{ mb: 3 }}
        >
          {SERVICE_CATEGORIES.map((cat) => (
            <MenuItem key={cat.value} value={cat.value}>
              {cat.label}
            </MenuItem>
          ))}
        </TextField>

        {selectedArea && (
          <>
            {loadingGet ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  label="Contenido de la reseña"
                  placeholder="Escribe la reseña del area aquí..."
                  disabled={loadingSave}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={loadingSave ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={loadingSave}
                  >
                    {loadingSave ? 'Guardando...' : 'Guardar Reseña'}
                  </Button>
                </Box>

                {content && content !== '<p><br></p>' && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Vista previa
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        '& h1': { fontSize: '1.75rem', fontWeight: 700, mt: 0, mb: 1 },
                        '& h2': { fontSize: '1.5rem', fontWeight: 600, mt: 0, mb: 1 },
                        '& h3': { fontSize: '1.25rem', fontWeight: 600, mt: 0, mb: 1 },
                        '& p': { mb: 1.5, lineHeight: 1.75, '&:last-child': { mb: 0 } },
                        '& ul, & ol': { pl: 3, mb: 1.5 },
                        '& li': { mb: 0.5 },
                        '& a': { color: 'primary.main', textDecoration: 'underline' },
                        '& strong': { fontWeight: 600 },
                      }}
                    >
                      <Box dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
                    </Paper>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ResenasPage;
