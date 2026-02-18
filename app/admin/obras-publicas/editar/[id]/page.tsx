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
  getPublicWorkByIdAsync,
  updatePublicWorkAsync,
  clearPublicWorksStatus,
  clearCurrentPublicWork,
} from '@/state/redux/publicWorks';
import { ADMIN_ROUTES, STORAGE_BUCKETS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@/constants';
import { PublicWorkFormData } from '@/types';
import FileUpload from '../../../components/FileUpload';

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

const EditarObraPage = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { currentPublicWork, status } = useAppSelector((state) => state.publicWorks);

  const id = params.id as string;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PublicWorkFormData>({
    resolver: yupResolver(schema),
  });

  // useEffect(() => {
  //   if (id) {
  //     dispatch(getPublicWorkByIdAsync(id));
  //   }
  //   return () => {
  //     dispatch(clearCurrentPublicWork());
  //     dispatch(clearPublicWorksStatus());
  //   };
  // }, [dispatch, id]);

  // useEffect(() => {
  //   if (currentPublicWork) {
  //     reset({
  //       title: currentPublicWork.title,
  //       description: currentPublicWork.description,
  //       image_url: currentPublicWork.image_url || '',
  //       latitude: currentPublicWork.latitude,
  //       longitude: currentPublicWork.longitude,
  //       address: currentPublicWork.address || '',
  //       is_active: currentPublicWork.is_active,
  //       order_position: currentPublicWork.order_position || 0,
  //     });
  //   }
  // }, [currentPublicWork, reset]);

  // useEffect(() => {
  //   if (status.updatePublicWorkAsync?.response === 'fulfilled') {
  //     router.push(ADMIN_ROUTES.ADMIN_OBRAS);
  //   }
  // }, [status.updatePublicWorkAsync?.response, router]);

  const onSubmit = (data: PublicWorkFormData) => {
    dispatch(updatePublicWorkAsync({ id, data }));
  };

  const loadingGet = status.getPublicWorkByIdAsync?.loading;
  const loadingUpdate = status.updatePublicWorkAsync?.loading;
  const error = status.updatePublicWorkAsync?.response === 'rejected';
  const errorMessage = status.updatePublicWorkAsync?.message;

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

  if (!currentPublicWork && !loadingGet) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          No se encontró la obra pública
        </Alert>
        <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_OBRAS}>
          Volver a Obras Públicas
        </Button>
      </Box>
    );
  }

  return (
    // <Box>
    //   <Breadcrumbs sx={{ mb: 2 }}>
    //     <Link href={ADMIN_ROUTES.ADMIN_DASHBOARD} style={{ textDecoration: 'none', color: 'inherit' }}>
    //       Dashboard
    //     </Link>
    //     <Link href={ADMIN_ROUTES.ADMIN_OBRAS} style={{ textDecoration: 'none', color: 'inherit' }}>
    //       Obras Públicas
    //     </Link>
    //     <Typography color="text.primary">Editar</Typography>
    //   </Breadcrumbs>

    //   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
    //     <Button startIcon={<ArrowBackIcon />} component={Link} href={ADMIN_ROUTES.ADMIN_OBRAS}>
    //       Volver
    //     </Button>
    //     <Typography variant="h4" sx={{ fontWeight: 700 }}>
    //       Editar Obra Pública
    //     </Typography>
    //   </Box>

    //   {error && (
    //     <Alert severity="error" sx={{ mb: 3 }}>
    //       {errorMessage || 'Error al actualizar la obra pública'}
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
    //             disabled={loadingUpdate}
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
    //             disabled={loadingUpdate}
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
    //                 disabled={loadingUpdate}
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
    //             disabled={loadingUpdate}
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
    //               disabled={loadingUpdate}
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
    //               disabled={loadingUpdate}
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
    //               disabled={loadingUpdate}
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
    //                     checked={field.value || false}
    //                     onChange={field.onChange}
    //                     disabled={loadingUpdate}
    //                   />
    //                 }
    //                 label="Activo (visible en el sitio público)"
    //               />
    //             )}
    //           />
    //         </Box>

    //         <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
    //           <Button variant="outlined" component={Link} href={ADMIN_ROUTES.ADMIN_OBRAS} disabled={loadingUpdate}>
    //             Cancelar
    //           </Button>
    //           <Button
    //             type="submit"
    //             variant="contained"
    //             startIcon={loadingUpdate ? <CircularProgress size={20} /> : <SaveIcon />}
    //             disabled={loadingUpdate}
    //           >
    //             {loadingUpdate ? 'Guardando...' : 'Guardar Cambios'}
    //           </Button>
    //         </Box>
    //       </Box>
    //     </Box>
    //   </Paper>
    // </Box>
    <></>
  );
};

export default EditarObraPage;
