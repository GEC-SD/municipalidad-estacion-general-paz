'use client';

import { useState, useEffect } from 'react';
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
  IconButton,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import { createServiceAsync, clearServicesStatus } from '@/state/redux/services';
import { ADMIN_ROUTES, SERVICE_CATEGORIES, STORAGE_BUCKETS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@/constants';
import { ServiceFormData } from '@/types';
import FileUpload from '../../components/FileUpload';

const schema = yup.object({
  title: yup.string().required('El título es requerido'),
  description: yup.string().required('La descripción es requerida'),
  category: yup.string<'salud' | 'cultura' | 'obras' | 'educacion' | 'registro'>().required('La categoría es requerida'),
  icon: yup.string().optional(),
  image_url: yup.string().optional(),
  is_active: yup.boolean().required(),
  order_position: yup.number().integer().min(0).optional(),
}) as yup.ObjectSchema<ServiceFormData>;

const NuevaAreaPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.services);

  const [requirement, setRequirement] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactHours, setContactHours] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      category: 'salud',
      icon: '',
      image_url: '',
      is_active: true,
      order_position: 0,
    },
  });

  useEffect(() => {
    if (status.createServiceAsync?.response === 'fulfilled') {
      router.push(ADMIN_ROUTES.ADMIN_SERVICIOS);
    }
  }, [status.createServiceAsync?.response, router]);

  useEffect(() => {
    return () => {
      dispatch(clearServicesStatus('createServiceAsync'));
    };
  }, [dispatch]);

  const handleAddRequirement = () => {
    if (requirement.trim()) {
      setRequirements([...requirements, requirement.trim()]);
      setRequirement('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ServiceFormData) => {
    const serviceData: ServiceFormData = {
      ...data,
      requirements,
      contact_info: {
        email: contactEmail || undefined,
        phone: contactPhone || undefined,
        address: contactAddress || undefined,
        hours: contactHours || undefined,
      },
    };
    dispatch(createServiceAsync(serviceData));
  };

  const loading = status.createServiceAsync?.loading;
  const error = status.createServiceAsync?.response === 'rejected';
  const errorMessage = status.createServiceAsync?.message;

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={ADMIN_ROUTES.ADMIN_DASHBOARD} style={{ textDecoration: 'none', color: 'inherit' }}>
          Dashboard
        </Link>
        <Link href={ADMIN_ROUTES.ADMIN_SERVICIOS} style={{ textDecoration: 'none', color: 'inherit' }}>
          Areas
        </Link>
        <Typography color="text.primary">Nueva</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_SERVICIOS}>
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Nueva Area
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage || 'Error al crear el area'}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            <Box>
              <TextField
                {...register('title')}
                label="Título del area"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
                disabled={loading}
              />
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
                      {SERVICE_CATEGORIES.map((cat) => (
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
                  {...register('order_position')}
                  label="Orden de aparición"
                  fullWidth
                  type="number"
                  error={!!errors.order_position}
                  helperText={errors.order_position?.message}
                  disabled={loading}
                />
              </Box>
            </Box>

            <Box>
              <TextField
                {...register('description')}
                label="Descripción"
                fullWidth
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
                disabled={loading}
              />
            </Box>

            <Box>
              <Controller
                name="image_url"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    bucket={STORAGE_BUCKETS.SERVICE_IMAGES}
                    maxSize={FILE_SIZE_LIMITS.SERVICE_IMAGE_MAX_SIZE}
                    allowedTypes={[...ALLOWED_FILE_TYPES.IMAGES]}
                    accept="image/jpeg,image/png,image/webp"
                    label="Imagen del area"
                    helperText="JPG, PNG o WebP. Máximo 2 MB."
                    value={field.value}
                    onChange={(url) => field.onChange(url || '')}
                    disabled={loading}
                    variant="image"
                  />
                )}
              />
            </Box>

            {/* Contact Info */}
            <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
              Información de contacto
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              <Box>
                <TextField
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  label="Email"
                  fullWidth
                  type="email"
                  disabled={loading}
                />
              </Box>
              <Box>
                <TextField
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  label="Teléfono"
                  fullWidth
                  disabled={loading}
                />
              </Box>
              <Box>
                <TextField
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  label="Dirección"
                  fullWidth
                  disabled={loading}
                />
              </Box>
              <Box>
                <TextField
                  value={contactHours}
                  onChange={(e) => setContactHours(e.target.value)}
                  label="Horario de atención"
                  fullWidth
                  disabled={loading}
                />
              </Box>
            </Box>

            {/* Requirements */}
            <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
              Requisitos
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                label="Agregar requisito"
                fullWidth
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRequirement();
                  }
                }}
              />
              <IconButton onClick={handleAddRequirement} disabled={loading || !requirement.trim()} color="primary">
                <AddIcon />
              </IconButton>
            </Box>
            {requirements.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {requirements.map((req, index) => (
                  <Chip
                    key={index}
                    label={req}
                    onDelete={() => handleRemoveRequirement(index)}
                    disabled={loading}
                  />
                ))}
              </Box>
            )}

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
              <Button variant="outlined" component={Link} href={ADMIN_ROUTES.ADMIN_SERVICIOS} disabled={loading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Area'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default NuevaAreaPage;
