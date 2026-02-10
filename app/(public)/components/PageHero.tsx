import { Box, Container, Typography } from '@mui/material';

type PageHeroProps = {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
};

const PageHero = ({
  title,
  subtitle,
  backgroundColor,
}: PageHeroProps) => {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
        py: { xs: 6, md: 8 },
        backgroundColor: backgroundColor || 'primary.main',
        backgroundImage: backgroundColor
          ? undefined
          : 'linear-gradient(135deg, #2E86C1 0%, #1A5F8B 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="h5"
            sx={{
              opacity: 0.9,
              fontSize: { xs: '1.125rem', md: '1.5rem' },
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default PageHero;
