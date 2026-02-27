'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  Breadcrumbs,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import { createRegulationAsync, clearRegulationsStatus } from '@/state/redux/regulations';
import { ADMIN_ROUTES, REGULATION_CATEGORIES, REGULATION_TYPES, STORAGE_BUCKETS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@/constants';
import { RegulationFormData } from '@/types';
import FileUpload from '../../components/FileUpload';

const schema = yup.object({
  title: yup.string().required('El título es requerido'),
  regulation_number: yup.string().required('El número es requerido'),
  type: yup
    .string()
    .oneOf(['ordenanza', 'decreto'] as const, 'Seleccioná un tipo válido')
    .required('El tipo es requerido'),
  year: yup
    .number()
    .required('El año es requerido')
    .min(1900, 'El año debe ser mayor a 1900')
    .max(new Date().getFullYear(), 'El año no puede ser futuro'),
  description: yup.string().optional(),
  pdf_url: yup.string().required('El PDF es requerido'),
  category: yup.string().optional(),
}) as yup.ObjectSchema<RegulationFormData>;

const NuevaNormativaPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.regulations);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegulationFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      regulation_number: '',
      type: 'ordenanza',
      year: new Date().getFullYear(),
      description: '',
      pdf_url: '',
      category: undefined,
    },
  });

  useEffect(() => {
    if (status.createRegulationAsync?.response === 'fulfilled') {
      router.push(ADMIN_ROUTES.ADMIN_TRANSPARENCIA);
    }
  }, [status.createRegulationAsync?.response, router]);

  useEffect(() => {
    return () => {
      dispatch(clearRegulationsStatus('createRegulationAsync'));
    };
  }, [dispatch]);

  const onSubmit = (data: RegulationFormData) => {
    dispatch(createRegulationAsync(data));
  };

  const loading = status.createRegulationAsync?.loading;
  const error = status.createRegulationAsync?.response === 'rejected';
  const errorMessage = status.createRegulationAsync?.message;

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={ADMIN_ROUTES.ADMIN_DASHBOARD} style={{ textDecoration: 'none', color: 'inherit' }}>
          Dashboard
        </Link>
        <Link href={ADMIN_ROUTES.ADMIN_TRANSPARENCIA} style={{ textDecoration: 'none', color: 'inherit' }}>
          Transparencia
        </Link>
        <Typography color="text.primary">Nueva</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_TRANSPARENCIA}>
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Nueva Normativa
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage || 'Error al crear la normativa'}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            <Box>
              <TextField
                {...register('title')}
                label="Título"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
                disabled={loading}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
              <Box>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Tipo"
                      fullWidth
                      error={!!errors.type}
                      helperText={errors.type?.message}
                      disabled={loading}
                    >
                      {REGULATION_TYPES.map((t) => (
                        <MenuItem key={t.value} value={t.value}>
                          {t.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>
              <Box>
                <TextField
                  {...register('regulation_number')}
                  label="Número"
                  fullWidth
                  error={!!errors.regulation_number}
                  helperText={errors.regulation_number?.message}
                  disabled={loading}
                />
              </Box>
              <Box>
                <TextField
                  {...register('year')}
                  label="Año"
                  fullWidth
                  type="number"
                  error={!!errors.year}
                  helperText={errors.year?.message}
                  disabled={loading}
                />
              </Box>
              <Box>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      select
                      label="Categoría"
                      fullWidth
                      error={!!errors.category}
                      helperText={errors.category?.message}
                      disabled={loading}
                    >
                      <MenuItem value="">Sin categoría</MenuItem>
                      {REGULATION_CATEGORIES.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>
            </Box>

            <Box>
              <TextField
                {...register('description')}
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
                disabled={loading}
              />
            </Box>

            <Box>
              <Controller
                name="pdf_url"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    bucket={STORAGE_BUCKETS.REGULATIONS_PDFS}
                    maxSize={FILE_SIZE_LIMITS.REGULATION_PDF_MAX_SIZE}
                    allowedTypes={[...ALLOWED_FILE_TYPES.PDFS]}
                    accept="application/pdf"
                    label="Archivo PDF"
                    helperText="Solo archivos PDF."
                    value={field.value}
                    onChange={(url) => field.onChange(url || '')}
                    disabled={loading}
                    variant="file"
                  />
                )}
              />
              {errors.pdf_url && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {errors.pdf_url.message}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" component={Link} href={ADMIN_ROUTES.ADMIN_TRANSPARENCIA} disabled={loading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default NuevaNormativaPage;
