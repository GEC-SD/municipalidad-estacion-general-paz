const classes = {
  // Header
  header: {
    backgroundColor: 'primary.main',
    color: 'white',
    boxShadow: 2,
  },
  headerToolbar: {
    minHeight: { xs: '64px', md: '80px' },
    px: { xs: 2, md: 4 },
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    textDecoration: 'none',
    color: 'white',
  },
  logoText: {
    display: { xs: 'none', sm: 'block' },
  },
  logoTitle: {
    fontWeight: 700,
    fontSize: { xs: '1rem', md: '1.25rem' },
    lineHeight: 1.2,
  },
  logoSubtitle: {
    fontSize: { xs: '0.75rem', md: '0.875rem' },
    opacity: 0.9,
  },
  desktopNav: {
    display: { xs: 'none', md: 'flex' },
    gap: 1,
    ml: 4,
  },
  navButton: {
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  loginButton: {
    ml: 'auto',
    color: 'white',
    borderColor: 'white',
    '&:hover': {
      borderColor: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  mobileMenuButton: {
    display: { xs: 'flex', md: 'none' },
    ml: 'auto',
    color: 'white',
  },

  // Mobile Drawer
  drawer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  drawerHeader: {
    p: 2,
    backgroundColor: 'primary.main',
    color: 'white',
  },
  drawerList: {
    width: '100%',
  },
  drawerListItem: {
    '&:hover': {
      backgroundColor: 'action.hover',
    },
  },
  drawerLoginButton: {
    m: 2,
    borderColor: 'primary.main',
  },

  // Footer
  footer: {
    backgroundColor: 'primary.dark',
    color: 'white',
    py: 6,
    mt: 'auto',
  },
  footerContainer: {
    maxWidth: 1440,
    mx: 'auto',
    px: { xs: 2, md: 4 },
  },
  footerTitle: {
    fontWeight: 600,
    mb: 2,
    fontSize: '1.125rem',
  },
  footerLink: {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    display: 'block',
    transition: 'color 0.2s',
  },
  footerSocialIcons: {
    display: 'flex',
    gap: 1,
    mt: 2,
  },
  footerSocialIcon: {
    color: 'white',
    '&:hover': {
      color: 'secondary.main',
    },
  },
  footerBottom: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    mt: 4,
    pt: 3,
    textAlign: 'center',
  },
  footerCopyright: {
    opacity: 0.8,
    fontSize: '0.875rem',
  },
  footerSocialStrip: {
    backgroundColor: 'secondary.main',
    color: 'white',
    py: 3,
  },

  // Hero Carousel
  heroCarousel: {
    position: 'relative',
    width: '100%',
    height: { xs: '50vh', md: '60vh' },
    minHeight: { xs: 350, md: 450 },
    overflow: 'hidden',
    backgroundColor: 'primary.dark',
  },
  heroCarouselSlide: {
    position: 'absolute',
    inset: 0,
    transition: 'opacity 0.8s ease-in-out',
  },
  heroCarouselOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(26,95,139,0.9) 0%, rgba(46,134,193,0.75) 50%, rgba(26,95,139,0.85) 100%)',
  },
  heroCarouselContent: {
    position: 'relative',
    zIndex: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: 'white',
  },
  heroCarouselDots: {
    position: 'absolute',
    bottom: { xs: 16, md: 24 },
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 1,
    zIndex: 3,
  },
  heroCarouselDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.4)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
    p: 0,
    minWidth: 0,
  },
  heroCarouselDotActive: {
    backgroundColor: 'white',
    transform: 'scale(1.3)',
  },
  heroCarouselArrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 3,
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(4px)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.3)',
    },
  },

  // Quick Access Bar
  quickAccessBar: {
    py: { xs: 3, md: 0 },
    mt: { xs: 0, md: -5 },
    position: 'relative',
    zIndex: 10,
  },
  quickAccessGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(3, 1fr)',
      sm: 'repeat(3, 1fr)',
      md: 'repeat(6, 1fr)',
    },
    gap: { xs: 2, md: 3 },
  },
  quickAccessItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1,
    color: 'text.primary',
    transition: 'transform 0.3s ease',
    py: 1,
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  quickAccessIcon: {
    width: { xs: 52, md: 64 },
    height: { xs: 52, md: 64 },
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
  },

  // Navigation Dropdowns
  navButtonWrapper: {
    position: 'relative',
    display: 'inline-flex',
  },
  navDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    minWidth: 220,
    backgroundColor: 'white',
    borderRadius: '0 0 8px 8px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    py: 1,
    opacity: 0,
    transform: 'translateY(-8px)',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    pointerEvents: 'none',
    zIndex: 100,
  },
  navDropdownVisible: {
    opacity: 1,
    transform: 'translateY(0)',
    pointerEvents: 'auto',
  },
  navDropdownItem: {
    px: 3,
    py: 1.5,
    color: 'text.primary',
    textDecoration: 'none',
    display: 'block',
    transition: 'background-color 0.2s, color 0.2s',
    fontSize: '0.9rem',
    '&:hover': {
      backgroundColor: 'grey.100',
      color: 'primary.main',
    },
  },

  // Emergency Phones
  emergencySection: {
    backgroundColor: 'primary.dark',
    color: 'white',
    py: { xs: 6, md: 8 },
  },
  emergencyCard: {
    p: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
  },
  emergencyIcon: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    animation: 'subtlePulse 2s ease-in-out infinite',
  },

  // News Card
  newsCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    },
  },
  newsCardActionArea: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  newsCardDateBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    px: 1.5,
    py: 0.5,
    borderRadius: 1,
  },
  newsCardTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: '3em',
  },
  newsCardExcerpt: {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  // Service Card (home page)
  serviceCard: {
    p: 3,
    textAlign: 'center',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    borderTop: '4px solid transparent',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    },
  },

  serviceIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mb: 2,
    transition: 'transform 0.3s ease',
  },

  // Quick Link Card
  quickLinkCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 3,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    },
  },

  // Institutional Banner
  institutionalBanner: {
    py: { xs: 6, md: 8 },
    backgroundColor: 'grey.50',
  },
  institutionalBannerContent: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
    gap: { xs: 4, md: 6 },
    alignItems: 'center',
  },
};

export default classes;
