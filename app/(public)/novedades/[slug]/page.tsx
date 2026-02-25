'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Chip,
  Breadcrumbs,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Skeleton,
  Alert,
  IconButton,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  AttachFile as AttachFileIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Launch as LaunchIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FiberManualRecord as DotIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import { getNewsBySlugAsync, clearCurrentNews } from '@/state/redux/news';
import { PUBLIC_ROUTES, NEWS_CATEGORIES } from '@/constants';
import { sanitizeHtml } from '@/utils/sanitize';
import PageHero from '../../components/PageHero';
import AnimatedSection from '../../components/AnimatedSection';

const ImageGallery = ({ images, title }: { images: string[]; title: string }) => {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <Box
        component="img"
        src={images[0]}
        alt={title}
        sx={{
          width: '100%',
          height: 'auto',
          maxHeight: 500,
          objectFit: 'cover',
          borderRadius: 2,
          mb: 3,
        }}
      />
    );
  }

  return (
    <Box sx={{ position: 'relative', mb: 3 }}>
      <Box
        component="img"
        src={images[current]}
        alt={`${title} - Imagen ${current + 1}`}
        sx={{
          width: '100%',
          height: 'auto',
          maxHeight: 500,
          objectFit: 'cover',
          borderRadius: 2,
        }}
      />
      {/* Navigation arrows */}
      <IconButton
        onClick={() => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
        sx={{
          position: 'absolute',
          left: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>
      <IconButton
        onClick={() => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
        sx={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ChevronRightIcon />
      </IconButton>
      {/* Dots indicator */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 0.5,
          mt: 1.5,
        }}
      >
        {images.map((_, index) => (
          <IconButton
            key={index}
            onClick={() => setCurrent(index)}
            size="small"
            sx={{ p: 0.25 }}
          >
            <DotIcon
              sx={{
                fontSize: 12,
                color: index === current ? 'primary.main' : 'text.disabled',
              }}
            />
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};

const NewsDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentNews, status } = useAppSelector((state) => state.news);

  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      dispatch(getNewsBySlugAsync(slug));
    }

    return () => {
      dispatch(clearCurrentNews());
    };
  }, [dispatch, slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const loading = status.getNewsBySlugAsync?.loading;
  const error = status.getNewsBySlugAsync?.response === 'rejected';

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Skeleton variant="text" width="60%" height={60} />
        <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} sx={{ mb: 3 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </Container>
    );
  }

  if (error || !currentNews) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          No se pudo cargar la noticia. Es posible que no exista o haya sido
          eliminada.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(PUBLIC_ROUTES.NOVEDADES)}
        >
          Volver a Novedades
        </Button>
      </Container>
    );
  }

  // Build images array with fallback
  const images = currentNews.image_urls && currentNews.image_urls.length > 0
    ? currentNews.image_urls
    : currentNews.featured_image_url
      ? [currentNews.featured_image_url]
      : [];

  return (
    <Box>
      <PageHero title={currentNews.title} subtitle={currentNews.excerpt || undefined} overlayColor="rgba(46,134,193,0.88)" overlayColorEnd="rgba(67,160,71,0.72)" />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <AnimatedSection animation="fadeInUp">
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link
          href={PUBLIC_ROUTES.HOME}
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Inicio
        </Link>
        <Link
          href={PUBLIC_ROUTES.NOVEDADES}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Novedades
        </Link>
        <Typography color="text.primary">{currentNews.title}</Typography>
      </Breadcrumbs>

      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push(PUBLIC_ROUTES.NOVEDADES)}
        sx={{ mb: 3 }}
      >
        Volver a Novedades
      </Button>

      {/* News Content */}
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        {/* Category */}
        {currentNews.category && (
          <Chip
            label={
              NEWS_CATEGORIES.find((c) => c.value === currentNews.category)
                ?.label || currentNews.category
            }
            color="primary"
            sx={{ mb: 2 }}
          />
        )}

        {/* Title */}
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.75rem', md: '2.5rem' },
          }}
        >
          {currentNews.title}
        </Typography>

        {/* Date */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {formatDate(currentNews.published_at || currentNews.created_at)}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Image Gallery */}
        <ImageGallery images={images} title={currentNews.title} />

        {/* Excerpt */}
        {currentNews.excerpt && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              mb: 3,
              color: 'text.secondary',
              fontStyle: 'italic',
            }}
          >
            {currentNews.excerpt}
          </Typography>
        )}

        {/* Content */}
        <Box
          className="rich-text-content"
          sx={{ mb: 4 }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentNews.content) }}
        />

        {/* Social Link */}
        {currentNews.social_url && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<LaunchIcon />}
              component="a"
              href={currentNews.social_url.match(/^https?:\/\//) ? currentNews.social_url : `https://${currentNews.social_url}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textTransform: 'none' }}
            >
              Ver publicación en redes sociales
            </Button>
          </Box>
        )}

        {/* Attachments */}
        {currentNews.attachments && currentNews.attachments.length > 0 && (
          <>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Archivos Adjuntos
            </Typography>
            <List>
              {currentNews.attachments.map((attachment) => (
                <ListItem
                  key={attachment.id}
                  component="a"
                  href={attachment.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
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
                  <DownloadIcon />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Paper>

      {/* Back Button Bottom */}
      <Box sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(PUBLIC_ROUTES.NOVEDADES)}
          variant="outlined"
        >
          Volver a Novedades
        </Button>
      </Box>
      </AnimatedSection>
    </Container>
    </Box>
  );
};

export default NewsDetailPage;
