import React, { useState } from 'react';
import {
  Box,
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Footer = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null); // 'about' or 'terms'

  const handleOpen = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setDialogType(null);
  };

  const getDialogContent = () => {
    if (dialogType === 'about') {
      return (
        <>
          <Typography variant="body1" gutterBottom>
            PSP-Taguig is a dedicated platform committed to delivering high-quality services and experiences to our members. Our team continuously works to innovate and support our growing community.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            For inquiries, collaborations, or feedback, feel free to contact us through our official channels.
          </Typography>
        </>
      );
    }

    if (dialogType === 'terms') {
      return (
        <>
          <Typography variant="h6" gutterBottom>
            Terms and Conditions
          </Typography>
          <Typography variant="body2" paragraph>
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            1. Use of Service
          </Typography>
          <Typography variant="body2" paragraph>
            You agree to use the service only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the service.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            2. Intellectual Property
          </Typography>
          <Typography variant="body2" paragraph>
            All content on this site, including text, graphics, logos, and images, is the property of PSP-Taguig or its content suppliers and is protected by copyright laws.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            3. Privacy Policy
          </Typography>
          <Typography variant="body2" paragraph>
            We respect your privacy and are committed to protecting your personal data. Please refer to our Privacy Policy for more details on how we collect and use information.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            4. Limitation of Liability
          </Typography>
          <Typography variant="body2" paragraph>
            PSP-Taguig shall not be liable for any indirect, incidental, or consequential damages arising out of or in connection with the use of our services.
          </Typography>

          <Typography variant="body2" paragraph>
            These terms are subject to change at any time without prior notice.
          </Typography>
        </>
      );
    }

    return null;
  };

  return (
    <>
      <Box
        component="footer"
        sx={{
          backgroundColor: '#f5f5f5',
          padding: 2,
          textAlign: 'center',
          borderTop: '1px solid #ddd',
          mt: 'auto',
        }}
      >
        <Typography variant="body2" color="textSecondary">
          PSP-Taguig - 2023–2024, All Rights Reserved
        </Typography>
        <Box mt={1}>
          <Link
            component="button"
            variant="body2"
            onClick={() => handleOpen('about')}
            sx={{ marginRight: 2 }}
          >
            About
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={() => handleOpen('terms')}
          >
            Terms & Conditions
          </Link>
        </Box>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          {dialogType === 'about' ? 'About Us' : 'Terms & Conditions'}
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText component="div">
            {getDialogContent()}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;
