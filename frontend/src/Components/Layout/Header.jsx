import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Menu, MenuItem, Typography, IconButton, Avatar, Box } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUser, logout } from '../../utils/helpers';

const Header = () => {
    const [user, setUser] = useState(getUser());
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setUser(getUser());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const logoutHandler = () => {
        logout(() => navigate('/'));
        toast.success('Logged out', { position: 'bottom-right' });
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Check if link is active
    const isActive = (path) => location.pathname === path;

    // Styles for nav links
    const navLinkStyle = {
        color: 'white',
        fontSize: '1.2rem',
        textTransform: 'none',
        '&:hover': { color: 'yellow', opacity: 0.7 },
    };

    // Define nav links based on user role
    const navLinks = user?.role === 'admin'
        ? [
            { name: 'Dashboard', path: '/admin/dashboard' },
            // { name: 'Reports', path: '/admin/reports' },
            // { name: 'Streams', path: '/admin/streams' },
        ]
        : [
            { name: 'Home', path: '/' },
            { name: user ? 'Classes' : 'Services', path: user ? '/classes' : '/services' },
            { name: 'Coaches', path: '/coaches' },
            { name: 'Memberships', path: '/memberships' },
            { name: 'Exercises', path: '/exercises' },
            { name: 'Map', path: '/map' },
        ];

    return (
        <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', pt: 1 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                
                {/* Circular Logo */}
                <Box sx={{ width: 60, height: 60, borderRadius: '50%', overflow: 'hidden' }}>
                <Link to={user?.role === 'admin' ? "admin/dashboard" : "/"}>
                        <img 
                            src={`/images/psp-logo.png`} 
                            alt="Logo" 
                            width="100%" 
                            height="100%" 
                            style={{ objectFit: 'cover' }} 
                        />
                    </Link>
                </Box>

                {/* Navigation Links (Center) */}
                <Box sx={{ display: 'flex', gap: 3 }}>
                    {navLinks.map((link) => (
                        <Button 
                            key={link.path}
                            component={Link} 
                            to={link.path} 
                            sx={{ 
                                ...navLinkStyle,
                                borderBottom: isActive(link.path) ? '2px solid white' : 'none' 
                            }}
                        >
                            {link.name}
                        </Button>
                    ))}
                </Box>

                {/* Login/Profile menu*/}
                <Box>
                    {user ? (
                        <>
                            <IconButton onClick={handleMenuClick}>
                                <Avatar alt={user.name} src={user?.image[0]?.url} />
                            </IconButton>

                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                <MenuItem onClick={handleMenuClose}>
                                    <Link to="/me">Profile</Link>
                                </MenuItem>
                                <MenuItem onClick={logoutHandler}>
                                    <Typography color="error">Logout</Typography>
                                </MenuItem>
                            </Menu>
                            
                        </>
                    ) : (
                        <Link to="/login">
                            <Button variant="contained" sx={{ backgroundColor: '#1976d2', color: 'white' }}>
                                Login
                            </Button>
                        </Link>
                    )}
                </Box>

            </Toolbar>
        </AppBar>
    );
};

export default Header;
