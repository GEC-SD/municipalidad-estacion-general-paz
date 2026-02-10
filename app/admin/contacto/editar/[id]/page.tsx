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
  getContactByIdAsync,
  updateContactAsync,
  clearContactStatus,
} from '@/state/redux/contact';
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

const EditarContactoPage = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { contacts, status } = useAppSelector((state) => state.contact);

  const id = params.id as string;

  const currentContact = contacts.find((c) => c.id === id) || null;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (id && !currentContact) {
      dispatch(getContactByIdAsync(id));
    }
    return () => {
      dispatch(clearContactStatus());
    };
  }, [dispatch, id, currentContact]);

  useEffect(() => {
    if (currentContact) {
      reset({
        department: currentContact.department,
        description: currentContact.description || '',
        phone: currentContact.phone || '',
        email: currentContact.email || '',
        address: currentContact.address || '',
        hours: currentContact.hours || '',
        category: currentContact.category,
        order_position: currentContact.order_position || 0,
        is_active: currentContact.is_active,
      });
    }
  }, [currentContact, reset]);

  useEffect(() => {
    if (status.updateContactAsync?.response === 'fulfilled') {
      router.push(ADMIN_ROUTES.ADMIN_CONTACTO);
    }
  }, [status.updateContactAsync?.response, router]);

  const onSubmit = (data: ContactFormData) => {
    dispatch(updateContactAsync({ id, data }));
  };

  const loadingGet = status.getContactByIdAsync?.loading;
  const loadingUpdate = status.updateContactAsync?.loading;
  const error = status.updateContactAsync?.response === 'rejected';
  const errorMessage = status.updateContactAsync?.message;

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

  if (!currentContact && !loadingGet && status.getContactByIdAsync?.response === 'rejected') {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          No se encontró el contacto
        </Alert>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_CONTACTO}>
          Volver a Contacto
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
        <Link href={ADMIN_ROUTES.ADMIN_CONTACTO} style={{ textDecoration: 'none', color: 'inherit' }}>
          Contacto
        </Link>
        <Typography color="text.primary">Editar</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_CONTACTO}>
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Editar Contacto
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage || 'Error al actualizar el contacto'}
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
                      value={field.value ?? ''}
                      select
                      label="Categoría"
                      fullWidth
                      error={!!errors.category}
                      helperText={errors.category?.message}
                      disabled={loadingUpdate}
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
                disabled={loadingUpdate}
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
                  disabled={loadingUpdate}
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
                  disabled={loadingUpdate}
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
                  disabled={loadingUpdate}
                />
              </Box>
              <Box>
                <TextField
                  {...register('hours')}
                  label="Horario de atención"
                  fullWidth
                  error={!!errors.hours}
                  helperText={errors.hours?.message}
                  disabled={loadingUpdate}
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
                disabled={loadingUpdate}
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
              <Button variant="outlined" component={Link} href={ADMIN_ROUTES.ADMIN_CONTACTO} disabled={loadingUpdate}>
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

export default EditarContactoPage;
