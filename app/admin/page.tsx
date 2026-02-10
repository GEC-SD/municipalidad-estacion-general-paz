'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Skeleton,
} from '@mui/material';
import {
  Article as ArticleIcon,
  People as PeopleIcon,
  MiscellaneousServices as ServicesIcon,
  Gavel as GavelIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import { getAdminStatsAsync } from '@/state/redux/admin';
import { ADMIN_ROUTES } from '@/constants';

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { stats, status } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdminStatsAsync());
  }, [dispatch]);

  const loading = status.getAdminStatsAsync?.loading;

  const statCards = [
    {
      title: 'Novedades',
      value: stats?.totalNews || 0,
      subtitle: `${stats?.publishedNews || 0} publicadas, ${stats?.draftNews || 0} borradores`,
      icon: <ArticleIcon sx={{ fontSize: 40 }} />,
      color: '#2E86C1',
      href: ADMIN_ROUTES.ADMIN_NOVEDADES,
    },
    {
      title: 'Autoridades',
      value: stats?.totalAuthorities || 0,
      subtitle: 'Intendente, gabinete y concejo',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1A5F8B',
      href: ADMIN_ROUTES.ADMIN_AUTORIDADES,
    },
    {
      title: 'Servicios',
      value: stats?.totalServices || 0,
      subtitle: 'Salud, cultura, deporte, trámites',
      icon: <ServicesIcon sx={{ fontSize: 40 }} />,
      color: '#F5A623',
      href: ADMIN_ROUTES.ADMIN_SERVICIOS,
    },
    {
      title: 'Normativa',
      value: stats?.totalRegulations || 0,
      subtitle: 'Ordenanzas y regulaciones',
      icon: <GavelIcon sx={{ fontSize: 40 }} />,
      color: '#B52A1C',
      href: ADMIN_ROUTES.ADMIN_NORMATIVA,
    },
  ];

  const quickActions = [
    {
      label: 'Nueva Novedad',
      href: ADMIN_ROUTES.ADMIN_NOVEDADES_NUEVA,
      icon: <ArticleIcon />,
    },
    {
      label: 'Nueva Autoridad',
      href: ADMIN_ROUTES.ADMIN_AUTORIDADES_NUEVA,
      icon: <PeopleIcon />,
    },
    {
      label: 'Nuevo Servicio',
      href: `${ADMIN_ROUTES.ADMIN_SERVICIOS}/nuevo`,
      icon: <ServicesIcon />,
    },
    {
      label: 'Nueva Normativa',
      href: ADMIN_ROUTES.ADMIN_NORMATIVA_NUEVA,
      icon: <GavelIcon />,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        {statCards.map((stat, index) => (
          <Box
            key={stat.title}
            sx={{
              animation: 'scrollFadeInUp 0.5s ease-out both',
              animationDelay: `${index * 100}ms`,
            }}
          >
            {loading ? (
              <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
            ) : (
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s',
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <CardContent
                  component={Link}
                  href={stat.href}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: `${stat.color}15`,
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <TrendingUpIcon sx={{ color: 'success.main' }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        ))}
      </Box>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, animation: 'scrollFadeInUp 0.5s ease-out 0.4s both' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Acciones Rápidas
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          {quickActions.map((action) => (
            <Box key={action.label}>
              <Button
                component={Link}
                href={action.href}
                variant="outlined"
                fullWidth
                startIcon={action.icon}
                endIcon={<AddIcon />}
                sx={{
                  py: 1.5,
                  justifyContent: 'flex-start',
                  '& .MuiButton-endIcon': {
                    ml: 'auto',
                  },
                }}
              >
                {action.label}
              </Button>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Welcome Card */}
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          background: 'linear-gradient(135deg, #2E86C1 0%, #1A5F8B 100%)',
          color: 'white',
          borderRadius: 3,
          animation: 'scrollFadeInUp 0.5s ease-out 0.5s both',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Bienvenido al Panel de Administración
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
          Desde aquí puedes gestionar todo el contenido del sitio web de la
          Municipalidad de Estación General Paz. Utiliza el menú lateral para
          navegar entre las diferentes secciones.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            component={Link}
            href={ADMIN_ROUTES.ADMIN_NOVEDADES_NUEVA}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
          >
            Crear Novedad
          </Button>
          <Button
            variant="outlined"
            component="a"
            href="/"
            target="_blank"
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Ver Sitio Web
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DashboardPage;
