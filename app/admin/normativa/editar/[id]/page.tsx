'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  Skeleton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import {
  getRegulationByIdAsync,
  updateRegulationAsync,
  clearRegulationsStatus,
} from '@/state/redux/regulations';
import { ADMIN_ROUTES, REGULATION_CATEGORIES, STORAGE_BUCKETS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@/constants';
import { RegulationFormData } from '@/types';
import FileUpload from '../../../components/FileUpload';

const schema = yup.object({
  title: yup.string().required('El título es requerido'),
  regulation_number: yup.string().required('El número de ordenanza es requerido'),
  year: yup
    .number()
    .required('El año es requerido')
    .min(1900, 'El año debe ser mayor a 1900')
    .max(new Date().getFullYear(), 'El año no puede ser futuro'),
  description: yup.string().optional(),
  pdf_url: yup.string().required('El PDF es requerido'),
  category: yup.string().optional(),
}) as yup.ObjectSchema<RegulationFormData>;

const EditarNormativaPage = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { regulations, status } = useAppSelector((state) => state.regulations);

  const id = params.id as string;
  const currentRegulation = regulations.find((r) => r.id === id);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RegulationFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (id) {
      dispatch(getRegulationByIdAsync(id));
    }
    return () => {
      dispatch(clearRegulationsStatus());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentRegulation) {
      reset({
        title: currentRegulation.title,
        regulation_number: currentRegulation.regulation_number,
        year: currentRegulation.year,
        description: currentRegulation.description || '',
        pdf_url: currentRegulation.pdf_url,
        category: currentRegulation.category,
      });
    }
  }, [currentRegulation, reset]);

  useEffect(() => {
    if (status.updateRegulationAsync?.response === 'fulfilled') {
      router.push(ADMIN_ROUTES.ADMIN_NORMATIVA);
    }
  }, [status.updateRegulationAsync?.response, router]);

  const onSubmit = (data: RegulationFormData) => {
    dispatch(updateRegulationAsync({ id, data }));
  };

  const loadingGet = status.getRegulationByIdAsync?.loading;
  const loadingUpdate = status.updateRegulationAsync?.loading;
  const error = status.updateRegulationAsync?.response === 'rejected';
  const errorMessage = status.updateRegulationAsync?.message;

  if (loadingGet) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            {Array.from(new Array(5)).map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={56} />
            ))}
          </Box>
        </Paper>
      </Box>
    );
  }

  if (!currentRegulation && !loadingGet) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          No se encontró la ordenanza
        </Alert>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_NORMATIVA}>
          Volver a Normativa
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={ADMIN_ROUTES.ADMIN_DASHBOARD} style={{ textDecoration: 'none', color: 'inherit' }}>
          Dashboard
        </Link>
        <Link href={ADMIN_ROUTES.ADMIN_NORMATIVA} style={{ textDecoration: 'none', color: 'inherit' }}>
          Normativa
        </Link>
        <Typography color="text.primary">Editar</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_NORMATIVA}>
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Editar Ordenanza
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage || 'Error al actualizar la ordenanza'}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            <Box>
              <TextField
                {...register('title')}
                label="Título de la ordenanza"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
                disabled={loadingUpdate}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              <Box>
                <TextField
                  {...register('regulation_number')}
                  label="Número de ordenanza"
                  fullWidth
                  error={!!errors.regulation_number}
                  helperText={errors.regulation_number?.message}
                  disabled={loadingUpdate}
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
                  disabled={loadingUpdate}
                />
              </Box>
              <Box>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Categoría"
                      fullWidth
                      error={!!errors.category}
                      helperText={errors.category?.message}
                      disabled={loadingUpdate}
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
                disabled={loadingUpdate}
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
                    label="Archivo PDF de la ordenanza"
                    helperText="Solo PDF. Máximo 5 MB."
                    value={field.value}
                    onChange={(url) => field.onChange(url || '')}
                    disabled={loadingUpdate}
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
              <Button variant="outlined" component={Link} href={ADMIN_ROUTES.ADMIN_NORMATIVA} disabled={loadingUpdate}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loadingUpdate ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loadingUpdate}
              >
                {loadingUpdate ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditarNormativaPage;
