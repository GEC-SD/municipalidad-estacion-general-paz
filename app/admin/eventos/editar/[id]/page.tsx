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
  getEventByIdAsync,
  updateEventAsync,
  clearEventsStatus,
  clearCurrentEvent,
} from '@/state/redux/events';
import { ADMIN_ROUTES, EVENT_CATEGORIES, STORAGE_BUCKETS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@/constants';
import { EventFormData } from '@/types';
import FileUpload from '../../../components/FileUpload';

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

const EditarEventoPage = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { currentEvent, status } = useAppSelector((state) => state.events);

  const id = params.id as string;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (id) {
      dispatch(getEventByIdAsync(id));
    }
    return () => {
      dispatch(clearCurrentEvent());
      dispatch(clearEventsStatus());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentEvent) {
      reset({
        title: currentEvent.title,
        slug: currentEvent.slug,
        description: currentEvent.description,
        event_date: currentEvent.event_date,
        event_time: currentEvent.event_time || '',
        end_date: currentEvent.end_date || '',
        location: currentEvent.location || '',
        category: currentEvent.category,
        image_url: currentEvent.image_url || '',
        is_featured: currentEvent.is_featured,
        is_active: currentEvent.is_active,
        organizer: currentEvent.organizer || '',
        contact_info: currentEvent.contact_info || '',
      });
    }
  }, [currentEvent, reset]);

  useEffect(() => {
    if (status.updateEventAsync?.response === 'fulfilled') {
      router.push(ADMIN_ROUTES.ADMIN_EVENTOS);
    }
  }, [status.updateEventAsync?.response, router]);

  const onSubmit = (data: EventFormData) => {
    dispatch(updateEventAsync({ id, data }));
  };

  const loadingGet = status.getEventByIdAsync?.loading;
  const loadingUpdate = status.updateEventAsync?.loading;
  const error = status.updateEventAsync?.response === 'rejected';
  const errorMessage = status.updateEventAsync?.message;

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

  if (!currentEvent && !loadingGet) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          No se encontró el evento
        </Alert>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_EVENTOS}>
          Volver a Eventos
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
        <Link href={ADMIN_ROUTES.ADMIN_EVENTOS} style={{ textDecoration: 'none', color: 'inherit' }}>
          Eventos
        </Link>
        <Typography color="text.primary">Editar</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_EVENTOS}>
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Editar Evento
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage || 'Error al actualizar el evento'}
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
                disabled={loadingUpdate}
              />
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
                disabled={loadingUpdate}
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
                  disabled={loadingUpdate}
                />
              </Box>
              <Box>
                <TextField
                  {...register('event_time')}
                  label="Hora"
                  fullWidth
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  disabled={loadingUpdate}
                />
              </Box>
              <Box>
                <TextField
                  {...register('end_date')}
                  label="Fecha de finalización"
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
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
                  disabled={loadingUpdate}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              <Box>
                <TextField
                  {...register('organizer')}
                  label="Organizador"
                  fullWidth
                  disabled={loadingUpdate}
                />
              </Box>
              <Box>
                <TextField
                  {...register('contact_info')}
                  label="Link de red social o contacto"
                  fullWidth
                  disabled={loadingUpdate}
                  helperText="URL de publicación en redes sociales (ej: Instagram, Facebook)"
                  placeholder="https://www.instagram.com/p/..."
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
                    disabled={loadingUpdate}
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
                    control={<Switch checked={field.value || false} onChange={field.onChange} disabled={loadingUpdate} />}
                    label="Destacar en página principal"
                  />
                )}
              />
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value || false} onChange={field.onChange} disabled={loadingUpdate} />}
                    label="Activo"
                  />
                )}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" component={Link} href={ADMIN_ROUTES.ADMIN_EVENTOS} disabled={loadingUpdate}>
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

export default EditarEventoPage;
