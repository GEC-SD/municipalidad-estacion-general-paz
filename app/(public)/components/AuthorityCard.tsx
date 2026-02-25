'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material';
import { Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { Authority } from '@/types/authorities';

type AuthorityCardProps = {
  authority: Authority;
};

export const AuthorityCard = ({ authority }: AuthorityCardProps) => {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 14px 36px rgba(26,95,139,0.15)',
        },
        '&:hover .card-accent': {
          transform: 'scaleY(1)',
        },
      }}
    >
      {/* Left accent bar on hover */}
      <Box
        className="card-accent"
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          bgcolor: 'primary.main',
          transform: 'scaleY(0)',
          transformOrigin: 'top center',
          transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
          zIndex: 2,
          borderRadius: '3px 0 0 3px',
        }}
      />

      {/* Photo area */}
      <Box
        sx={{
          width: '100%',
          height: 220,
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'grey.100',
        }}
      >
        <Avatar
          src={authority.photo_url}
          alt={authority.full_name}
          variant="square"
          sx={{
            width: '100%',
            height: '100%',
            '& .MuiAvatar-img': {
              objectFit: 'cover',
              objectPosition: 'top center',
            },
          }}
        />
        {/* Subtle gradient at bottom for text readability */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.04))',
          }}
        />
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 2.5,
          '&:last-child': { pb: 2.5 },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1.05rem',
            lineHeight: 1.3,
            color: '#1a1a2e',
            mb: 0.75,
          }}
        >
          {authority.full_name}
        </Typography>

        <Chip
          label={authority.position}
          size="small"
          color="primary"
          variant="outlined"
          sx={{
            alignSelf: 'flex-start',
            fontWeight: 600,
            fontSize: '0.68rem',
            height: 24,
            mb: 1,
            letterSpacing: '0.01em',
          }}
        />

        {authority.department && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              mb: 1,
              display: 'block',
            }}
          >
            {authority.department}
          </Typography>
        )}

        {authority.bio && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 1,
            }}
          >
            {authority.bio.replace(/<[^>]*>/g, '')}
          </Typography>
        )}

        {/* Contact - pushed to bottom */}
        {(authority.email || authority.phone) && (
          <Box
            sx={{
              mt: 'auto',
              pt: 1.5,
              borderTop: '1px solid',
              borderColor: 'rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            {authority.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EmailIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>
                  <a
                    href={`mailto:${authority.email}`}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {authority.email}
                  </a>
                </Typography>
              </Box>
            )}
            {authority.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PhoneIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>
                  <a
                    href={`tel:${authority.phone}`}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {authority.phone}
                  </a>
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
