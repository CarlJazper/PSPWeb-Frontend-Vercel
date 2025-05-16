import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Card, CardContent, Typography, Button, CircularProgress, Divider } from '@mui/material';
import { Group, Store, FitnessCenter, Person } from '@mui/icons-material'; // Added Person icon for trainers
import { getToken } from '../../utils/helpers';
import baseURL from '../../utils/baseURL';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    Container,
    CardHeader,
    Tabs,
    Tab,
    IconButton,
    Collapse,
    useTheme,
    Paper,
    styled,
} from '@mui/material';
import {
    BarChart as ChartIcon,
    MonitorWeight as GymIcon,
    People as UserIcon,
    AttachMoney as SalesIcon,
    Diversity3 as SessionIcon,
    Paid as SessionSaleIcon,
    Refresh as RefreshIcon,
    ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import LogCharts from './Reports/LogCharts';
import UserLog from './Reports/UserLogs';
import MembershipSales from './Reports/MembershipSales';
import GymMonitoring from './Reports/GymMonitoring';
import TrainingSessions from './Reports/TrainingSession';
import SessionSales from './Reports/SessionSales';

const StyledContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(4),
    background: '#111A24',
    minHeight: '100vh',
    borderRadius: theme.spacing(2),
}));

const HeaderCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    background: '#FFAC1C',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(4),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    minHeight: 60,
    fontWeight: 600,
    fontSize: '0.9rem',
    textTransform: 'none',
    borderRadius: theme.spacing(1),
    margin: theme.spacing(0, 0.5),
    color: '#64748b',
    '&.Mui-selected': {
        color: '#1a237e',
        background: 'rgba(26, 35, 126, 0.1)',
    },
    '&:focus': {
        outline: 'none',
    },
    '&.Mui-focusVisible': {
        outline: 'none',
        backgroundColor: 'rgba(26, 35, 126, 0.05)',
    },
}));

const StyledCard = styled(Card)(({ theme }) => ({
    background: '#ffffff',
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
    marginBottom: theme.spacing(3),
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    background: '#f1f5f9',
    padding: theme.spacing(2),
    '& .MuiCardHeader-title': {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#334155',
    },
}));

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`report-tabpanel-${index}`}
            aria-labelledby={`report-tab-${index}`}
            style={{ outline: 'none' }}
            {...other}
        >
            {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
        </div>
    );
}

const Dashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [branchesCount, setBranchesCount] = useState(0);
  const [exercisesCount, setExercisesCount] = useState(0);
  const [trainersCount, setTrainersCount] = useState(0);

    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${getToken()}` } };

            const { data: usersData } = await axios.get(`${baseURL}/users/get-all-users`, config);
            setAllUsers(usersData.users);

            const { data: branchesData } = await axios.get(`${baseURL}/branch/get-all-branches`);
            setBranchesCount(branchesData.branch.length);

            const { data: exercisesData } = await axios.get(`${baseURL}/exercises/get-all-exercise`);
            setExercisesCount(exercisesData.exercises.length);

            const { data: trainersData } = await axios.get(`${baseURL}/availTrainer/get-all-trainers`);
            setTrainersCount(trainersData.length);

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const renderStatCard = (title, value, icon, gradient, link) => (
        <Grid item xs={12} sm={6} md={3}>
            <Card
                sx={{
                    background: gradient,
                    color: '#fff',
                    borderRadius: 2,
                    boxShadow: 5,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { transform: 'scale(1.05)' },
                }}
            >
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">{title}</Typography>
                        {icon}
                    </Box>
                    <Divider sx={{ background: 'rgba(255,255,255,0.3)', mb: 2 }} />
                    <Typography variant="h4" align="center">
                        {value}
                    </Typography>
                </CardContent>
                {link && (
                    <Button
                        component={Link}
                        to={link}
                        sx={{ justifyContent: 'center', width: '100%', color: '#fff', textTransform: 'none' }}
                        variant="text"
                    >
                        View Details
                    </Button>
                )}
            </Card>
        </Grid>
    );

    const [tabValue, setTabValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [expanded, setExpanded] = useState({
        charts: true,
        gym: true,
        users: true,
        sales: true,
        sessions: true,
        sessionsales: true,
    });

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleRefresh = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
    };

    const handleExpand = (section) => {
        setExpanded(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const reportSections = [
        {
            id: 'charts',
            title: 'Log Charts',
            icon: <ChartIcon />,
            component: <LogCharts />,
            color: '#2e7d32',
        },
        {
            id: 'users',
            title: 'User Logs',
            icon: <UserIcon />,
            component: <UserLog />,
            color: '#7b1fa2',
        },
        {
            id: 'gym',
            title: 'Gym Monitoring',
            icon: <GymIcon />,
            component: <GymMonitoring />,
            color: '#1565c0',
        },
        {
            id: 'sales',
            title: 'Membership Sales',
            icon: <SalesIcon />,
            component: <MembershipSales />,
            color: '#c62828',
        },
        {
            id: 'sessions',
            title: 'Training Sessions',
            icon: <SessionIcon />,
            component: <TrainingSessions />,
            color: '#c62828',
        },
        {
            id: 'sessionsales',
            title: 'Session Sales',
            icon: <SessionSaleIcon />,
            component: <SessionSales />,
            color: '#c62828',
        },
    ];

    return (
        <>
            <Box display="flex">
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
                        Dashboard
                    </Typography>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {renderStatCard(
                                'Users',
                                allUsers.length,
                                <Group sx={{ fontSize: 40 }} />,
                                'linear-gradient(to right, #2196f3, #64b5f6)',
                                '/admin/users'
                            )}
                            {renderStatCard(
                                'Branches',
                                branchesCount,
                                <Store sx={{ fontSize: 40 }} />,
                                'linear-gradient(to right, #ff9800, #ffb74d)',
                                '/admin/branches'
                            )}
                            {renderStatCard(
                                'Exercises',
                                exercisesCount,
                                <FitnessCenter sx={{ fontSize: 40 }} />,
                                'linear-gradient(to right, #4caf50, #81c784)',
                                '/admin/exercises'
                            )}
                            {renderStatCard(
                                'Trainers',
                                trainersCount,
                                <Person sx={{ fontSize: 40 }} />, // 👤 Person icon for trainers
                                'linear-gradient(to right, #9c27b0, #ba68c8)',
                                '/admin/trainers' // Navigates to Trainers List page
                            )}
                        </Grid>
                    )}
                </Box>
            </Box>
            <StyledContainer maxWidth="lg"> 
                <HeaderCard elevation={0}>
                    <Typography
                        variant="h4"
                        sx={{
                            color: '#000',
                            fontWeight: 700,
                        }}
                    >
                        Reports
                    </Typography>
                    <IconButton
                        onClick={handleRefresh}
                        disabled={isLoading}
                        sx={{
                            color: '#000',
                            '&:hover': {
                                background: 'rgba(255,255,255,0.1)',
                            },
                        }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : <RefreshIcon />}
                    </IconButton>
                </HeaderCard>

                <Paper
                    sx={{
                        borderRadius: 2,
                        mb: 4,
                        background: '#ffffff',
                        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
                    }}
                >
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        centered
                        sx={{
                            px: 2,
                            py: 1,
                            '& .MuiTabs-indicator': {
                                height: 3,
                                borderRadius: '3px',
                                backgroundColor: '#1a237e',
                            },
                            '& .MuiTabs-flexContainer': {
                                justifyContent: 'center',
                            },
                            '& .MuiButtonBase-root': {
                                '&:focus': {
                                    outline: 'none',
                                },
                            },
                        }}
                    >
                        {reportSections.map((section, index) => (
                            <StyledTab
                                key={section.id}
                                icon={React.cloneElement(section.icon, {
                                    sx: { color: section.color }
                                })}
                                label={section.title}
                                id={`report-tab-${index}`}
                            />
                        ))}
                    </Tabs>
                </Paper>

                {reportSections.map((section, index) => (
                    <TabPanel key={section.id} value={tabValue} index={index}>
                        <StyledCard>
                            <StyledCardHeader
                                title={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {React.cloneElement(section.icon, {
                                            sx: { color: section.color, fontSize: 28 }
                                        })}
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: '#334155',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {section.title}
                                        </Typography>
                                    </Box>
                                }
                                action={
                                    <IconButton
                                        onClick={() => handleExpand(section.id)}
                                        sx={{
                                            color: '#64748b',
                                            transform: expanded[section.id] ? 'rotate(180deg)' : 'rotate(0)',
                                            transition: 'transform 0.3s',
                                        }}
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                                }
                            />
                            <Collapse in={expanded[section.id]} timeout="auto" unmountOnExit>
                                <CardContent sx={{ p: 3, backgroundColor: '#ffffff' }}>
                                    {section.component}
                                </CardContent>
                            </Collapse>
                        </StyledCard>
                    </TabPanel>
                ))}
            </StyledContainer>
        </>
    );
};

export default Dashboard;
