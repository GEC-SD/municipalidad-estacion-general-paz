import { Box, Typography } from '@mui/material';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean;
};

const SectionTitle = ({
  title,
  subtitle,
  align = 'center',
  light = false,
}: SectionTitleProps) => {
  return (
    <Box sx={{ textAlign: align, mb: 6 }}>
      <Box
        sx={{
          width: 60,
          height: 4,
          borderRadius: 2,
          backgroundColor: 'primary.main',
          mb: 2,
          mx: align === 'center' ? 'auto' : 0,
        }}
      />
      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontWeight: 700,
          color: light ? 'white' : 'text.primary',
          mb: subtitle ? 1.5 : 0,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: light ? 'rgba(255,255,255,0.85)' : 'text.secondary',
            maxWidth: 600,
            mx: align === 'center' ? 'auto' : 0,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default SectionTitle;
