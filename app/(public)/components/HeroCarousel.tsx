'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Box, Container, Typography, Button, IconButton } from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

type HeroSlide = {
  id: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  /** URL de imagen de fondo (se ignora si hay backgroundVideo en el carousel) */
  backgroundImage?: string;
  /** Color primario del gradiente overlay */
  overlayColor?: string;
  /** Color secundario del gradiente overlay */
  overlayColorEnd?: string;
};

type HeroCarouselProps = {
  slides: HeroSlide[];
  autoplayInterval?: number;
  /** URL de video de fondo compartido para todos los slides */
  backgroundVideo?: string;
  /** Imagen poster/fallback mientras carga el video */
  backgroundPoster?: string;
};

const HeroCarousel = ({
  slides,
  autoplayInterval = 8000,
  backgroundVideo,
  backgroundPoster,
}: HeroCarouselProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(nextSlide, autoplayInterval);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, autoplayInterval, slides.length]);

  if (slides.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '55vh', md: '65vh' },
        minHeight: { xs: 400, md: 500 },
        overflow: 'hidden',
        backgroundColor: 'primary.dark',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Shared video background */}
      {backgroundVideo && (
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
          <source src={backgroundVideo} type={`video/${backgroundVideo.split('.').pop()?.split('?')[0] || 'mp4'}`} />
        </Box>
      )}

      {/* Slides */}
      {slides.map((slide, index) => (
        <Box
          key={slide.id}
          sx={{
            position: 'absolute',
            inset: 0,
            transition: 'opacity 0.8s ease-in-out',
            opacity: index === activeSlide ? 1 : 0,
          }}
        >
          {/* Background image (only when no shared video) */}
          {!backgroundVideo && slide.backgroundImage && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${slide.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 8s ease-out',
                transform: index === activeSlide ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          )}

          {/* Gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${slide.overlayColor || 'rgba(26,95,139,0.88)'} 0%, ${slide.overlayColorEnd || 'rgba(46,134,193,0.7)'} 60%, rgba(67,160,71,0.5) 100%)`,
            }}
          />

          {/* Decorative circles */}
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              right: '5%',
              width: { xs: 120, md: 250 },
              height: { xs: 120, md: 250 },
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.08)',
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '15%',
              right: '10%',
              width: { xs: 80, md: 180 },
              height: { xs: 80, md: 180 },
              borderRadius: '50%',
              background: 'rgba(253,216,53,0.08)',
              zIndex: 1,
            }}
          />

          {/* Content */}
          <Container
            maxWidth="lg"
            sx={{
              position: 'relative',
              zIndex: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                mb: 2,
                maxWidth: 700,
                textShadow: '0 2px 16px rgba(0,0,0,0.2)',
                lineHeight: 1.15,
              }}
            >
              {slide.title}
            </Typography>
            {slide.subtitle && (
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1rem', md: '1.3rem' },
                  opacity: 0.9,
                  mb: 4,
                  maxWidth: 550,
                  lineHeight: 1.7,
                  fontWeight: 400,
                }}
              >
                {slide.subtitle}
              </Typography>
            )}
            {slide.ctaText && slide.ctaHref && (
              <Box>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href={slide.ctaHref}
                  sx={{
                    backgroundColor: '#FDD835',
                    color: '#2D3436',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    borderRadius: '50px',
                    '&:hover': {
                      backgroundColor: '#FFEE58',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(253,216,53,0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {slide.ctaText}
                </Button>
              </Box>
            )}
          </Container>
        </Box>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <IconButton
            onClick={prevSlide}
            sx={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              left: { xs: 8, md: 24 },
              zIndex: 3,
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.25)',
              },
            }}
            aria-label="Slide anterior"
          >
            <ChevronLeftIcon sx={{ fontSize: 32 }} />
          </IconButton>
          <IconButton
            onClick={nextSlide}
            sx={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              right: { xs: 8, md: 24 },
              zIndex: 3,
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.25)',
              },
            }}
            aria-label="Siguiente slide"
          >
            <ChevronRightIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 70, md: 80 },
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 3,
          }}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              component="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Ir a slide ${index + 1}`}
              sx={{
                width: index === activeSlide ? 32 : 12,
                height: 12,
                borderRadius: '6px',
                backgroundColor: index === activeSlide ? '#FDD835' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                p: 0,
                minWidth: 0,
                '&:hover': {
                  backgroundColor: index === activeSlide ? '#FDD835' : 'rgba(255,255,255,0.6)',
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Wave separator at bottom */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -1,
          left: 0,
          right: 0,
          lineHeight: 0,
          zIndex: 3,
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
    </Box>
  );
};

export default HeroCarousel;
