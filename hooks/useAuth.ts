import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/state/redux/store';
import { PUBLIC_ROUTES } from '@/constants';

/**
 * Hook para obtener información de autenticación
 * Retorna el usuario actual, estado de autenticación y loading
 */
export const useAuth = () => {
  const { user, isAuthenticated, session, status } = useAppSelector(
    (state) => state.auth
  );

  const loading = status.checkSessionAsync?.loading || false;
  const error = status.checkSessionAsync?.message || null;

  return {
    user,
    isAuthenticated,
    session,
    loading,
    error,
  };
};

/**
 * Hook para proteger rutas que requieren autenticación
 * Redirige a login si el usuario no está autenticado
 */
export const useRequireAuth = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(PUBLIC_ROUTES.LOGIN);
    }
  }, [isAuthenticated, loading, router]);

  return {
    isAuthenticated,
    loading,
  };
};
