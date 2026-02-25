'use client';

import { Box, Container, Typography, Breadcrumbs } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BREADCRUMB_LABELS } from '@/constants/menu';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

type PageHeroProps = {
  title: string;
  subtitle?: string;
  /** URL de imagen o video de fondo (.webp/.jpg/.png o .mp4/.webm) */
  backgroundImage?: string;
  /** Imagen de poster/fallback para videos (se muestra mientras carga) */
  backgroundPoster?: string;
  /** Color del gradiente overlay (default: primary blue) */
  overlayColor?: string;
  /** Segundo color del gradiente overlay */
  overlayColorEnd?: string;
};

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg'];

const isVideo = (url?: string): boolean => {
  if (!url) return false;
  const lower = url.toLowerCase().split('?')[0];
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
};

// Wave SVG separator — curva suave al final del hero
const WaveSeparator = () => (
  <Box
    sx={{
      position: 'absolute',
      bottom: -1,
      left: 0,
      right: 0,
      lineHeight: 0,
      zIndex: 2,
    }}
  >
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      style={{ display: 'block', width: '100%', height: '60px' }}
    >
      <path
        d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
        fill="#FAFBFC"
      />
    </svg>
  </Box>
);

const PageHero = ({
  title,
  subtitle,
  backgroundImage,
  backgroundPoster,
  overlayColor = 'rgba(26, 95, 139, 0.85)',
  overlayColorEnd = 'rgba(46, 134, 193, 0.7)',
}: PageHeroProps) => {
  const hasVideo = isVideo(backgroundImage);
  const pathname = usePathname();

  // Build breadcrumb segments from current path
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((_, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = BREADCRUMB_LABELS[href] || pathSegments[index];
    const isLast = index === pathSegments.length - 1;
    return { href, label, isLast };
  });

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
        py: { xs: 7, md: 9 },
        pb: { xs: 10, md: 12 },
        minHeight: { xs: 200, md: 260 },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background media (image or video) */}
      {backgroundImage && !hasVideo && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />
      )}
      {backgroundImage && hasVideo && (
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          poster={backgroundPoster}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0,
          }}
        >
          <source src={backgroundImage} type={`video/${backgroundImage.split('.').pop()?.split('?')[0]}`} />
        </Box>
      )}

      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: backgroundImage
            ? `linear-gradient(135deg, ${overlayColor} 0%, ${overlayColorEnd} 100%)`
            : `linear-gradient(135deg, ${overlayColor} 0%, ${overlayColorEnd} 100%)`,
          zIndex: 1,
        }}
      />

      {/* Decorative shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: -40,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<NavigateNextIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />}
            sx={{ mb: 2 }}
          >
            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem' }}>
              Inicio
            </Link>
            {breadcrumbs.map((crumb) =>
              crumb.isLast ? (
                <Typography key={crumb.href} variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                  {crumb.label}
                </Typography>
              ) : (
                <Link
                  key={crumb.href}
                  href={crumb.href}
                  style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  {crumb.label}
                </Link>
              )
            )}
          </Breadcrumbs>
        )}

        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2rem', md: '3rem' },
            textShadow: '0 2px 12px rgba(0,0,0,0.15)',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="h5"
            sx={{
              opacity: 0.9,
              fontSize: { xs: '1.05rem', md: '1.35rem' },
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Container>

      {/* Wave separator */}
      <WaveSeparator />
    </Box>
  );
};

export default PageHero;
