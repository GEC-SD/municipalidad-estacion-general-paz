'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Breadcrumbs,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Switch,
  Chip,
  Skeleton,
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
import {
  getTramiteByIdAsync,
  updateTramiteAsync,
  clearTramitesStatus,
} from '@/state/redux/tramites';
import { ADMIN_ROUTES, STORAGE_BUCKETS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@/constants';
import { TramiteFormData } from '@/types';
import FileUpload from '../../../components/FileUpload';

const RichTextEditor = dynamic(() => import('../../../components/RichTextEditor'), {
  ssr: false,
  loading: () => <Box sx={{ height: 250, border: '1px solid rgba(0,0,0,0.23)', borderRadius: 2 }} />,
});

const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const schema = yup.object({
  title: yup.string().required('El título es requerido'),
  slug: yup.string().required('El slug es requerido'),
  description: yup.string().required('La descripción es requerida'),
  content_type: yup
    .string()
    .oneOf(['pdf', 'text'] as const)
    .required('El tipo de contenido es requerido'),
  pdf_url: yup.string().when('content_type', {
    is: 'pdf',
    then: (s) => s.required('El PDF es requerido'),
    otherwise: (s) => s.optional(),
  }),
  rich_content: yup.string().when('content_type', {
    is: 'text',
    then: (s) => s.required('El contenido es requerido'),
    otherwise: (s) => s.optional(),
  }),
  requirements: yup.array().of(yup.string().required()).optional(),
  contact_info: yup.object({
    email: yup.string().email('Email inválido').optional(),
    phone: yup.string().optional(),
    address: yup.string().optional(),
    hours: yup.string().optional(),
  }).optional(),
  is_active: yup.boolean().required(),
  order_position: yup.number().optional(),
}) as yup.ObjectSchema<TramiteFormData>;

const EditarTramitePage = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { tramites, status } = useAppSelector((state) => state.tramites);

  const id = params.id as string;
  const currentTramite = tramites.find((t) => t.id === id);

  const [requirementInput, setRequirementInput] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TramiteFormData>({
    resolver: yupResolver(schema),
  });

  const contentType = watch('content_type');
  const requirements = watch('requirements') || [];

  useEffect(() => {
    if (id) {
      dispatch(getTramiteByIdAsync(id));
    }
    return () => {
      dispatch(clearTramitesStatus());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentTramite) {
      reset({
        title: currentTramite.title,
        slug: currentTramite.slug,
        description: currentTramite.description,
        content_type: currentTramite.content_type,
        pdf_url: currentTramite.pdf_url || '',
        rich_content: currentTramite.rich_content || '',
        requirements: currentTramite.requirements || [],
        contact_info: {
          email: currentTramite.contact_info?.email || '',
          phone: currentTramite.contact_info?.phone || '',
          address: currentTramite.contact_info?.address || '',
          hours: currentTramite.contact_info?.hours || '',
        },
        is_active: currentTramite.is_active,
        order_position: currentTramite.order_position || 0,
      });
    }
  }, [currentTramite, reset]);

  useEffect(() => {
    if (status.updateTramiteAsync?.response === 'fulfilled') {
      router.push(ADMIN_ROUTES.ADMIN_TRAMITES);
    }
  }, [status.updateTramiteAsync?.response, router]);

  const onSubmit = (data: TramiteFormData) => {
    const cleanData = { ...data };
    if (cleanData.content_type === 'pdf') {
      delete cleanData.rich_content;
    } else {
      delete cleanData.pdf_url;
    }
    dispatch(updateTramiteAsync({ id, data: cleanData }));
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setValue('requirements', [...requirements, requirementInput.trim()]);
      setRequirementInput('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setValue(
      'requirements',
      requirements.filter((_, i) => i !== index)
    );
  };

  const loadingGet = status.getTramiteByIdAsync?.loading;
  const loadingUpdate = status.updateTramiteAsync?.loading;
  const error = status.updateTramiteAsync?.response === 'rejected';
  const errorMessage = status.updateTramiteAsync?.message;

  if (loadingGet) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            {Array.from(new Array(5)).map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={56} />
            ))}
          </Box>
        </Paper>
      </Box>
    );
  }

  if (!currentTramite && !loadingGet) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          No se encontró el trámite
        </Alert>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_TRAMITES}>
          Volver a Trámites
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
        <Link href={ADMIN_ROUTES.ADMIN_TRAMITES} style={{ textDecoration: 'none', color: 'inherit' }}>
          Trámites
        </Link>
        <Typography color="text.primary">Editar</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_TRAMITES}>
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Editar Trámite
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage || 'Error al actualizar el trámite'}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            <TextField
              {...register('title')}
              label="Título del trámite"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={loadingUpdate}
            />

            <TextField
              {...register('description')}
              label="Descripción breve"
              fullWidth
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={loadingUpdate}
            />

            <Box>
              <FormLabel sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                Tipo de contenido
              </FormLabel>
              <Controller
                name="content_type"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel value="pdf" control={<Radio />} label="Archivo PDF" disabled={loadingUpdate} />
                    <FormControlLabel value="text" control={<Radio />} label="Texto enriquecido" disabled={loadingUpdate} />
                  </RadioGroup>
                )}
              />
            </Box>

            {contentType === 'pdf' ? (
              <Controller
                name="pdf_url"
                control={control}
                render={({ field }) => (
                  <Box>
                    <FileUpload
                      bucket={STORAGE_BUCKETS.TRAMITES_PDFS}
                      maxSize={FILE_SIZE_LIMITS.TRAMITE_PDF_MAX_SIZE}
                      allowedTypes={[...ALLOWED_FILE_TYPES.PDFS]}
                      accept="application/pdf"
                      label="Archivo PDF del trámite"
                      helperText="Solo archivos PDF."
                      value={field.value || ''}
                      onChange={(url) => field.onChange(url || '')}
                      disabled={loadingUpdate}
                      variant="file"
                    />
                    {errors.pdf_url && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors.pdf_url.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            ) : (
              <Controller
                name="rich_content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value || ''}
                    onChange={field.onChange}
                    disabled={loadingUpdate}
                    label="Contenido del trámite"
                    placeholder="Escribí el contenido del trámite..."
                    error={!!errors.rich_content}
                    helperText={errors.rich_content?.message}
                  />
                )}
              />
            )}

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Requisitos
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  label="Agregar requisito"
                  size="small"
                  fullWidth
                  disabled={loadingUpdate}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRequirement();
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddRequirement}
                  disabled={loadingUpdate || !requirementInput.trim()}
                  startIcon={<AddIcon />}
                >
                  Agregar
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {requirements.map((req, index) => (
                  <Chip
                    key={index}
                    label={req}
                    onDelete={() => handleRemoveRequirement(index)}
                    disabled={loadingUpdate}
                  />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
                Información de contacto
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                <TextField
                  {...register('contact_info.email')}
                  label="Email"
                  fullWidth
                  size="small"
                  error={!!errors.contact_info?.email}
                  helperText={errors.contact_info?.email?.message}
                  disabled={loadingUpdate}
                />
                <TextField
                  {...register('contact_info.phone')}
                  label="Teléfono"
                  fullWidth
                  size="small"
                  disabled={loadingUpdate}
                />
                <TextField
                  {...register('contact_info.address')}
                  label="Dirección"
                  fullWidth
                  size="small"
                  disabled={loadingUpdate}
                />
                <TextField
                  {...register('contact_info.hours')}
                  label="Horario de atención"
                  fullWidth
                  size="small"
                  disabled={loadingUpdate}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={field.onChange} disabled={loadingUpdate} />}
                    label="Activo"
                  />
                )}
              />
              <TextField
                {...register('order_position')}
                label="Orden"
                type="number"
                size="small"
                sx={{ width: 120 }}
                disabled={loadingUpdate}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" component={Link} href={ADMIN_ROUTES.ADMIN_TRAMITES} disabled={loadingUpdate}>
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

export default EditarTramitePage;
