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
  FormControlLabel,
  Switch,
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
import { createAuthorityAsync, clearAuthoritiesStatus } from '@/state/redux/authorities';
import { ADMIN_ROUTES, AUTHORITY_CATEGORIES, STORAGE_BUCKETS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@/constants';
import { AuthorityFormData } from '@/types';
import FileUpload from '../../components/FileUpload';

const schema = yup.object({
  full_name: yup.string().required('El nombre es requerido'),
  position: yup.string().required('El cargo es requerido'),
  department: yup.string().optional(),
  bio: yup.string().optional(),
  photo_url: yup.string().optional(),
  email: yup.string().email('Debe ser un email válido').optional(),
  phone: yup.string().optional(),
  order_position: yup.number().integer().min(0).optional(),
  category: yup.string<'intendente' | 'gabinete' | 'concejo'>().required('La categoría es requerida'),
  is_active: yup.boolean().required(),
}) as yup.ObjectSchema<AuthorityFormData>;

const NuevaAutoridadPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.authorities);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AuthorityFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: '',
      position: '',
      department: '',
      bio: '',
      photo_url: '',
      email: '',
      phone: '',
      order_position: 0,
      category: 'gabinete',
      is_active: true,
    },
  });

  useEffect(() => {
    if (status.createAuthorityAsync?.response === 'fulfilled') {
      router.push(ADMIN_ROUTES.ADMIN_AUTORIDADES);
    }
  }, [status.createAuthorityAsync?.response, router]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthoritiesStatus('createAuthorityAsync'));
    };
  }, [dispatch]);

  const onSubmit = (data: AuthorityFormData) => {
    dispatch(createAuthorityAsync(data));
  };

  const loading = status.createAuthorityAsync?.loading;
  const error = status.createAuthorityAsync?.response === 'rejected';
  const errorMessage = status.createAuthorityAsync?.message;

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={ADMIN_ROUTES.ADMIN_DASHBOARD} style={{ textDecoration: 'none', color: 'inherit' }}>
          Dashboard
        </Link>
        <Link href={ADMIN_ROUTES.ADMIN_AUTORIDADES} style={{ textDecoration: 'none', color: 'inherit' }}>
          Autoridades
        </Link>
        <Typography color="text.primary">Nueva</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_AUTORIDADES}>
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Nueva Autoridad
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage || 'Error al crear la autoridad'}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              <Box>
                <TextField
                  {...register('full_name')}
                  label="Nombre completo"
                  fullWidth
                  error={!!errors.full_name}
                  helperText={errors.full_name?.message}
                  disabled={loading}
                />
              </Box>
              <Box>
                <TextField
                  {...register('position')}
                  label="Cargo"
                  fullWidth
                  error={!!errors.position}
                  helperText={errors.position?.message}
                  disabled={loading}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
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
                      disabled={loading}
                    >
                      {AUTHORITY_CATEGORIES.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>
              <Box>
                <TextField
                  {...register('department')}
                  label="Departamento / Área"
                  fullWidth
                  error={!!errors.department}
                  helperText={errors.department?.message}
                  disabled={loading}
                />
              </Box>
            </Box>

            <Box>
              <TextField
                {...register('bio')}
                label="Biografía"
                fullWidth
                multiline
                rows={4}
                error={!!errors.bio}
                helperText={errors.bio?.message}
                disabled={loading}
              />
            </Box>

            <Box>
              <Controller
                name="photo_url"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    bucket={STORAGE_BUCKETS.AUTHORITY_PHOTOS}
                    maxSize={FILE_SIZE_LIMITS.AUTHORITY_PHOTO_MAX_SIZE}
                    allowedTypes={[...ALLOWED_FILE_TYPES.IMAGES]}
                    accept="image/jpeg,image/png,image/webp"
                    label="Foto"
                    helperText="JPG, PNG o WebP. Máximo 1 MB. Recomendado 400x500px."
                    value={field.value}
                    onChange={(url) => field.onChange(url || '')}
                    disabled={loading}
                    variant="image"
                  />
                )}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              <Box>
                <TextField
                  {...register('email')}
                  label="Email"
                  fullWidth
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={loading}
                />
              </Box>
              <Box>
                <TextField
                  {...register('phone')}
                  label="Teléfono"
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  disabled={loading}
                />
              </Box>
              <Box>
                <TextField
                  {...register('order_position')}
                  label="Orden de aparición"
                  fullWidth
                  type="number"
                  error={!!errors.order_position}
                  helperText={errors.order_position?.message || 'Menor número = aparece primero'}
                  disabled={loading}
                />
              </Box>
            </Box>

            <Box>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        disabled={loading}
                      />
                    }
                    label="Activo (visible en el sitio público)"
                  />
                )}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" component={Link} href={ADMIN_ROUTES.ADMIN_AUTORIDADES} disabled={loading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Autoridad'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default NuevaAutoridadPage;
