import Link from 'next/link';
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import { News, NewsCategory } from '@/types';
import { PUBLIC_ROUTES, NEWS_CATEGORIES } from '@/constants';
import classes from './classes';

type NewsCardProps = {
  news: News;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const getCategoryLabel = (category: NewsCategory) => {
  return NEWS_CATEGORIES.find((c) => c.value === category)?.label || category;
};

const NewsCard = ({ news }: NewsCardProps) => {
  return (
    <Card sx={classes.newsCard}>
      <CardActionArea
        component={Link}
        href={PUBLIC_ROUTES.NOVEDADES_DETALLE(news.slug)}
        sx={classes.newsCardActionArea}
      >
        <Box sx={{ position: 'relative' }}>
          {(news.image_urls?.[0] || news.featured_image_url) && (
            <CardMedia
              component="img"
              height="200"
              image={news.image_urls?.[0] || news.featured_image_url}
              alt={news.title}
              sx={{ objectFit: 'cover' }}
            />
          )}
          <Box sx={classes.newsCardDateBadge}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {formatDate(news.published_at || news.created_at)}
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          {news.category && (
            <Chip
              label={getCategoryLabel(news.category)}
              size="small"
              color="primary"
              sx={{ mb: 1 }}
            />
          )}
          <Typography
            variant="h6"
            gutterBottom
            sx={classes.newsCardTitle}
          >
            {news.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={classes.newsCardExcerpt}
          >
            {news.excerpt}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default NewsCard;
