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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import slugify from 'slugify';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import { createEventAsync, clearEventsStatus } from '@/state/redux/events';
import { ADMIN_ROUTES, EVENT_CATEGORIES, STORAGE_BUCKETS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@/constants';
import { EventFormData } from '@/types';
import FileUpload from '../../components/FileUpload';

const schema = yup.object({
  title: yup.string().required('El título es requerido'),
  slug: yup.string().required('El slug es requerido'),
  description: yup.string().required('La descripción es requerida'),
  event_date: yup.string().required('La fecha es requerida'),
  event_time: yup.string().optional(),
  end_date: yup.string().optional(),
  location: yup.string().optional(),
  category: yup.string().required('La categoría es requerida'),
  image_url: yup.string().optional(),
  is_featured: yup.boolean().required(),
  is_active: yup.boolean().required(),
  organizer: yup.string().optional(),
  contact_info: yup.string().optional(),
}) as yup.ObjectSchema<EventFormData>;

const NuevoEventoPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.events);

  const [autoSlug, setAutoSlug] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      event_date: '',
      event_time: '',
      end_date: '',
      location: '',
      category: 'cultural',
      image_url: '',
      is_featured: false,
      is_active: true,
      organizer: '',
      contact_info: '',
    },
  });

  const title = watch('title');

  useEffect(() => {
    if (autoSlug && title) {
      const generatedSlug = slugify(title, { lower: true, strict: true });
      setValue('slug', generatedSlug);
    }
  }, [title, autoSlug, setValue]);

  useEffect(() => {
    if (status.createEventAsync?.response === 'fulfilled') {
      router.push(ADMIN_ROUTES.ADMIN_EVENTOS);
    }
  }, [status.createEventAsync?.response, router]);

  useEffect(() => {
    return () => {
      dispatch(clearEventsStatus('createEventAsync'));
    };
  }, [dispatch]);

  const onSubmit = (data: EventFormData) => {
    dispatch(createEventAsync(data));
  };

  const loading = status.createEventAsync?.loading;
  const error = status.createEventAsync?.response === 'rejected';
  const errorMessage = status.createEventAsync?.message;

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={ADMIN_ROUTES.ADMIN_DASHBOARD} style={{ textDecoration: 'none', color: 'inherit' }}>
          Dashboard
        </Link>
        <Link href={ADMIN_ROUTES.ADMIN_EVENTOS} style={{ textDecoration: 'none', color: 'inherit' }}>
          Eventos
        </Link>
        <Typography color="text.primary">Nuevo</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_EVENTOS}>
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Nuevo Evento
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage || 'Error al crear el evento'}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            <Box>
              <TextField
                {...register('title')}
                label="Título del evento"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
                disabled={loading}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
              <Box>
                <TextField
                  {...register('slug')}
                  label="Slug (URL)"
                  fullWidth
                  error={!!errors.slug}
                  helperText={errors.slug?.message}
                  disabled={loading}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setValue('slug', e.target.value);
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoSlug}
                      onChange={(e) => setAutoSlug(e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label="Slug automático"
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

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              <Box>
                <TextField
                  {...register('event_date')}
                  label="Fecha del evento"
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.event_date}
                  helperText={errors.event_date?.message}
                  disabled={loading}
                />
              </Box>
              <Box>
                <TextField
                  {...register('event_time')}
                  label="Hora"
                  fullWidth
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.event_time}
                  helperText={errors.event_time?.message}
                  disabled={loading}
                />
              </Box>
              <Box>
                <TextField
                  {...register('end_date')}
                  label="Fecha de finalización (opcional)"
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.end_date}
                  helperText={errors.end_date?.message}
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
                      {EVENT_CATEGORIES.map((cat) => (
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
                  {...register('location')}
                  label="Lugar"
                  fullWidth
                  error={!!errors.location}
                  helperText={errors.location?.message}
                  disabled={loading}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              <Box>
                <TextField
                  {...register('organizer')}
                  label="Organizador"
                  fullWidth
                  error={!!errors.organizer}
                  helperText={errors.organizer?.message}
                  disabled={loading}
                />
              </Box>
              <Box>
                <TextField
                  {...register('contact_info')}
                  label="Información de contacto"
                  fullWidth
                  error={!!errors.contact_info}
                  helperText={errors.contact_info?.message || 'Teléfono o email de contacto'}
                  disabled={loading}
                />
              </Box>
            </Box>

            <Box>
              <Controller
                name="image_url"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    bucket={STORAGE_BUCKETS.NEWS_IMAGES}
                    maxSize={FILE_SIZE_LIMITS.NEWS_IMAGE_MAX_SIZE}
                    allowedTypes={[...ALLOWED_FILE_TYPES.IMAGES]}
                    accept="image/jpeg,image/png,image/webp"
                    label="Imagen del evento"
                    helperText="JPG, PNG o WebP. Máximo 2 MB."
                    value={field.value}
                    onChange={(url) => field.onChange(url || '')}
                    disabled={loading}
                    variant="image"
                  />
                )}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 3 }}>
              <Controller
                name="is_featured"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={field.onChange} disabled={loading} />}
                    label="Destacar en página principal"
                  />
                )}
              />
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={field.onChange} disabled={loading} />}
                    label="Activo"
                  />
                )}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" component={Link} href={ADMIN_ROUTES.ADMIN_EVENTOS} disabled={loading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Evento'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default NuevoEventoPage;
