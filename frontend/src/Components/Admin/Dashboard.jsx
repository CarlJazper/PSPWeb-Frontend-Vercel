import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    Divider,
    Container,
    Tabs,
    Tab,
    IconButton,
    Collapse,
    Paper,
    styled,
    useTheme,
} from '@mui/material';
import {
    Group,
    Store,
    FitnessCenter,
    Person,
    BarChart as ChartIcon,
    MonitorWeight as GymIcon,
    People as UserIcon,
    AttachMoney as SalesIcon,
    Diversity3 as SessionIcon,
    Paid as SessionSaleIcon,
    Refresh as RefreshIcon,
    ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import axios from 'axios';

import { getToken } from '../../utils/helpers';
import baseURL from '../../utils/baseURL';

import LogCharts from './Reports/LogCharts';
import UserLog from './Reports/UserLogs';
import MembershipSales from './Reports/MembershipSales';
import GymMonitoring from './Reports/GymMonitoring';
import TrainingSessions from './Reports/TrainingSession';
import SessionSales from './Reports/SessionSales';

const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}));

const StatCard = styled(Card)(({ theme }) => ({
    background: '#fff',
    color: theme.palette.text.primary,
    borderRadius: '16px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.06)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.08)',
    },
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
}));

const StatCardContent = styled(CardContent)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
}));

const StatCardButton = styled(Button)(({ theme }) => ({
    justifyContent: 'center',
    width: '100%',
    color: '#007aff',
    textTransform: 'none',
    fontWeight: 500,
    padding: theme.spacing(1.5),
    borderTop: `1px solid ${theme.palette.divider}`,
    '&:hover': {
        background: 'rgba(0, 122, 255, 0.04)',
    },
}));

const ReportsHeader = styled(Box)(({ theme }) => ({
    background: '#FFD166',
    borderRadius: '12px',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    textAlign: 'center',
    position: 'relative',
}));

const ReportsTabsContainer = styled(Paper)(({ theme }) => ({
    borderRadius: '12px',
    background: '#ffffff',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
    padding: theme.spacing(0.5, 2),
    marginBottom: theme.spacing(2),
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    minHeight: 70,
    fontWeight: 500,
    fontSize: '0.9rem',
    textTransform: 'none',
    borderRadius: '8px',
    margin: theme.spacing(0.5, 0.5),
    color: '#515154',
    '&.Mui-selected': {
        color: '#007aff',
        background: 'rgba(0, 122, 255, 0.1)',
    },
    '&:focus': {
        outline: 'none',
    },
}));

const ReportItemCard = styled(Card)(({ theme }) => ({
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
    marginBottom: theme.spacing(3),
}));

const ReportItemCardHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.divider}`,
    background: '#fcfcfc',
}));

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index} id={`report-tabpanel-${index}`} aria-labelledby={`report-tab-${index}`}>
            {value === index && <Box sx={{ pt: 1 }}>{children}</Box>}
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
    const [tabValue, setTabValue] = useState(0);
    const [expanded, setExpanded] = useState({
        charts: true,
        gym: true,
        users: true,
        sales: true,
        sessions: true,
        sessionsales: true,
    });

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${getToken()}` } };
            const [usersRes, branchesRes, exercisesRes, trainersRes] = await Promise.all([
                axios.get(`${baseURL}/users/get-all-users`, config),
                axios.get(`${baseURL}/branch/get-all-branches`),
                axios.get(`${baseURL}/exercises/get-all-exercise`),
                axios.get(`${baseURL}/availTrainer/get-all-trainers`),
            ]);

            setAllUsers(usersRes.data.users);
            setBranchesCount(branchesRes.data.branch.length);
            setExercisesCount(exercisesRes.data.exercises.length);
            setTrainersCount(trainersRes.data.length);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const renderStatCard = (title, value, icon, accentColor, link, loading) => (
        <Grid item xs={12} sm={6} md={3}>
            <StatCard>
                <StatCardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {title}
                        </Typography>
                        {React.cloneElement(icon, { sx: { fontSize: 32, color: accentColor } })}
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="56px">
                        {loading ? (
                            <CircularProgress size={28} sx={{ color: '#007aff' }} />
                        ) : (
                            <Typography variant="h3" align="center" sx={{ fontWeight: 700 }}>
                                {value}
                            </Typography>
                        )}
                    </Box>
                </StatCardContent>
                {link && (
                    <StatCardButton component={Link} to={link}>
                        View Details
                    </StatCardButton>
                )}
            </StatCard>
        </Grid>
    );


    const handleTabChange = (_, newValue) => {
        setTabValue(newValue);
    };

    const handleExpand = (section) => {
        setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const reportSections = [
        { id: 'charts', title: 'Log Charts', icon: <ChartIcon />, component: <LogCharts />, color: '#34c759' },
        { id: 'users', title: 'User Logs', icon: <UserIcon />, component: <UserLog />, color: '#5856d6' },
        { id: 'gym', title: 'Gym Monitoring', icon: <GymIcon />, component: <GymMonitoring />, color: '#007aff' },
        { id: 'sales', title: 'Membership Sales', icon: <SalesIcon />, component: <MembershipSales />, color: '#ff9500' },
        { id: 'sessions', title: 'Training Sessions', icon: <SessionIcon />, component: <TrainingSessions />, color: '#ff3b30' },
        { id: 'sessionsales', title: 'Session Sales', icon: <SessionSaleIcon />, component: <SessionSales />, color: '#af52de' },
    ];

    return (
        <PageContainer>
            <Container maxWidth="xl">
                <Grid container spacing={3} sx={{ mb: 5 }}>
                    {renderStatCard('Users', allUsers.length, <Group />, '#007aff', '/admin/users', loading)}
                    {renderStatCard('Branches', branchesCount, <Store />, '#ff9500', '/admin/branches', loading)}
                    {renderStatCard('Exercises', exercisesCount, <FitnessCenter />, '#34c759', '/admin/exercises', loading)}
                    {renderStatCard('Trainers', trainersCount, <Person />, '#5856d6', '/admin/trainers', loading)}
                </Grid>

                <ReportsHeader>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#1d1d1f' }}>
                        Reports
                    </Typography>
                </ReportsHeader>

                <ReportsTabsContainer>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        aria-label="report tabs"
                        sx={{
                            '& .MuiTabs-indicator': {
                                height: 3,
                                borderRadius: '3px 3px 0 0',
                                backgroundColor: '#007aff',
                            },
                            '& .MuiTabs-flexContainer': {
                                justifyContent: 'center',
                                gap: '8px',
                            },
                        }}
                    >

                        {reportSections.map((section, index) => (
                            <StyledTab
                                key={section.id}
                                iconPosition="start"
                                icon={React.cloneElement(section.icon, {
                                    sx: { color: tabValue === index ? '#007aff' : section.color, mr: 1 },
                                })}
                                label={section.title}
                            />
                        ))}
                    </Tabs>
                </ReportsTabsContainer>

                {reportSections.map((section, index) => (
                    <TabPanel key={section.id} value={tabValue} index={index}>
                        <ReportItemCard>
                            <ReportItemCardHeader>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    {React.cloneElement(section.icon, {
                                        sx: { color: section.color, fontSize: 26 },
                                    })}
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {section.title}
                                    </Typography>
                                </Box>
                                <IconButton
                                    onClick={() => handleExpand(section.id)}
                                    aria-expanded={expanded[section.id]}
                                    sx={{
                                        color: '#515154',
                                        transform: expanded[section.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease',
                                        '&:hover': { background: 'rgba(0,0,0,0.04)' },
                                    }}
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                            </ReportItemCardHeader>
                            <Collapse in={expanded[section.id]} timeout="auto" unmountOnExit>
                                <CardContent sx={{ p: 3 }}>{section.component}</CardContent>
                            </Collapse>
                        </ReportItemCard>
                    </TabPanel>
                ))}

            </Container>
        </PageContainer>
    );
};

export default Dashboard;
