'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import {
  getMunicipalityInfoAsync,
  updateMunicipalityInfoAsync,
  clearSettingsStatus,
} from '@/state/redux/settings';

const ConfiguracionPage = () => {
  const dispatch = useAppDispatch();
  const { municipalityInfo, status } = useAppSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    historia: '',
    mision: '',
    vision: '',
    valores: [] as string[],
  });
  const [newValor, setNewValor] = useState('');

  useEffect(() => {
    dispatch(getMunicipalityInfoAsync());
  }, [dispatch]);

  useEffect(() => {
    if (municipalityInfo) {
      setFormData({
        historia: municipalityInfo.historia || '',
        mision: municipalityInfo.mision || '',
        vision: municipalityInfo.vision || '',
        valores: municipalityInfo.valores || [],
      });
    }
  }, [municipalityInfo]);

  useEffect(() => {
    return () => {
      dispatch(clearSettingsStatus());
    };
  }, [dispatch]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleAddValor = () => {
    if (newValor.trim()) {
      setFormData({
        ...formData,
        valores: [...formData.valores, newValor.trim()],
      });
      setNewValor('');
    }
  };

  const handleRemoveValor = (index: number) => {
    setFormData({
      ...formData,
      valores: formData.valores.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateMunicipalityInfoAsync(formData));
  };

  const loading = status.getMunicipalityInfoAsync?.loading;
  const updating = status.updateMunicipalityInfoAsync?.loading;
  const success = status.updateMunicipalityInfoAsync?.response === 'fulfilled';
  const error = status.updateMunicipalityInfoAsync?.response === 'rejected';

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Configuración del Sitio
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Configuración guardada correctamente
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al guardar la configuración
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Información Institucional
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            <Box>
              <TextField
                label="Historia de la Ciudad"
                fullWidth
                multiline
                rows={6}
                value={formData.historia}
                onChange={handleChange('historia')}
                disabled={loading || updating}
                helperText="Texto sobre la historia de la ciudad (HTML permitido)"
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              <Box>
                <TextField
                  label="Misión"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.mision}
                  onChange={handleChange('mision')}
                  disabled={loading || updating}
                />
              </Box>

              <Box>
                <TextField
                  label="Visión"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.vision}
                  onChange={handleChange('vision')}
                  disabled={loading || updating}
                />
              </Box>
            </Box>

            <Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Valores Institucionales
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {formData.valores.map((valor, index) => (
                  <Chip
                    key={index}
                    label={valor}
                    onDelete={() => handleRemoveValor(index)}
                    deleteIcon={<CloseIcon />}
                    disabled={loading || updating}
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  label="Nuevo valor"
                  size="small"
                  value={newValor}
                  onChange={(e) => setNewValor(e.target.value)}
                  disabled={loading || updating}
                  sx={{ flex: 1 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddValor();
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddValor}
                  disabled={loading || updating || !newValor.trim()}
                >
                  Agregar
                </Button>
              </Box>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={updating ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading || updating}
                >
                  {updating ? 'Guardando...' : 'Guardar Configuración'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConfiguracionPage;
