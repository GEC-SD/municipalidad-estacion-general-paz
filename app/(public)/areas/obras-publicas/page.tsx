'use client';

import dynamic from 'next/dynamic';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Alert,
  Chip,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  Construction as ConstructionIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@/state/redux/store';
import { getPublicWorksAsync } from '@/state/redux/publicWorks';
import { useCachedFetch } from '@/hooks';
import { CACHE_TTL } from '@/constants/cache';
import { SAMPLE_OBRAS } from '@/constants/sampleObras';
import PageHero from '../../components/PageHero';
import AnimatedSection from '../../components/AnimatedSection';
import SectionTitle from '../../components/SectionTitle';

// Leaflet no soporta SSR - importar dinámicamente
const MapObras = dynamic(() => import('./MapObras'), {
  ssr: false,
  loading: () => (
    <Skeleton
      variant="rectangular"
      sx={{ width: '100%', height: '100%', borderRadius: 3 }}
    />
  ),
});

const MUNICIPALITY_CENTER: [number, number] = [-32.003, -62.112];

const ObrasPublicasPage = () => {
  const { publicWorks = [], status } = useAppSelector(
    (state) => state.publicWorks
  );

  // useCachedFetch({
  //   selector: (state) => state.publicWorks.lastFetched,
  //   dataKey: 'publicWorks',
  //   fetchAction: () => getPublicWorksAsync(),
  //   ttl: CACHE_TTL.PUBLIC_WORKS,
  //   hasData: publicWorks.length > 0,
  // });

  const loading = status.getPublicWorksAsync?.loading;
  const error = status.getPublicWorksAsync?.response === 'rejected';

  // Use real data if available, otherwise show sample obras
  const obras = publicWorks.length > 0 ? publicWorks : SAMPLE_OBRAS;
  const usingSampleData = publicWorks.length === 0 && !loading;

  return (
    // <Box>
    //   <PageHero
    //     title="Obras Públicas"
    //     subtitle="Conocé las obras de infraestructura y mejoras que estamos realizando en nuestro municipio"
    //     backgroundImage="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80"
    //     overlayColor="rgba(67, 160, 71, 0.85)"
    //     overlayColorEnd="rgba(245, 166, 35, 0.7)"
    //   />

    //   {/* ── Mapa de Obras ─────────────────────────────── */}
    //   <Box sx={{ py: { xs: 6, md: 8 } }}>
    //     <Container maxWidth="lg">
    //       <AnimatedSection animation="fadeInUp">
    //         <SectionTitle
    //           title="Mapa de Obras"
    //           subtitle="Ubicación de las obras realizadas y en ejecución en nuestro municipio"
    //         />
    //       </AnimatedSection>

    //       <AnimatedSection animation="fadeInUp" delay={100}>
    //         <Box
    //           sx={{
    //             borderRadius: 3,
    //             overflow: 'hidden',
    //             boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
    //             border: '2px solid',
    //             borderColor: 'divider',
    //             height: { xs: 350, md: 500 },
    //           }}
    //         >
    //           <MapObras obras={obras} center={MUNICIPALITY_CENTER} />
    //         </Box>
    //       </AnimatedSection>
    //     </Container>
    //   </Box>

    //   {/* ── Grilla de Obras ───────────────────────────── */}
    //   <Box
    //     sx={{
    //       position: 'relative',
    //       py: { xs: 6, md: 8 },
    //       overflow: 'hidden',
    //     }}
    //   >
    //     {/* Decorative gradient background */}
    //     <Box
    //       sx={{
    //         position: 'absolute',
    //         inset: 0,
    //         background:
    //           'linear-gradient(180deg, #FAFBFC 0%, #E8F5E9 50%, #FAFBFC 100%)',
    //         zIndex: 0,
    //       }}
    //     />

    //     <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
    //       <AnimatedSection animation="fadeInUp">
    //         <SectionTitle
    //           title="Nuestras Obras"
    //           subtitle="Infraestructura y mejoras para una ciudad más conectada y accesible"
    //         />
    //       </AnimatedSection>

    //       {usingSampleData && (
    //         <Alert
    //           severity="info"
    //           icon={<ConstructionIcon />}
    //           sx={{ mb: 4, borderRadius: 2 }}
    //         >
    //           Mostrando obras de ejemplo. Las obras reales se gestionan desde el
    //           panel de administración.
    //         </Alert>
    //       )}

    //       {error && !publicWorks.length ? (
    //         <Alert severity="error" sx={{ borderRadius: 2 }}>
    //           No se pudo cargar la información. Intente nuevamente más tarde.
    //         </Alert>
    //       ) : loading ? (
    //         <Box
    //           sx={{
    //             display: 'grid',
    //             gridTemplateColumns: {
    //               xs: '1fr',
    //               sm: 'repeat(2, 1fr)',
    //               md: 'repeat(3, 1fr)',
    //             },
    //             gap: 3,
    //           }}
    //         >
    //           {Array.from(new Array(6)).map((_, index) => (
    //             <Card key={index} sx={{ borderRadius: 3 }}>
    //               <Skeleton variant="rectangular" height={220} />
    //               <CardContent>
    //                 <Skeleton variant="text" width="80%" height={32} />
    //                 <Skeleton variant="text" width="100%" />
    //                 <Skeleton variant="text" width="60%" />
    //               </CardContent>
    //             </Card>
    //           ))}
    //         </Box>
    //       ) : (
    //         <Box
    //           sx={{
    //             display: 'grid',
    //             gridTemplateColumns: {
    //               xs: '1fr',
    //               sm: 'repeat(2, 1fr)',
    //               md: 'repeat(3, 1fr)',
    //             },
    //             gap: 3,
    //           }}
    //         >
    //           {obras.map((obra, index) => (
    //             <AnimatedSection
    //               key={obra.id}
    //               animation="fadeInUp"
    //               delay={index * 80}
    //             >
    //               <Card
    //                 sx={{
    //                   borderRadius: 3,
    //                   overflow: 'hidden',
    //                   height: '100%',
    //                   display: 'flex',
    //                   flexDirection: 'column',
    //                   transition: 'all 0.3s ease',
    //                   border: '2px solid transparent',
    //                   '&:hover': {
    //                     transform: 'translateY(-6px)',
    //                     boxShadow: '0 12px 32px rgba(67, 160, 71, 0.15)',
    //                     borderColor: 'rgba(67, 160, 71, 0.3)',
    //                   },
    //                 }}
    //               >
    //                 <CardMedia
    //                   component="img"
    //                   height={220}
    //                   image={
    //                     obra.image_url ||
    //                     'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80'
    //                   }
    //                   alt={obra.title}
    //                   sx={{
    //                     objectFit: 'cover',
    //                     transition: 'transform 0.5s ease',
    //                     '&:hover': {
    //                       transform: 'scale(1.05)',
    //                     },
    //                   }}
    //                 />
    //                 <CardContent
    //                   sx={{
    //                     flex: 1,
    //                     display: 'flex',
    //                     flexDirection: 'column',
    //                     p: 2.5,
    //                   }}
    //                 >
    //                   <Typography
    //                     variant="h6"
    //                     sx={{
    //                       fontWeight: 700,
    //                       color: '#43A047',
    //                       mb: 1,
    //                       fontSize: '1.05rem',
    //                       lineHeight: 1.3,
    //                     }}
    //                   >
    //                     {obra.title}
    //                   </Typography>
    //                   <Typography
    //                     variant="body2"
    //                     color="text.secondary"
    //                     sx={{
    //                       flex: 1,
    //                       display: '-webkit-box',
    //                       WebkitLineClamp: 3,
    //                       WebkitBoxOrient: 'vertical',
    //                       overflow: 'hidden',
    //                       lineHeight: 1.6,
    //                       mb: 1.5,
    //                     }}
    //                   >
    //                     {obra.description}
    //                   </Typography>
    //                   {obra.address && (
    //                     <Chip
    //                       icon={<LocationOnIcon sx={{ fontSize: 16 }} />}
    //                       label={obra.address}
    //                       size="small"
    //                       variant="outlined"
    //                       sx={{
    //                         alignSelf: 'flex-start',
    //                         borderColor: 'rgba(67, 160, 71, 0.3)',
    //                         color: 'text.secondary',
    //                         fontSize: '0.75rem',
    //                       }}
    //                     />
    //                   )}
    //                 </CardContent>
    //               </Card>
    //             </AnimatedSection>
    //           ))}
    //         </Box>
    //       )}
    //     </Container>
    //   </Box>
    // </Box>
    <></>
  );
};

export default ObrasPublicasPage;
