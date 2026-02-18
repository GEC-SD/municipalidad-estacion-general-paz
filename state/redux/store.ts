import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import stripTransientFields from './persistTransforms';

// Importar reducers
import appReducer from './app';
import authReducer from './auth';
import newsReducer from './news';
import authoritiesReducer from './authorities';
import servicesReducer from './services';
import regulationsReducer from './regulations';
import contactReducer from './contact';
import adminReducer from './admin';
import eventsReducer from './events';
import publicWorksReducer from './publicWorks';
import tramitesReducer from './tramites';

// Configuración de Redux Persist
// SEGURIDAD: NO persistir auth (se maneja via cookies httpOnly de Supabase)
// Persistir datos públicos estables para reducir llamadas a Supabase
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['app', 'services', 'authorities', 'contact', 'publicWorks', 'tramites'],
  transforms: [stripTransientFields],
};

// Combinar reducers
const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  news: newsReducer,
  authorities: authoritiesReducer,
  services: servicesReducer,
  regulations: regulationsReducer,
  contact: contactReducer,
  admin: adminReducer,
  events: eventsReducer,
  publicWorks: publicWorksReducer,
  tramites: tramitesReducer,
});

// Tipo base del estado (sin wrappers de persist)
type RootReducerState = ReturnType<typeof rootReducer>;

// Aplicar persist al rootReducer
const persistedReducer = persistReducer<RootReducerState>(persistConfig as any, rootReducer);

// Configurar el store
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Persistor para usar en el Provider
export const persistor = persistStore(store);

// Tipos para TypeScript
// Usar rootReducer directamente para evitar que persistReducer haga los slices `| undefined`
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
