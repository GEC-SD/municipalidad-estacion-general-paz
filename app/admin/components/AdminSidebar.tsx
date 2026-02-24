'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  People as PeopleIcon,
  MiscellaneousServices as ServicesIcon,
  Gavel as GavelIcon,
  Event as EventIcon,
  ContactPhone as ContactPhoneIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import { ADMIN_ROUTES } from '@/constants';

const DRAWER_WIDTH = 260;

type AdminSidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

const menuItems = [
  {
    label: 'Dashboard',
    href: ADMIN_ROUTES.ADMIN_DASHBOARD,
    icon: <DashboardIcon />,
  },
  {
    label: 'Novedades',
    href: ADMIN_ROUTES.ADMIN_NOVEDADES,
    icon: <ArticleIcon />,
  },
  {
    label: 'Autoridades',
    href: ADMIN_ROUTES.ADMIN_AUTORIDADES,
    icon: <PeopleIcon />,
  },
  {
    label: 'Areas',
    href: ADMIN_ROUTES.ADMIN_SERVICIOS,
    icon: <ServicesIcon />,
  },
  {
    label: 'Transparencia',
    href: ADMIN_ROUTES.ADMIN_TRANSPARENCIA,
    icon: <GavelIcon />,
  },
  {
    label: 'Eventos',
    href: ADMIN_ROUTES.ADMIN_EVENTOS,
    icon: <EventIcon />,
  },
  {
    label: 'Contacto',
    href: ADMIN_ROUTES.ADMIN_CONTACTO,
    icon: <ContactPhoneIcon />,
  },
  {
    label: 'Trámites',
    href: ADMIN_ROUTES.ADMIN_TRAMITES,
    icon: <DescriptionIcon />,
  },
];

const AdminSidebar = ({ mobileOpen, onClose }: AdminSidebarProps) => {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActiveRoute = (href: string) => {
    if (href === ADMIN_ROUTES.ADMIN_DASHBOARD) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Image
          src="/logo.webp"
          alt="Escudo Estación General Paz"
          width={36}
          height={44}
          style={{ objectFit: 'contain' }}
        />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Municipalidad
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Panel de Administración
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              selected={isActiveRoute(item.href)}
              sx={{
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActiveRoute(item.href) ? 'white' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActiveRoute(item.href) ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Municipalidad
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default AdminSidebar;
