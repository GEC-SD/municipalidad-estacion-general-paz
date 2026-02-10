import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const instanceAxios = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request
// SEGURIDAD: No se almacenan tokens en localStorage.
// La autenticación se gestiona via cookies httpOnly de Supabase.
instanceAxios.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Interceptor de response
instanceAxios.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
