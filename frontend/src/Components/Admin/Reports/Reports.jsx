import React, { useState } from 'react';
import {Container,Typography,Box,Card,CardContent,CardHeader,Tabs,
  Tab,IconButton,Collapse,CircularProgress,useTheme,Paper,styled,alpha,
} from '@mui/material';
import {
  BarChart as ChartIcon,MonitorWeight as GymIcon,People as UserIcon,
  AttachMoney as SalesIcon,Diversity3 as SessionIcon,Paid as SessionSaleIcon,
  Refresh as RefreshIcon,ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import LogCharts from './LogCharts';
import UserLog from './UserLogs';
import MembershipSales from './MembershipSales';
import GymMonitoring from './GymMonitoring';
import TrainingSessions from './TrainingSession';
import SessionSales from './SessionSales';

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  background: theme.palette.mode === 'dark' ? '#000000' : 'transparent',
  minHeight: '100vh',
}));

const HeaderCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: theme.palette.mode === 'dark' ? '#1C1C1E' : '#FFFFFF',
  borderRadius: 20,
  marginBottom: theme.spacing(4),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? '#2C2C2E' : '#E5E5E5'}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 30px rgba(0, 0, 0, 0.1)'
    : '0 4px 30px rgba(0, 0, 0, 0.05)',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 64,
  padding: theme.spacing(2),
  fontWeight: 500,
  fontSize: '0.95rem',
  textTransform: 'none',
  borderRadius: 12,
  margin: theme.spacing(0, 0.5),
  color: theme.palette.mode === 'dark' ? '#8E8E93' : '#86868B',
  '&.Mui-selected': {
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
    background: alpha(theme.palette.primary.main, 0.2),
  },
  '& .MuiTab-iconWrapper': {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '8px !important',
  },
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.1),
  },
  '&:focus': {
    outline: 'none !important',
  },
  '&.MuiButtonBase-root': {
    outline: 'none !important',
  },
  '&.MuiTab-root': {
    outline: 'none !important',
  },
  '&.Mui-focusVisible': {
    outline: 'none !important',
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  transition: 'all 0.3s ease',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark' ? '#1C1C1E' : '#FFFFFF',
  borderRadius: 20,
  border: `1px solid ${theme.palette.mode === 'dark' ? '#2C2C2E' : '#E5E5E5'}`,
  boxShadow: 'none',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  padding: theme.spacing(3),
  background: theme.palette.mode === 'dark' ? '#2C2C2E' : '#F5F5F7',
  '& .MuiCardHeader-title': {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1D1D1F',
  },
}));

// TabPanel Component
const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`report-tabpanel-${index}`}
    aria-labelledby={`report-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
  </div>
);

const Report = () => {
  const theme = useTheme();
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

  const reportSections = [
    { id: 'charts', title: 'Log Charts', icon: <ChartIcon />, component: <LogCharts />, color: '#007AFF' },
    { id: 'users', title: 'User Logs', icon: <UserIcon />, component: <UserLog />, color: '#5856D6' },
    { id: 'gym', title: 'Gym Monitoring', icon: <GymIcon />, component: <GymMonitoring />, color: '#34C759' },
    { id: 'sales', title: 'Membership Sales', icon: <SalesIcon />, component: <MembershipSales />, color: '#FF2D55' },
    { id: 'sessions', title: 'Training Sessions', icon: <SessionIcon />, component: <TrainingSessions />, color: '#FF9500' },
    { id: 'sessionsales', title: 'Session Sales', icon: <SessionSaleIcon />, component: <SessionSales />, color: '#AF52DE' },
  ];

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
      [section]: !prev[section],
    }));
  };

  return (
    <StyledContainer maxWidth="xl">
      <HeaderCard>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              maxWidth: '100%',
              '& .MuiTabs-indicator': {
                display:'none'
              },
              '& .MuiTabs-scrollButtons': { 
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1D1D1F' 
              },
              '& .MuiTabs-flexContainer': {
                justifyContent: 'center',
              },
              '& .MuiButtonBase-root': {
                outline: 'none !important',
              },
              '& .MuiTab-root': {
                outline: 'none !important',
              },
              '& *': {
                outline: 'none !important',
              }
            }}
          >
            {reportSections.map((section, index) => (
              <StyledTab
                key={section.id}
                icon={
                  <Box sx={{ 
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {React.cloneElement(section.icon, { 
                      sx: { 
                        color: tabValue === index ? section.color : 'inherit',
                        fontSize: '1.5rem'
                      } 
                    })}
                  </Box>
                }
                label={section.title}
                id={`report-tab-${index}`}
              />
            ))}
          </Tabs>
        </Box>
      </HeaderCard>

      <Box sx={{ minHeight: '600px' }}>
        {reportSections.map((section, index) => (
          <TabPanel key={section.id} value={tabValue} index={index}>
            <StyledCard>
              <StyledCardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {React.cloneElement(section.icon, { sx: { color: section.color, fontSize: 28 } })}
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {section.title}
                    </Typography>
                  </Box>
                }
                action={
                  <IconButton
                    onClick={() => handleExpand(section.id)}
                    sx={{
                      transform: expanded[section.id] ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                }
              />
              <Collapse in={expanded[section.id]} timeout="auto" unmountOnExit>
                <CardContent sx={{ p: 3, flexGrow: 1 }}>{section.component}</CardContent>
              </Collapse>
            </StyledCard>
          </TabPanel>
        ))}
      </Box>
    </StyledContainer>
  );
};

export default Report;
