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
import { createNewsAsync, clearNewsStatus } from '@/state/redux/news';
import { ADMIN_ROUTES, NEWS_CATEGORIES, NEWS_STATUS, STORAGE_BUCKETS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@/constants';
import { NewsFormData } from '@/types';
import FileUpload from '../../components/FileUpload';

const schema = yup.object({
  title: yup.string().required('El título es requerido'),
  slug: yup.string().required('El slug es requerido'),
  content: yup.string().required('El contenido es requerido'),
  excerpt: yup.string(),
  category: yup.string(),
  status: yup.string().required('El estado es requerido'),
  featured_image_url: yup.string().url('Debe ser una URL válida').optional(),
  is_featured: yup.boolean().required(),
}) as yup.ObjectSchema<NewsFormData>;

const NuevaNovedadPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.news);

  const [autoSlug, setAutoSlug] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewsFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: undefined,
      status: 'draft',
      featured_image_url: '',
      is_featured: false,
    },
  });

  const title = watch('title');

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug && title) {
      const generatedSlug = slugify(title, { lower: true, strict: true });
      setValue('slug', generatedSlug);
    }
  }, [title, autoSlug, setValue]);

  // Handle success
  useEffect(() => {
    if (status.createNewsAsync?.response === 'fulfilled') {
      router.push(ADMIN_ROUTES.ADMIN_NOVEDADES);
    }
  }, [status.createNewsAsync?.response, router]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearNewsStatus('createNewsAsync'));
    };
  }, [dispatch]);

  const onSubmit = (data: NewsFormData) => {
    dispatch(createNewsAsync(data));
  };

  const loading = status.createNewsAsync?.loading;
  const error = status.createNewsAsync?.response === 'rejected';
  const errorMessage = status.createNewsAsync?.message;

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={ADMIN_ROUTES.ADMIN_DASHBOARD} style={{ textDecoration: 'none', color: 'inherit' }}>
          Dashboard
        </Link>
        <Link href={ADMIN_ROUTES.ADMIN_NOVEDADES} style={{ textDecoration: 'none', color: 'inherit' }}>
          Novedades
        </Link>
        <Typography color="text.primary">Nueva</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            component={Link}
            href={ADMIN_ROUTES.ADMIN_NOVEDADES}
          >
            Volver
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Nueva Novedad
          </Typography>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage || 'Error al crear la novedad'}
        </Alert>
      )}

      {/* Form */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            {/* Title */}
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

            {/* Slug and Auto Slug Toggle */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
              <Box>
                <TextField
                  {...register('slug')}
                  label="Slug (URL)"
                  fullWidth
                  error={!!errors.slug}
                  helperText={errors.slug?.message || 'URL amigable para la novedad'}
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
                  label="Generar slug automáticamente"
                />
              </Box>
            </Box>

            {/* Excerpt */}
            <Box>
              <TextField
                {...register('excerpt')}
                label="Resumen"
                fullWidth
                multiline
                rows={2}
                error={!!errors.excerpt}
                helperText={errors.excerpt?.message || 'Breve descripción para las tarjetas'}
                disabled={loading}
              />
            </Box>

            {/* Content */}
            <Box>
              <TextField
                {...register('content')}
                label="Contenido"
                fullWidth
                multiline
                rows={10}
                error={!!errors.content}
                helperText={errors.content?.message || 'Contenido completo de la novedad (HTML permitido)'}
                disabled={loading}
              />
            </Box>

            {/* Category and Status */}
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
                      <MenuItem value="">Sin categoría</MenuItem>
                      {NEWS_CATEGORIES.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>

              <Box>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Estado"
                      fullWidth
                      error={!!errors.status}
                      helperText={errors.status?.message}
                      disabled={loading}
                    >
                      {NEWS_STATUS.map((s) => (
                        <MenuItem key={s.value} value={s.value}>
                          {s.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>
            </Box>

            {/* Featured Image */}
            <Box>
              <Controller
                name="featured_image_url"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    bucket={STORAGE_BUCKETS.NEWS_IMAGES}
                    maxSize={FILE_SIZE_LIMITS.NEWS_IMAGE_MAX_SIZE}
                    allowedTypes={[...ALLOWED_FILE_TYPES.IMAGES]}
                    accept="image/jpeg,image/png,image/webp"
                    label="Imagen destacada"
                    helperText="JPG, PNG o WebP. Máximo 2 MB."
                    value={field.value}
                    onChange={(url) => field.onChange(url || '')}
                    disabled={loading}
                    variant="image"
                  />
                )}
              />
            </Box>

            {/* Is Featured */}
            <Box>
              <Controller
                name="is_featured"
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
                    label="Destacar en página principal"
                  />
                )}
              />
            </Box>

            {/* Submit Button */}
            <Box>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  component={Link}
                  href={ADMIN_ROUTES.ADMIN_NOVEDADES}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Novedad'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default NuevaNovedadPage;
