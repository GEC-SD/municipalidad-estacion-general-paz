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
import { createPublicWorkAsync, clearPublicWorksStatus } from '@/state/redux/publicWorks';
import { ADMIN_ROUTES, STORAGE_BUCKETS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@/constants';
import { PublicWorkFormData } from '@/types';
import FileUpload from '../../components/FileUpload';

const schema = yup.object({
  title: yup.string().required('El título es requerido'),
  description: yup.string().required('La descripción es requerida'),
  image_url: yup.string().optional(),
  latitude: yup.number().nullable().transform((value) => (isNaN(value) ? undefined : value)).optional(),
  longitude: yup.number().nullable().transform((value) => (isNaN(value) ? undefined : value)).optional(),
  address: yup.string().optional(),
  is_active: yup.boolean().required(),
  order_position: yup.number().integer().min(0).optional(),
}) as yup.ObjectSchema<PublicWorkFormData>;

const NuevaObraPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.publicWorks);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PublicWorkFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      image_url: '',
      address: '',
      is_active: true,
      order_position: 0,
    },
  });

  // useEffect(() => {
  //   if (status.createPublicWorkAsync?.response === 'fulfilled') {
  //     router.push(ADMIN_ROUTES.ADMIN_OBRAS);
  //   }
  // }, [status.createPublicWorkAsync?.response, router]);

  // useEffect(() => {
  //   return () => {
  //     dispatch(clearPublicWorksStatus('createPublicWorkAsync'));
  //   };
  // }, [dispatch]);

  const onSubmit = (data: PublicWorkFormData) => {
    dispatch(createPublicWorkAsync(data));
  };

  const loading = status.createPublicWorkAsync?.loading;
  const error = status.createPublicWorkAsync?.response === 'rejected';
  const errorMessage = status.createPublicWorkAsync?.message;

  return (
    // <Box>
    //   <Breadcrumbs sx={{ mb: 2 }}>
    //     <Link href={ADMIN_ROUTES.ADMIN_DASHBOARD} style={{ textDecoration: 'none', color: 'inherit' }}>
    //       Dashboard
    //     </Link>
    //     <Link href={ADMIN_ROUTES.ADMIN_OBRAS} style={{ textDecoration: 'none', color: 'inherit' }}>
    //       Obras Públicas
    //     </Link>
    //     <Typography color="text.primary">Nueva</Typography>
    //   </Breadcrumbs>

    //   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
    //     <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_OBRAS}>
    //       Volver
    //     </Button>
    //     <Typography variant="h4" sx={{ fontWeight: 700 }}>
    //       Nueva Obra Pública
    //     </Typography>
    //   </Box>

    //   {error && (
    //     <Alert severity="error" sx={{ mb: 3 }}>
    //       {errorMessage || 'Error al crear la obra pública'}
    //     </Alert>
    //   )}

    //   <Paper sx={{ p: 3, borderRadius: 3 }}>
    //     <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
    //       <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
    //         <Box>
    //           <TextField
    //             {...register('title')}
    //             label="Título de la obra"
    //             fullWidth
    //             error={!!errors.title}
    //             helperText={errors.title?.message}
    //             disabled={loading}
    //           />
    //         </Box>

    //         <Box>
    //           <TextField
    //             {...register('description')}
    //             label="Descripción"
    //             fullWidth
    //             multiline
    //             rows={4}
    //             error={!!errors.description}
    //             helperText={errors.description?.message}
    //             disabled={loading}
    //           />
    //         </Box>

    //         <Box>
    //           <Controller
    //             name="image_url"
    //             control={control}
    //             render={({ field }) => (
    //               <FileUpload
    //                 bucket={STORAGE_BUCKETS.PUBLIC_WORKS_IMAGES}
    //                 maxSize={FILE_SIZE_LIMITS.PUBLIC_WORK_IMAGE_MAX_SIZE}
    //                 allowedTypes={[...ALLOWED_FILE_TYPES.IMAGES]}
    //                 accept="image/jpeg,image/png,image/webp"
    //                 label="Imagen de la obra"
    //                 helperText="JPG, PNG o WebP. Máximo 2 MB."
    //                 value={field.value}
    //                 onChange={(url) => field.onChange(url || '')}
    //                 disabled={loading}
    //                 variant="image"
    //               />
    //             )}
    //           />
    //         </Box>

    //         {/* Ubicación */}
    //         <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
    //           Ubicación
    //         </Typography>
    //         <Box>
    //           <TextField
    //             {...register('address')}
    //             label="Dirección / Ubicación"
    //             fullWidth
    //             placeholder="Ej: Av. San Martín y Belgrano"
    //             disabled={loading}
    //           />
    //         </Box>
    //         <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
    //           <Box>
    //             <TextField
    //               {...register('latitude')}
    //               label="Latitud"
    //               fullWidth
    //               type="number"
    //               inputProps={{ step: 'any' }}
    //               placeholder="-32.003"
    //               disabled={loading}
    //             />
    //           </Box>
    //           <Box>
    //             <TextField
    //               {...register('longitude')}
    //               label="Longitud"
    //               fullWidth
    //               type="number"
    //               inputProps={{ step: 'any' }}
    //               placeholder="-62.112"
    //               disabled={loading}
    //             />
    //           </Box>
    //           <Box>
    //             <TextField
    //               {...register('order_position')}
    //               label="Orden de aparición"
    //               fullWidth
    //               type="number"
    //               error={!!errors.order_position}
    //               helperText={errors.order_position?.message}
    //               disabled={loading}
    //             />
    //           </Box>
    //         </Box>

    //         <Box>
    //           <Controller
    //             name="is_active"
    //             control={control}
    //             render={({ field }) => (
    //               <FormControlLabel
    //                 control={
    //                   <Switch
    //                     checked={field.value}
    //                     onChange={field.onChange}
    //                     disabled={loading}
    //                   />
    //                 }
    //                 label="Activo (visible en el sitio público)"
    //               />
    //             )}
    //           />
    //         </Box>

    //         <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
    //           <Button variant="outlined" component={Link} href={ADMIN_ROUTES.ADMIN_OBRAS} disabled={loading}>
    //             Cancelar
    //           </Button>
    //           <Button
    //             type="submit"
    //             variant="contained"
    //             startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
    //             disabled={loading}
    //           >
    //             {loading ? 'Guardando...' : 'Guardar Obra'}
    //           </Button>
    //         </Box>
    //       </Box>
    //     </Box>
    //   </Paper>
    // </Box>
    <></>
  );
};

export default NuevaObraPage;
