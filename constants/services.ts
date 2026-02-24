import {
  LocalHospital as LocalHospitalIcon,
  TheaterComedy as TheaterComedyIcon,
  Construction as ConstructionIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { PUBLIC_ROUTES } from './routes';

export const SERVICES = [
  {
    title: 'Salud',
    icon: LocalHospitalIcon,
    description: 'Accede a Área de salud municipal',
    href: PUBLIC_ROUTES.SERVICIOS_SALUD,
    color: '#2E86C1',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80',
  },
  {
    title: 'Cultura y Deporte',
    icon: TheaterComedyIcon,
    description: 'Eventos, actividades culturales y deportivas',
    href: PUBLIC_ROUTES.SERVICIOS_CULTURA,
    color: '#B52A1C',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80',
  },
  {
    title: 'Obra e infraestructura',
    icon: ConstructionIcon,
    description: 'Obras e infraestructura municipal',
    href: PUBLIC_ROUTES.SERVICIOS_OBRAS,
    color: '#F5A623',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
  },
  {
    title: 'Educación',
    icon: SchoolIcon,
    description: 'Programas educativos municipales',
    href: PUBLIC_ROUTES.SERVICIOS_EDUCACION,
    color: '#1A5F8B',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
  },
] as const;
