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
import { createContactAsync, clearContactStatus } from '@/state/redux/contact';
import { ADMIN_ROUTES, CONTACT_CATEGORIES } from '@/constants';
import { ContactFormData, ContactCategory } from '@/types';

const schema = yup.object({
  department: yup.string().required('El departamento es requerido'),
  description: yup.string().optional(),
  phone: yup.string().optional(),
  email: yup.string().email('Email inválido').optional(),
  address: yup.string().optional(),
  hours: yup.string().optional(),
  category: yup.string<ContactCategory>().required('La categoría es requerida'),
  order_position: yup.number().integer().min(0).optional(),
  is_active: yup.boolean().required(),
}) as yup.ObjectSchema<ContactFormData>;

const NuevoContactoPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.contact);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      department: '',
      description: '',
      phone: '',
      email: '',
      address: '',
      hours: '',
      category: undefined,
      order_position: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (status.createContactAsync?.response === 'fulfilled') {
      router.push(ADMIN_ROUTES.ADMIN_CONTACTO);
    }
  }, [status.createContactAsync?.response, router]);

  useEffect(() => {
    return () => {
      dispatch(clearContactStatus('createContactAsync'));
    };
  }, [dispatch]);

  const onSubmit = (data: ContactFormData) => {
    dispatch(createContactAsync(data));
  };

  const loading = status.createContactAsync?.loading;
  const error = status.createContactAsync?.response === 'rejected';
  const errorMessage = status.createContactAsync?.message;

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={ADMIN_ROUTES.ADMIN_DASHBOARD} style={{ textDecoration: 'none', color: 'inherit' }}>
          Dashboard
        </Link>
        <Link href={ADMIN_ROUTES.ADMIN_CONTACTO} style={{ textDecoration: 'none', color: 'inherit' }}>
          Contacto
        </Link>
        <Typography color="text.primary">Nuevo</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_CONTACTO}>
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Nuevo Contacto
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage || 'Error al crear el contacto'}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
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
                      {CONTACT_CATEGORIES.map((cat) => (
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
                rows={2}
                error={!!errors.description}
                helperText={errors.description?.message}
                disabled={loading}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
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
                  {...register('email')}
                  label="Email"
                  fullWidth
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={loading}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              <Box>
                <TextField
                  {...register('address')}
                  label="Dirección"
                  fullWidth
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  disabled={loading}
                />
              </Box>
              <Box>
                <TextField
                  {...register('hours')}
                  label="Horario de atención"
                  fullWidth
                  error={!!errors.hours}
                  helperText={errors.hours?.message}
                  disabled={loading}
                />
              </Box>
            </Box>

            <Box>
              <TextField
                {...register('order_position')}
                label="Orden de aparición"
                fullWidth
                type="number"
                error={!!errors.order_position}
                helperText={errors.order_position?.message}
                disabled={loading}
                sx={{ maxWidth: 200 }}
              />
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
              <Button variant="outlined" component={Link} href={ADMIN_ROUTES.ADMIN_CONTACTO} disabled={loading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Contacto'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default NuevoContactoPage;
