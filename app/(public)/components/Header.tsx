'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Collapse,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { MAIN_MENU, PUBLIC_ROUTES } from '@/constants';
import classes from './classes';

const Header = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const drawer = (
    <Box sx={classes.drawer}>
      <Link
        href={PUBLIC_ROUTES.MUNICIPALIDAD_DEPARTAMENTO_EJECUTIVO}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '50%',
              width: 70,
              height: 70,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.08)' },
            }}
          >
            <Image
              src="/Intendente-Dario.webp"
              alt="Intendente Dario"
              width={70}
              height={70}
              style={{ objectFit: 'cover' }}
            />
          </Box>
        </Box>
      </Link>

      <List sx={classes.drawerList}>
        {MAIN_MENU.map((item) => (
          <Box key={item.label}>
            <ListItem disablePadding sx={item.label === 'Inicio' ? classes.listItemHome : classes.listItem}>
              {item.children ? (
                <ListItemButton
                  onClick={() => handleMenuClick(item.label)}
                  sx={classes.drawerListItem}
                >
                  <ListItemText primary={item.label} />
                  {expandedMenu === item.label ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </ListItemButton>
              ) : (
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={handleDrawerToggle}
                  selected={isActiveRoute(item.href)}
                  sx={classes.drawerListItem}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              )}
            </ListItem>

            {item.children && (
              <Collapse
                in={expandedMenu === item.label}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.label}
                      component={Link}
                      href={child.href}
                      onClick={handleDrawerToggle}
                      selected={isActiveRoute(child.href)}
                      sx={classes.drawerListItemCollapse}
                    >
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', mt: 2 }}>
        {[
          { icon: <FacebookIcon />, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61569838749351' },
          { icon: <InstagramIcon />, label: 'Instagram', href: 'https://www.instagram.com/municipalidadgralpaz' },
          { icon: <WhatsAppIcon />, label: 'WhatsApp', href: 'https://whatsapp.com/channel/0029VbBA769DZ4LTG98htH0p' },
        ].map((social) => (
          <IconButton
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            sx={{
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.15)',
                backgroundColor: 'rgba(255,255,255,0.15)',
              },
            }}
          >
            {social.icon}
          </IconButton>
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          ...classes.header,
          top: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              ...classes.headerToolbar,
              minHeight: { xs: '100px', md: '100px' },
              transition: 'min-height 0.3s ease',
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: { xs: 'auto 1fr auto', md: '1fr auto 1fr' },
                alignItems: 'center',
              }}
            >
              <Box sx={{ justifySelf: 'start' }}>
                <Link href={PUBLIC_ROUTES.HOME} style={{ textDecoration: 'none' }}>
                  <Box sx={classes.logo}>
                    <Image
                      src="/logo.webp"
                      alt="Escudo Estación General Paz"
                      width={80}
                      height={85}
                      style={{ objectFit: 'contain', transition: 'all 0.3s ease' }}
                      priority
                    />
                    <Box sx={classes.logoText}>
                      <Typography sx={classes.logoTitle}>
                        Estación
                      </Typography>
                      <Typography sx={classes.logoTitle}>
                        General Paz
                      </Typography>
                      <Typography sx={classes.logoSubtitle}>
                        Municipalidad
                      </Typography>
                    </Box>
                  </Box>
                </Link>
              </Box>

              <Box sx={{ ...classes.desktopNav, justifySelf: 'center' }}>
                {MAIN_MENU.map((item) =>
                  item.children ? (
                    <Box
                      key={item.label}
                      sx={classes.navButtonWrapper}
                      onMouseEnter={() => setHoveredMenu(item.label)}
                      onMouseLeave={() => setHoveredMenu(null)}
                    >
                      <Button
                        component={Link}
                        href={item.href}
                        endIcon={
                          <KeyboardArrowDownIcon
                            sx={{
                              fontSize: '18px !important',
                              transition: 'transform 0.2s',
                              transform: hoveredMenu === item.label ? 'rotate(180deg)' : 'none',
                            }}
                          />
                        }
                        sx={{
                          ...classes.navButton,
                          ...(isActiveRoute(item.href) && {
                            color: 'primary.main',
                            fontWeight: 700,
                          }),
                        }}
                      >
                        {item.label}
                      </Button>
                      <Box
                        sx={{
                          ...classes.navDropdown,
                          ...(hoveredMenu === item.label && classes.navDropdownVisible),
                        }}
                      >
                        {item.children.map((child) => (
                          <Typography
                            key={child.label}
                            component={Link}
                            href={child.href}
                            sx={{
                              ...classes.navDropdownItem,
                              ...(isActiveRoute(child.href) && {
                                color: 'primary.main',
                                fontWeight: 600,
                              }),
                            }}
                          >
                            {child.label}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  ) : (
                    <Button
                      key={item.label}
                      component={Link}
                      href={item.href}
                      sx={{
                        ...classes.navButton,
                        ...(isActiveRoute(item.href) && {
                          color: 'primary.main',
                          fontWeight: 700,
                        }),
                      }}
                    >
                      {item.label}
                    </Button>
                  )
                )}
              </Box>

              <Box sx={{ justifySelf: 'end', display: 'flex', alignItems: 'center' }}>
                <Link
                  href={PUBLIC_ROUTES.MUNICIPALIDAD_DEPARTAMENTO_EJECUTIVO}
                  style={{ display: 'flex' }}
                >
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      alignItems: 'center',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      width: 70,
                      height: 70,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.08)' },
                    }}
                  >
                    <Image
                      src="/Intendente-Dario.webp"
                      alt="Intendente Dario"
                      width={70}
                      height={70}
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                </Link>

                <IconButton
                  onClick={handleDrawerToggle}
                  sx={classes.mobileMenuButton}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: { width: { xs: '85%', sm: 320 }, maxWidth: 360 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
