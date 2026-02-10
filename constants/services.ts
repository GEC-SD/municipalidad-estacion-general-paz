import {
  LocalHospital as LocalHospitalIcon,
  TheaterComedy as TheaterComedyIcon,
  SportsFootball as SportsFootballIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { PUBLIC_ROUTES } from './routes';

export const SERVICES = [
  {
    title: 'Salud',
    icon: LocalHospitalIcon,
    description: 'Accede a servicios de salud municipal',
    href: PUBLIC_ROUTES.SERVICIOS_SALUD,
    color: '#2E86C1',
  },
  {
    title: 'Cultura',
    icon: TheaterComedyIcon,
    description: 'Eventos y actividades culturales',
    href: PUBLIC_ROUTES.SERVICIOS_CULTURA,
    color: '#B52A1C',
  },
  {
    title: 'Deporte',
    icon: SportsFootballIcon,
    description: 'Deportes y recreación para todos',
    href: PUBLIC_ROUTES.SERVICIOS_DEPORTE,
    color: '#F5A623',
  },
  {
    title: 'Trámites',
    icon: DescriptionIcon,
    description: 'Realiza tus trámites municipales',
    href: PUBLIC_ROUTES.SERVICIOS_TRAMITES,
    color: '#1A5F8B',
  },
] as const;
