'use client';

import { useState, useEffect } from 'react';
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
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import {
  getNewsByIdAsync,
  updateNewsAsync,
  createNewsAttachmentAsync,
  deleteNewsAttachmentAsync,
  clearNewsStatus,
  clearCurrentNews,
} from '@/state/redux/news';
import { ADMIN_ROUTES, NEWS_CATEGORIES, NEWS_STATUS, STORAGE_BUCKETS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@/constants';
import { NewsFormData } from '@/types';
import FileUpload from '../../../components/FileUpload';

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
      reset({
        title: currentNews.title,
        slug: currentNews.slug,
        content: currentNews.content,
        excerpt: currentNews.excerpt || '',
        category: currentNews.category,
        status: currentNews.status,
        featured_image_url: currentNews.featured_image_url || '',
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
    dispatch(updateNewsAsync({ id, data }));
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

            {/* Slug */}
            <Box>
              <TextField
                {...register('slug')}
                label="Slug (URL)"
                fullWidth
                error={!!errors.slug}
                helperText={errors.slug?.message || 'URL amigable para la novedad'}
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
                    disabled={loadingUpdate}
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

            {/* Attachments Section */}
            {currentNews && (
              <Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Archivos Adjuntos
                </Typography>

                {currentNews.attachments && currentNews.attachments.length > 0 && (
                  <List sx={{ mb: 2 }}>
                    {currentNews.attachments.map((attachment) => (
                      <ListItem
                        key={attachment.id}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 1,
                        }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => dispatch(deleteNewsAttachmentAsync(attachment.id))}
                            disabled={status.deleteNewsAttachmentAsync?.loading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          <AttachFileIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={attachment.file_name}
                          secondary={
                            attachment.file_size
                              ? `${(attachment.file_size / 1024 / 1024).toFixed(2)} MB`
                              : undefined
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}

                <FileUpload
                  bucket={STORAGE_BUCKETS.NEWS_ATTACHMENTS}
                  maxSize={FILE_SIZE_LIMITS.ATTACHMENT_MAX_SIZE}
                  allowedTypes={[...ALLOWED_FILE_TYPES.IMAGES, ...ALLOWED_FILE_TYPES.DOCUMENTS]}
                  accept="image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  label="Agregar adjunto"
                  helperText="Imágenes, PDF o documentos Word. Máximo 10 MB."
                  variant="file"
                  disabled={loadingUpdate}
                  onChange={(url) => {
                    if (url) {
                      const fileName = url.split('/').pop() || 'adjunto';
                      dispatch(
                        createNewsAttachmentAsync({
                          newsId: id,
                          attachmentData: {
                            file_name: fileName,
                            file_url: url,
                          },
                        })
                      );
                    }
                  }}
                />
              </Box>
            )}

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
