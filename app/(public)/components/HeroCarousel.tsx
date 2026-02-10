'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Box, Container, Typography, Button, IconButton } from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import classes from './classes';

type HeroSlide = {
  id: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
};

type HeroCarouselProps = {
  slides: HeroSlide[];
  autoplayInterval?: number;
};

const HeroCarousel = ({
  slides,
  autoplayInterval = 8000,
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
      sx={classes.heroCarousel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <Box
          key={slide.id}
          sx={{
            ...classes.heroCarouselSlide,
            opacity: index === activeSlide ? 1 : 0,
          }}
        >
          <Box sx={classes.heroCarouselOverlay} />
          <Container maxWidth="lg" sx={classes.heroCarouselContent}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' },
                mb: 2,
                maxWidth: 700,
                textShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              {slide.title}
            </Typography>
            {slide.subtitle && (
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1rem', md: '1.35rem' },
                  opacity: 0.9,
                  mb: 3,
                  maxWidth: 550,
                  lineHeight: 1.6,
                }}
              >
                {slide.subtitle}
              </Typography>
            )}
            {slide.ctaText && slide.ctaHref && (
              <Button
                variant="contained"
                size="large"
                component={Link}
                href={slide.ctaHref}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': {
                    backgroundColor: 'grey.100',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {slide.ctaText}
              </Button>
            )}
          </Container>
        </Box>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <IconButton
            onClick={prevSlide}
            sx={{ ...classes.heroCarouselArrow, left: { xs: 8, md: 24 } }}
            aria-label="Slide anterior"
          >
            <ChevronLeftIcon sx={{ fontSize: 32 }} />
          </IconButton>
          <IconButton
            onClick={nextSlide}
            sx={{ ...classes.heroCarouselArrow, right: { xs: 8, md: 24 } }}
            aria-label="Siguiente slide"
          >
            <ChevronRightIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <Box sx={classes.heroCarouselDots}>
          {slides.map((_, index) => (
            <Box
              key={index}
              component="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Ir a slide ${index + 1}`}
              sx={{
                ...classes.heroCarouselDot,
                ...(index === activeSlide && classes.heroCarouselDotActive),
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default HeroCarousel;
