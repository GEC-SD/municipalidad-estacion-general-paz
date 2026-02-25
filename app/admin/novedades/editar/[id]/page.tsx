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
  getNewsByIdAsync,
  updateNewsAsync,
  clearNewsStatus,
  clearCurrentNews,
} from '@/state/redux/news';
import { ADMIN_ROUTES, NEWS_CATEGORIES, NEWS_STATUS, STORAGE_BUCKETS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@/constants';
import { NewsFormData } from '@/types';
import RichTextEditor from '../../../components/RichTextEditor';
import MultiImageUpload from '../../../components/MultiImageUpload';

const schema = yup.object({
  title: yup.string().required('El título es requerido'),
  slug: yup.string().required('El slug es requerido'),
  content: yup.string().required('El contenido es requerido'),
  excerpt: yup.string(),
  category: yup.string(),
  status: yup.string().required('El estado es requerido'),
  featured_image_url: yup.string().optional(),
  image_urls: yup.array().of(yup.string().required()).optional(),
  social_url: yup.string().optional(),
  is_featured: yup.boolean().required(),
}) as yup.ObjectSchema<NewsFormData>;

const EditarNovedadPage = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { currentNews, status } = useAppSelector((state) => state.news);

  const id = params.id as string;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<NewsFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: '' as any,
      status: 'draft',
      featured_image_url: '',
      image_urls: [],
      social_url: '',
      is_featured: false,
    },
  });

  // Load news data
  useEffect(() => {
    if (id) {
      dispatch(getNewsByIdAsync(id));
    }

    return () => {
      dispatch(clearCurrentNews());
      dispatch(clearNewsStatus());
    };
  }, [dispatch, id]);

  // Populate form when news is loaded
  useEffect(() => {
    if (currentNews) {
      // Build image_urls from existing data
      const imageUrls = currentNews.image_urls && currentNews.image_urls.length > 0
        ? currentNews.image_urls
        : currentNews.featured_image_url
          ? [currentNews.featured_image_url]
          : [];

      reset({
        title: currentNews.title,
        slug: currentNews.slug,
        content: currentNews.content,
        excerpt: currentNews.excerpt || '',
        category: currentNews.category,
        status: currentNews.status,
        featured_image_url: currentNews.featured_image_url || '',
        image_urls: imageUrls,
        social_url: currentNews.social_url || '',
        is_featured: currentNews.is_featured || false,
      });
    }
  }, [currentNews, reset]);

  // Handle success
  useEffect(() => {
    if (status.updateNewsAsync?.response === 'fulfilled') {
      router.push(ADMIN_ROUTES.ADMIN_NOVEDADES);
    }
  }, [status.updateNewsAsync?.response, router]);

  const onSubmit = (data: NewsFormData) => {
    // Sync featured_image_url with first image for retrocompatibility
    const submitData = {
      ...data,
      featured_image_url: data.image_urls?.[0] || '',
    };
    dispatch(updateNewsAsync({ id, data: submitData }));
  };

  const loadingGet = status.getNewsByIdAsync?.loading;
  const loadingUpdate = status.updateNewsAsync?.loading;
  const error = status.updateNewsAsync?.response === 'rejected';
  const errorMessage = status.updateNewsAsync?.message;

  if (loadingGet) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            {Array.from(new Array(6)).map((_, index) => (
              <Box key={index}>
                <Skeleton variant="rectangular" height={56} />
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    );
  }

  if (!currentNews && !loadingGet) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          No se encontró la novedad
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          component={Link}
          href={ADMIN_ROUTES.ADMIN_NOVEDADES}
        >
          Volver a Novedades
        </Button>
      </Box>
    );
  }

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
        <Typography color="text.primary">Editar</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          component={Link}
          href={ADMIN_ROUTES.ADMIN_NOVEDADES}
        >
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Editar Novedad
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage || 'Error al actualizar la novedad'}
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
                disabled={loadingUpdate}
              />
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
                disabled={loadingUpdate}
              />
            </Box>

            {/* Content - Rich Text Editor */}
            <Box>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    disabled={loadingUpdate}
                    label="Contenido"
                    placeholder="Escribí el contenido de la novedad..."
                    error={!!errors.content}
                    helperText={errors.content?.message}
                  />
                )}
              />
            </Box>

            {/* Social URL */}
            <Box>
              <TextField
                {...register('social_url')}
                label="URL de red social (opcional)"
                fullWidth
                placeholder="instagram.com/p/... o facebook.com/..."
                error={!!errors.social_url}
                helperText={errors.social_url?.message || 'Link a la publicación en redes sociales'}
                disabled={loadingUpdate}
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
                      disabled={loadingUpdate}
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
                      disabled={loadingUpdate}
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

            {/* Multiple Images */}
            <Box>
              <Controller
                name="image_urls"
                control={control}
                render={({ field }) => (
                  <MultiImageUpload
                    value={field.value || []}
                    onChange={field.onChange}
                    maxImages={3}
                    bucket={STORAGE_BUCKETS.NEWS_IMAGES}
                    maxSize={FILE_SIZE_LIMITS.NEWS_IMAGE_MAX_SIZE}
                    allowedTypes={[...ALLOWED_FILE_TYPES.IMAGES]}
                    label="Imágenes"
                    helperText="JPG, PNG o WebP. Máximo 2 MB por imagen. La primera será la imagen destacada."
                    disabled={loadingUpdate}
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
                        checked={field.value || false}
                        onChange={field.onChange}
                        disabled={loadingUpdate}
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
                  disabled={loadingUpdate}
                >
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
        </Box>
      </Paper>
    </Box>
  );
};

export default EditarNovedadPage;
