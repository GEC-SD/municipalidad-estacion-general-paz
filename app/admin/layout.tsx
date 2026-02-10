'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/state/redux/store';
import { checkSessionAsync } from '@/state/redux/auth';
import { AUTH_ROUTES } from '@/constants';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, status } = useAppSelector((state) => state.auth);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(checkSessionAsync());
      setIsChecking(false);
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push(AUTH_ROUTES.LOGIN);
    }
  }, [isChecking, isAuthenticated, router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Show loading while checking authentication
  if (isChecking || status.checkSessionAsync?.loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary">
          Verificando sesión...
        </Typography>
      </Box>
    );
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminHeader onMenuClick={handleDrawerToggle} />
      <AdminSidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: '100%', md: 'calc(100% - 260px)' },
          mt: '64px',
          backgroundColor: 'grey.50',
          minHeight: 'calc(100vh - 64px)',
          animation: 'scrollFadeInUp 0.4s ease-out',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
