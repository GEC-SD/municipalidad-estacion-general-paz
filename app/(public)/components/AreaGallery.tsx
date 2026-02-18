'use client';

import { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

export interface GalleryPhoto {
  src: string;
  alt: string;
  title?: string;
}

interface AreaGalleryProps {
  photos: GalleryPhoto[];
  accentColor: string;
  sectionTitle?: string;
  itemsPerPage?: number;
}

const AreaGallery = ({
  photos,
  accentColor,
  sectionTitle = 'Galería de Fotos',
  itemsPerPage = 9,
}: AreaGalleryProps) => {
  const [page, setPage] = useState(0);

  if (photos.length === 0) return null;

  const totalPages = Math.ceil(photos.length / itemsPerPage);
  const visiblePhotos = photos.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ mt: 10 }}>
      {/* Section header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, gap: 2 }}>
        <Box
          sx={{
            width: 4,
            height: 32,
            borderRadius: 2,
            bgcolor: accentColor,
            flexShrink: 0,
          }}
        />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#222',
            letterSpacing: '-0.01em',
          }}
        >
          {sectionTitle}
        </Typography>
        <Box
          sx={{
            flex: 1,
            height: '1px',
            bgcolor: 'rgba(0,0,0,0.08)',
            ml: 1,
          }}
        />
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', flexShrink: 0, fontSize: '0.8rem' }}
        >
          {photos.length} fotos
        </Typography>
      </Box>

      {/* Masonry grid using CSS columns */}
      <Box
        sx={{
          columns: { xs: 1, sm: 2, md: 3 },
          columnGap: '14px',
        }}
      >
        {visiblePhotos.map((photo, i) => (
          <Box
            key={`${page}-${i}`}
            sx={{
              breakInside: 'avoid',
              display: 'inline-block',
              width: '100%',
              mb: '14px',
              position: 'relative',
              borderRadius: '10px',
              overflow: 'hidden',
              cursor: 'zoom-in',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'box-shadow 0.35s ease',
              '&:hover': {
                boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
              },
              '&:hover .g-img': {
                transform: 'scale(1.06)',
              },
              '&:hover .g-overlay': {
                opacity: 1,
              },
              '&:hover .g-caption': {
                transform: 'translateY(0)',
                opacity: 1,
              },
              '&:hover .g-accent': {
                transform: 'scaleX(1)',
              },
            }}
          >
            {/* Image */}
            <Box
              component="img"
              src={photo.src}
              alt={photo.alt}
              className="g-img"
              sx={{
                width: '100%',
                display: 'block',
                height: 'auto',
                transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />

            {/* Top accent bar */}
            <Box
              className="g-accent"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                bgcolor: accentColor,
                transform: 'scaleX(0)',
                transformOrigin: 'left center',
                transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 3,
              }}
            />

            {/* Gradient overlay */}
            <Box
              className="g-overlay"
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 45%, transparent 75%)',
                opacity: 0,
                transition: 'opacity 0.4s ease',
                zIndex: 1,
              }}
            />

            {/* Caption */}
            {photo.title && (
              <Box
                className="g-caption"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  px: 1.75,
                  py: 1.5,
                  zIndex: 2,
                  transform: 'translateY(6px)',
                  opacity: 0,
                  transition:
                    'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
                }}
              >
                <Typography
                  sx={{
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    lineHeight: 1.35,
                    letterSpacing: '0.01em',
                    textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                  }}
                >
                  {photo.title}
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1.5,
            mt: 5,
          }}
        >
          <IconButton
            onClick={() => handlePageChange(Math.max(0, page - 1))}
            disabled={page === 0}
            size="small"
            sx={{
              border: '1.5px solid',
              borderColor: page === 0 ? 'rgba(0,0,0,0.12)' : accentColor,
              color: page === 0 ? 'rgba(0,0,0,0.26)' : accentColor,
              width: 36,
              height: 36,
              transition: 'all 0.2s ease',
              '&:hover:not(:disabled)': {
                bgcolor: `${accentColor}18`,
                transform: 'translateX(-2px)',
              },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>

          {/* Dot indicators */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Box
                key={i}
                onClick={() => handlePageChange(i)}
                sx={{
                  width: page === i ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: page === i ? accentColor : 'rgba(0,0,0,0.18)',
                  cursor: 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: page === i ? accentColor : `${accentColor}70`,
                  },
                }}
              />
            ))}
          </Box>

          <IconButton
            onClick={() => handlePageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            size="small"
            sx={{
              border: '1.5px solid',
              borderColor:
                page === totalPages - 1 ? 'rgba(0,0,0,0.12)' : accentColor,
              color:
                page === totalPages - 1 ? 'rgba(0,0,0,0.26)' : accentColor,
              width: 36,
              height: 36,
              transition: 'all 0.2s ease',
              '&:hover:not(:disabled)': {
                bgcolor: `${accentColor}18`,
                transform: 'translateX(2px)',
              },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Page count label */}
      {totalPages > 1 && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            color: 'text.secondary',
            mt: 1.5,
          }}
        >
          Página {page + 1} de {totalPages}
        </Typography>
      )}
    </Box>
  );
};

export default AreaGallery;
