import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Button,
    Menu,
    MenuItem,
    Typography,
    IconButton,
    Avatar,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUser, logout } from '../../utils/helpers';

const Header = () => {
    const [user, setUser] = useState(getUser());
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // ✅ Update user when route changes (login/logout reflects immediately)
    useEffect(() => {
        setUser(getUser());
    }, [location.pathname]);

    // ✅ Reset menu when user changes
    useEffect(() => {
        setAnchorEl(null);
    }, [user]);

    const logoutHandler = () => {
        logout(() => navigate('/'));
        toast.success('Logged out', { position: 'bottom-right' });
    };

    const handleMenuClick = (event) => {
        if (event.currentTarget instanceof HTMLElement) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleMenuClose = () => setAnchorEl(null);

    const isActive = (path) => location.pathname === path;

    const navLinkStyle = {
        color: 'white',
        fontSize: '1.3rem',
        textTransform: 'none',
        '&:hover': { color: 'yellow', opacity: 0.7 },
    };

    const navLinks = (() => {
        if (user?.role === 'superadmin') {
            return [{ name: 'Dashboard', path: '/admin/super-dashboard' }];
        }

        if (user?.role === 'admin') {
            return [{ name: 'Dashboard', path: '/admin/dashboard' }];
        }

        return [
            { name: 'Home', path: '/' },
            { name: user ? 'Classes' : 'Services', path: user ? '/classes' : '/services' },
            { name: 'Coaches', path: '/coaches' },
            { name: 'Memberships', path: '/memberships' },
            { name: 'Exercises', path: '/exercises' },
            { name: 'Map', path: '/map' },
        ];
    })();

    const drawerContent = (
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setMobileOpen(false)}>
            <List>
                {navLinks.map((link) => (
                    <ListItem key={link.path} component={Link} to={link.path} button>
                        <ListItemText
                            primary={link.name}
                            primaryTypographyProps={{
                                fontWeight: isActive(link.path) ? 'bold' : 'normal',
                                color: isActive(link.path) ? '#C09721' : 'inherit'
                            }}
                        />
                    </ListItem>
                ))}
                {user ? (
                    <>
                        <ListItem component={Link} to="/me" button>
                            <ListItemText primary="Profile" />
                        </ListItem>
                        <ListItem button onClick={() => setShowQR(true)}>
                            <ListItemText primary="QR Code" />
                        </ListItem>
                        <ListItem button onClick={logoutHandler}>
                            <ListItemText primary={<Typography color="error">Logout</Typography>} />
                        </ListItem>
                    </>
                ) : (
                    <ListItem component={Link} to="/login" button>
                        <ListItemText primary="Login" />
                    </ListItem>
                )}
            </List>
        </Box>
    );

    const logoLink = user?.role === 'superadmin'
        ? '/admin/super-dashboard'
        : user?.role === 'admin'
            ? '/admin/dashboard'
            : '/';

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', pt: 1 }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ width: 60, height: 60, borderRadius: '50%', overflow: 'hidden' }}>
                        <Link to={logoLink}>
                            <img
                                src="/images/psp-logo.png"
                                alt="Logo"
                                width="100%"
                                height="100%"
                                style={{ objectFit: 'cover' }}
                            />
                        </Link>
                    </Box>

                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 3 }}>
                            {navLinks.map((link) => (
                                <Button
                                    key={link.path}
                                    component={Link}
                                    to={link.path}
                                    sx={{
                                        ...navLinkStyle,
                                        borderBottom: isActive(link.path) ? '2px solid white' : 'none',
                                    }}
                                >
                                    {link.name}
                                </Button>
                            ))}
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {!isMobile && user && (
                            <>
                                <IconButton onClick={handleMenuClick}>
                                    <Avatar
                                        alt={user.name}
                                        src={user?.image?.[0]?.url}
                                        sx={{
                                            bgcolor: !user?.image?.[0]?.url ? '#C09721' : undefined,
                                            color: !user?.image?.[0]?.url ? 'white' : undefined,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {!user?.image?.[0]?.url &&
                                            user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </Avatar>
                                </IconButton>

                                {anchorEl instanceof HTMLElement && (
                                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                        <MenuItem onClick={handleMenuClose} component={Link} to="/me">
                                            Profile
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                setShowQR(true);
                                                handleMenuClose();
                                            }}
                                        >
                                            QR Code
                                        </MenuItem>
                                        <MenuItem onClick={logoutHandler}>
                                            <Typography color="error">Logout</Typography>
                                        </MenuItem>
                                    </Menu>
                                )}
                            </>
                        )}
                        {!isMobile && !user && (
                            <Button
                                variant="contained"
                                component={Link}
                                to="/login"
                                sx={{
                                    backgroundColor: '#C09721',
                                    color: 'white',
                                    borderRadius: '10px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: '#fff',
                                        color: '#C09721',
                                    },
                                }}
                            >
                                Login
                            </Button>
                        )}
                        {isMobile && (
                            <IconButton
                                edge="end"
                                color="inherit"
                                aria-label="menu"
                                onClick={() => setMobileOpen(true)}
                                sx={{ ml: 1 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
                {drawerContent}
            </Drawer>

            {showQR && (
                <Box
                    onClick={() => setShowQR(false)}
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        bgcolor: 'rgba(0, 0, 0, 0.8)',
                        zIndex: 1300,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <Box
                        component="img"
                        src="/images/qr.png"
                        alt="QR Code"
                        sx={{
                            width: { xs: '200px', md: '300px' },
                            height: 'auto',
                            borderRadius: 2,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                    />
                </Box>
            )}
        </>
    );
};

export default Header;
