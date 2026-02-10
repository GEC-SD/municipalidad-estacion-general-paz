'use client';

import { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import { MAIN_MENU, PUBLIC_ROUTES } from '@/constants';
import classes from './classes';

const Header = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <Box sx={classes.drawerHeader}>
        <Box sx={classes.logo}>
          <Image
            src="/logo.webp"
            alt="Escudo Estación General Paz"
            width={36}
            height={44}
            style={{ objectFit: 'contain' }}
          />
          <Box>
            <Typography sx={classes.logoTitle}>
              Municipalidad de
            </Typography>
            <Typography sx={classes.logoSubtitle}>
              Estación General Paz
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={classes.drawerList}>
        {MAIN_MENU.map((item) => (
          <Box key={item.label}>
            <ListItem disablePadding>
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
                      sx={{ pl: 4 }}
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

      <Button
        variant="outlined"
        component={Link}
        href={PUBLIC_ROUTES.LOGIN}
        sx={classes.drawerLoginButton}
        fullWidth
      >
        Acceso Admin
      </Button>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          ...classes.header,
          boxShadow: scrolled ? 4 : 2,
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
          backgroundColor: scrolled ? 'rgba(46,134,193,0.95)' : 'primary.main',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar
          sx={{
            ...classes.headerToolbar,
            minHeight: scrolled
              ? { xs: '56px', md: '64px' }
              : { xs: '64px', md: '80px' },
            transition: 'min-height 0.3s ease',
          }}
        >
          <Link href={PUBLIC_ROUTES.HOME} style={{ textDecoration: 'none' }}>
            <Box sx={classes.logo}>
              <Image
                src="/logo.webp"
                alt="Escudo Estación General Paz"
                width={scrolled ? 32 : 40}
                height={scrolled ? 38 : 48}
                style={{ objectFit: 'contain', transition: 'all 0.3s ease' }}
                priority
              />
              <Box sx={classes.logoText}>
                <Typography sx={classes.logoTitle}>
                  Municipalidad de
                </Typography>
                <Typography sx={classes.logoSubtitle}>
                  Estación General Paz
                </Typography>
              </Box>
            </Box>
          </Link>

          {/* Desktop Navigation */}
          <Box sx={classes.desktopNav}>
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
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    }),
                  }}
                >
                  {item.label}
                </Button>
              )
            )}
          </Box>

          <Button
            variant="outlined"
            component={Link}
            href={PUBLIC_ROUTES.LOGIN}
            sx={{
              ...classes.loginButton,
              display: { xs: 'none', md: 'inline-flex' },
            }}
          >
            Acceso Admin
          </Button>

          {/* Mobile Menu Button */}
          <IconButton
            onClick={handleDrawerToggle}
            sx={classes.mobileMenuButton}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
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
