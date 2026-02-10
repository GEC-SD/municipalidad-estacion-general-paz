'use client';

import { Box } from '@mui/material';
import { useScrollAnimation } from '@/hooks';
import { SxProps } from '@mui/material/styles';

type AnimationType = 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'zoomIn' | 'fadeIn';

type AnimatedSectionProps = {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  sx?: SxProps;
};

const getInitialTransform = (animation: AnimationType): string => {
  switch (animation) {
    case 'fadeInUp':
      return 'translateY(40px)';
    case 'fadeInLeft':
      return 'translateX(-40px)';
    case 'fadeInRight':
      return 'translateX(40px)';
    case 'zoomIn':
      return 'scale(0.9)';
    case 'fadeIn':
    default:
      return 'none';
  }
};

const AnimatedSection = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  sx,
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getInitialTransform(animation),
        transition: `opacity ${duration}s ease-out ${delay}ms, transform ${duration}s ease-out ${delay}ms`,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default AnimatedSection;
