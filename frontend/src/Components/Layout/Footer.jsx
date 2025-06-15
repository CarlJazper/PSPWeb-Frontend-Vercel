import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  Box, Typography, Link, Dialog, DialogTitle, DialogContent, IconButton,
  Slide, CircularProgress, Divider, Container, Grid, Fade, Zoom
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const About = lazy(() => import('../../Components/About'));
const Terms = lazy(() => import('../../Components/Terms'));

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const socialHover = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-3px); }
`;

const StyledFooter = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #fef8e0 0%, #f5f0d8 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""', position: 'absolute', top: 0, left: 0, right: 0,
    height: '1px', background: 'linear-gradient(90deg, transparent, #e0e0e0, transparent)'
  },
  '&::after': {
    content: '""', position: 'absolute', top: '-50%', left: '-50%',
    width: '200%', height: '200%',
    background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
    animation: `${pulse} 8s ease-in-out infinite`,
    pointerEvents: 'none'
  }
}));

const AnimatedSection = styled(Box)(({ delay = 0 }) => ({
  animation: `${fadeInUp} 0.8s ease-out ${delay}s both`
}));

const SocialIcon = styled(IconButton)(({ theme, color }) => ({
  margin: theme.spacing(0, 0.5),
  padding: theme.spacing(1),
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: color || theme.palette.primary.main,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: color || theme.palette.primary.main,
    color: 'white',
    transform: 'translateY(-3px)',
    boxShadow: `0 8px 25px rgba(0, 0, 0, 0.15)`,
    animation: `${socialHover} 0.3s ease-out`
  },
  '&:active': { transform: 'translateY(-1px)' }
}));

const StyledLink = styled(Link)(({ theme }) => ({
  position: 'relative', textDecoration: 'none',
  color: theme.palette.text.primary, fontWeight: 500,
  padding: theme.spacing(0.5, 0), transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&::after': {
    content: '""', position: 'absolute', bottom: 0, left: 0,
    width: '0%', height: '2px', backgroundColor: theme.palette.primary.main,
    transition: 'width 0.3s ease'
  },
  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'translateX(5px)',
    '&::after': { width: '100%' }
  }
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex', alignItems: 'center',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: 'translateX(5px)'
  }
}));

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const Footer = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleClose = () => setOpenDialog(false);
  const handleExited = () => setDialogType(null);
  const getTitle = () => (dialogType === 'about' ? 'About Us' : 'Terms & Conditions');
  const getContent = () => (dialogType === 'about' ? <About /> : <Terms />);

  const socialLinks = [
    { icon: FacebookIcon, url: 'https://www.facebook.com/philsportsperformancenatiowide/', color: '#1877F2', label: 'Facebook' },
    { icon: InstagramIcon, url: '#', color: '#E4405F', label: 'Instagram' },
    { icon: TwitterIcon, url: '#', color: '#1DA1F2', label: 'Twitter' },
    { icon: YouTubeIcon, url: '#', color: '#FF0000', label: 'YouTube' }
  ];

  return (
    <>
      <StyledFooter component="footer" sx={{ py: 6, px: 2, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Fade in={isVisible} timeout={1000}>
            <Grid container spacing={4} justifyContent="space-between">
              <Grid item xs={12} md={4}>
                <AnimatedSection delay={0.1}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <FitnessCenterIcon sx={{ fontSize: 32, color: '#000', mr: 1, animation: `${pulse} 2s ease-in-out infinite` }} />
                    <Typography variant="h5" fontWeight="bold" color="#C09721">PSP-Taguig</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    Empowering athletes and fitness enthusiasts to reach their peak performance through professional training and state-of-the-art facilities.
                  </Typography>
                </AnimatedSection>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <AnimatedSection delay={0.2}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">Quick Links</Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <StyledLink component="button" variant="body2" onClick={() => handleOpen('about')}>About Us</StyledLink>
                    <StyledLink component="button" variant="body2" onClick={() => handleOpen('terms')}>Terms & Conditions</StyledLink>
                    <StyledLink component="button" variant="body2" onClick={() => {}}>Privacy Policy</StyledLink>
                  </Box>
                </AnimatedSection>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AnimatedSection delay={0.3}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">Contact Info</Typography>
                  <ContactItem><LocationOnIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} /><Typography variant="body2" color="text.secondary">Taguig City, Philippines</Typography></ContactItem>
                  <ContactItem><PhoneIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} /><Typography variant="body2" color="text.secondary">+63 (02) 123-4567</Typography></ContactItem>
                  <ContactItem><EmailIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} /><Typography variant="body2" color="text.secondary">info@psp-taguig.com</Typography></ContactItem>
                </AnimatedSection>
              </Grid>

              <Grid item xs={12} md={3}>
                <AnimatedSection delay={0.4}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">Follow Us</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Stay connected for updates and fitness tips</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {socialLinks.map((social, index) => (
                      <Zoom key={social.label} in={isVisible} timeout={1000 + index * 200}>
                        <SocialIcon component="a" href={social.url} target="_blank" rel="noopener noreferrer" color={social.color} aria-label={`Visit our ${social.label} page`}>
                          <social.icon fontSize="small" />
                        </SocialIcon>
                      </Zoom>
                    ))}
                  </Box>
                </AnimatedSection>
              </Grid>
            </Grid>
          </Fade>

          <Fade in={isVisible} timeout={1500}>
            <Box mt={4} pt={3}>
              <Divider sx={{ mb: 3, opacity: 0.3 }} />
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" gap={2}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  © {new Date().getFullYear()} PSP-Taguig. All Rights Reserved.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
                  Made with ❤️ for fitness enthusiasts
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Container>
      </StyledFooter>

      <Dialog open={openDialog} onClose={handleClose} onExited={handleExited} maxWidth="md" fullWidth scroll="paper" TransitionComponent={Transition} PaperProps={{
        sx: {
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }
      }} BackdropProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(5px)' } }}>
        <DialogTitle sx={{ position: 'relative', background: 'linear-gradient(135deg, #fef8e0 0%, #f5f0d8 100%)', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', fontWeight: 'bold', fontSize: '1.5rem' }}>
          {getTitle()}
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, backgroundColor: 'rgba(255, 255, 255, 0.8)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'rotate(90deg)' }, transition: 'all 0.3s ease' }} aria-label="close dialog">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3, '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '4px', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.5)' } } }}>
          <Suspense fallback={<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" py={8} gap={2}><CircularProgress size={40} thickness={4} /><Typography variant="body2" color="text.secondary">Loading content...</Typography></Box>}>
            {getContent()}
          </Suspense>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;
