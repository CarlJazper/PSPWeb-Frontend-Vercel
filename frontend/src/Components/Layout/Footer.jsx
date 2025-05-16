import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#f5f5f5',
                padding: 2,
                textAlign: 'center',
                marginTop: 'auto',
                borderTop: '1px solid #ddd',
            }}
        >
            <Typography variant="body2" color="textSecondary">
                PSP-Taguig - 2023-2024, All Rights Reserved
            </Typography>
        </Box>
    );
};

export default Footer;
