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
  FormControlLabel,
  Switch,
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
  getAuthorityByIdAsync,
  updateAuthorityAsync,
  clearAuthoritiesStatus,
} from '@/state/redux/authorities';
import { ADMIN_ROUTES, AUTHORITY_CATEGORIES, STORAGE_BUCKETS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@/constants';
import { AuthorityFormData } from '@/types';
import FileUpload from '../../../components/FileUpload';

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

const EditarAutoridadPage = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.authorities);

  const id = params.id as string;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AuthorityFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (id) {
      dispatch(getAuthorityByIdAsync(id));
    }
    return () => {
      dispatch(clearAuthoritiesStatus());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (status.getAuthorityByIdAsync?.response === 'fulfilled') {
      // We need to get the data from the store — but authorities slice
      // doesn't have currentAuthority. We'll use the fulfilled payload from thunk.
      // A workaround: re-fetch and populate via a local state.
    }
  }, [status.getAuthorityByIdAsync?.response]);

  // Since the authorities slice doesn't store a "currentAuthority",
  // find the authority from the list after fetching
  const { authorities } = useAppSelector((state) => state.authorities);
  const currentAuthority = authorities.find((a) => a.id === id);

  useEffect(() => {
    if (currentAuthority) {
      reset({
        full_name: currentAuthority.full_name,
        position: currentAuthority.position,
        department: currentAuthority.department || '',
        bio: currentAuthority.bio || '',
        photo_url: currentAuthority.photo_url || '',
        email: currentAuthority.email || '',
        phone: currentAuthority.phone || '',
        order_position: currentAuthority.order_position || 0,
        category: currentAuthority.category,
        is_active: currentAuthority.is_active,
      });
    }
  }, [currentAuthority, reset]);

  useEffect(() => {
    if (status.updateAuthorityAsync?.response === 'fulfilled') {
      router.push(ADMIN_ROUTES.ADMIN_AUTORIDADES);
    }
  }, [status.updateAuthorityAsync?.response, router]);

  const onSubmit = (data: AuthorityFormData) => {
    dispatch(updateAuthorityAsync({ id, data }));
  };

  const loadingGet = status.getAuthorityByIdAsync?.loading;
  const loadingUpdate = status.updateAuthorityAsync?.loading;
  const error = status.updateAuthorityAsync?.response === 'rejected';
  const errorMessage = status.updateAuthorityAsync?.message;

  if (loadingGet) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            {Array.from(new Array(6)).map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={56} />
            ))}
          </Box>
        </Paper>
      </Box>
    );
  }

  if (!currentAuthority && !loadingGet) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          No se encontró la autoridad
        </Alert>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_AUTORIDADES}>
          Volver a Autoridades
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
        <Link href={ADMIN_ROUTES.ADMIN_AUTORIDADES} style={{ textDecoration: 'none', color: 'inherit' }}>
          Autoridades
        </Link>
        <Typography color="text.primary">Editar</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_AUTORIDADES}>
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Editar Autoridad
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage || 'Error al actualizar la autoridad'}
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
                  disabled={loadingUpdate}
                />
              </Box>
              <Box>
                <TextField
                  {...register('position')}
                  label="Cargo"
                  fullWidth
                  error={!!errors.position}
                  helperText={errors.position?.message}
                  disabled={loadingUpdate}
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
                      disabled={loadingUpdate}
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
                  disabled={loadingUpdate}
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
                disabled={loadingUpdate}
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
                    disabled={loadingUpdate}
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
                  disabled={loadingUpdate}
                />
              </Box>
              <Box>
                <TextField
                  {...register('phone')}
                  label="Teléfono"
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  disabled={loadingUpdate}
                />
              </Box>
              <Box>
                <TextField
                  {...register('order_position')}
                  label="Orden de aparición"
                  fullWidth
                  type="number"
                  error={!!errors.order_position}
                  helperText={errors.order_position?.message}
                  disabled={loadingUpdate}
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
                        checked={field.value || false}
                        onChange={field.onChange}
                        disabled={loadingUpdate}
                      />
                    }
                    label="Activo (visible en el sitio público)"
                  />
                )}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" component={Link} href={ADMIN_ROUTES.ADMIN_AUTORIDADES} disabled={loadingUpdate}>
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

export default EditarAutoridadPage;
