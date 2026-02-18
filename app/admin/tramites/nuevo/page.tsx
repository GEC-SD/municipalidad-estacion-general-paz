'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { createTramiteAsync, clearTramitesStatus } from '@/state/redux/tramites';
import { ADMIN_ROUTES, STORAGE_BUCKETS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@/constants';
import { TramiteFormData } from '@/types';
import FileUpload from '../../components/FileUpload';

import 'react-quill-new/dist/quill.snow.css';

const RichTextEditor = dynamic(() => import('../../components/RichTextEditor'), {
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

const NuevoTramitePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.tramites);

  const [requirementInput, setRequirementInput] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TramiteFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      content_type: 'pdf',
      pdf_url: '',
      rich_content: '',
      requirements: [],
      contact_info: { email: '', phone: '', address: '', hours: '' },
      is_active: true,
      order_position: 0,
    },
  });

  const title = watch('title');
  const contentType = watch('content_type');
  const requirements = watch('requirements') || [];

  useEffect(() => {
    if (title) {
      setValue('slug', slugify(title));
    }
  }, [title, setValue]);

  useEffect(() => {
    if (status.createTramiteAsync?.response === 'fulfilled') {
      router.push(ADMIN_ROUTES.ADMIN_TRAMITES);
    }
  }, [status.createTramiteAsync?.response, router]);

  useEffect(() => {
    return () => {
      dispatch(clearTramitesStatus('createTramiteAsync'));
    };
  }, [dispatch]);

  const onSubmit = (data: TramiteFormData) => {
    const cleanData = { ...data };
    if (cleanData.content_type === 'pdf') {
      delete cleanData.rich_content;
    } else {
      delete cleanData.pdf_url;
    }
    dispatch(createTramiteAsync(cleanData));
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

  const loading = status.createTramiteAsync?.loading;
  const error = status.createTramiteAsync?.response === 'rejected';
  const errorMessage = status.createTramiteAsync?.message;

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={ADMIN_ROUTES.ADMIN_DASHBOARD} style={{ textDecoration: 'none', color: 'inherit' }}>
          Dashboard
        </Link>
        <Link href={ADMIN_ROUTES.ADMIN_TRAMITES} style={{ textDecoration: 'none', color: 'inherit' }}>
          Trámites
        </Link>
        <Typography color="text.primary">Nuevo</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_TRAMITES}>
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Nuevo Trámite
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage || 'Error al crear el trámite'}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            {/* Título */}
            <TextField
              {...register('title')}
              label="Título del trámite"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={loading}
            />

            {/* Descripción */}
            <TextField
              {...register('description')}
              label="Descripción breve"
              fullWidth
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={loading}
            />

            {/* Tipo de contenido */}
            <Box>
              <FormLabel sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                Tipo de contenido
              </FormLabel>
              <Controller
                name="content_type"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel value="pdf" control={<Radio />} label="Archivo PDF" disabled={loading} />
                    <FormControlLabel value="text" control={<Radio />} label="Texto enriquecido" disabled={loading} />
                  </RadioGroup>
                )}
              />
            </Box>

            {/* Contenido condicional */}
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
                      helperText="Solo PDF. Máximo 5 MB."
                      value={field.value || ''}
                      onChange={(url) => field.onChange(url || '')}
                      disabled={loading}
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
                    disabled={loading}
                    label="Contenido del trámite"
                    placeholder="Escribí el contenido del trámite..."
                    error={!!errors.rich_content}
                    helperText={errors.rich_content?.message}
                  />
                )}
              />
            )}

            {/* Requisitos */}
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
                  disabled={loading}
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
                  disabled={loading || !requirementInput.trim()}
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
                    disabled={loading}
                  />
                ))}
              </Box>
            </Box>

            {/* Info de contacto */}
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
                  disabled={loading}
                />
                <TextField
                  {...register('contact_info.phone')}
                  label="Teléfono"
                  fullWidth
                  size="small"
                  disabled={loading}
                />
                <TextField
                  {...register('contact_info.address')}
                  label="Dirección"
                  fullWidth
                  size="small"
                  disabled={loading}
                />
                <TextField
                  {...register('contact_info.hours')}
                  label="Horario de atención"
                  fullWidth
                  size="small"
                  disabled={loading}
                />
              </Box>
            </Box>

            {/* Estado y orden */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
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
              <TextField
                {...register('order_position')}
                label="Orden"
                type="number"
                size="small"
                sx={{ width: 120 }}
                disabled={loading}
              />
            </Box>

            {/* Acciones */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" component={Link} href={ADMIN_ROUTES.ADMIN_TRAMITES} disabled={loading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default NuevoTramitePage;
