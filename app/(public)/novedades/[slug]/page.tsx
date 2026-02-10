'use client';

import { useEffect } from 'react';
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
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  AttachFile as AttachFileIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import { getNewsBySlugAsync, clearCurrentNews } from '@/state/redux/news';
import { PUBLIC_ROUTES, NEWS_CATEGORIES } from '@/constants';
import { sanitizeHtml } from '@/utils/sanitize';
import PageHero from '../../components/PageHero';
import AnimatedSection from '../../components/AnimatedSection';

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

  return (
    <Box>
      <PageHero title={currentNews.title} subtitle={currentNews.excerpt || undefined} />
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

        {/* Featured Image */}
        {currentNews.featured_image_url && (
          <Box
            component="img"
            src={currentNews.featured_image_url}
            alt={currentNews.title}
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 2,
              mb: 3,
            }}
          />
        )}

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
