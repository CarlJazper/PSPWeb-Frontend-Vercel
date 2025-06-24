import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box, Card, CardContent, Grid, Chip } from '@mui/material';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import baseURL from "../../../utils/baseURL";
import { getUser } from '../../../utils/helpers';

// Color palette
const COLORS = {
    primary: "#007AFF", secondary: "#5856D6", success: "#34C759", warning: "#FF9500", error: "#FF3B30", purple: "#AF52DE",
    pink: "#FF2D92", indigo: "#5856D6", teal: "#5AC8FA", gray: "#8E8E93", lightGray: "#F2F2F7", darkGray: "#1C1C1E"
};

const CHART_COLORS = [
    COLORS.primary, COLORS.success, COLORS.warning, COLORS.purple, COLORS.pink,
    COLORS.secondary, COLORS.teal, COLORS.error, COLORS.indigo
];

const LogCharts = ({ branchId }) => {
    const user = getUser();
    const branch = branchId || user.userBranch;

    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dailyActivityData, setDailyActivityData] = useState([]);
    const [peakHoursData, setPeakHoursData] = useState([]);
    const [userFrequencyData, setUserFrequencyData] = useState([]);
    const [averageSessionData, setAverageSessionData] = useState([]);
    const [activeInactiveData, setActiveInactiveData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const body = { userBranch: branch };
                const logsResponse = await axios.post(`${baseURL}/logs/get-all-logs`, body);
                const usersResponse = await axios.post(`${baseURL}/users/get-all-users`, body);

                const validUsers = usersResponse.data.users.filter(user => !user.isDeleted);
                const validUserIds = new Set(validUsers.map(user => user._id));
                const filteredLogs = logsResponse.data.logs.filter(log => validUserIds.has(log.userId?._id));

                setUsers(validUsers);
                setLogs(filteredLogs);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData(), 2000);
        return () => clearInterval(interval);
    }, [branch]); // ✅ Add branch to dependency list


    useEffect(() => {
        if (logs.length > 0 && users.length > 0) {
            // 1. Daily Activity
            const dailyActivity = logs.reduce((acc, log) => {
                const date = format(parseISO(log.date), 'yyyy-MM-dd');
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});

            setDailyActivityData(Object.entries(dailyActivity).map(([date, count]) => ({
                date: format(parseISO(date), 'MMM dd'),
                count,
            })));

            // 2. Peak Gym Hours (Converted to 12-hour format)
            const peakHours = logs.reduce((acc, log) => {
                const hour = parseISO(log.timeIn).getHours();
                acc[hour] = (acc[hour] || 0) + 1;
                return acc;
            }, {});

            setPeakHoursData(Object.entries(peakHours).map(([hour, count]) => ({
                hour: format(parseISO(`2022-01-01T${hour.padStart(2, '0')}:00:00`), "h a"),
                count,
            })));

            // 3. User Check-in Frequency (Top 10)
            const userFrequency = logs.reduce((acc, log) => {
                const userId = log.userId._id;
                acc[userId] = (acc[userId] || 0) + 1;
                return acc;
            }, {});

            const topUsers = Object.entries(userFrequency)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([userId, count]) => {
                    const user = users.find((u) => u._id === userId);
                    return {
                        name: user ? user.name.split(' ')[0] : `User ${userId.slice(-4)}`,
                        count
                    };
                });

            setUserFrequencyData(topUsers);

            // 4. Average Session Duration
            const sessionDurations = logs
                .filter(log => log.timeOut)
                .map(log => differenceInMinutes(parseISO(log.timeOut), parseISO(log.timeIn)));

            const averageDuration = sessionDurations.length > 0
                ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
                : 0;

            setAverageSessionData([{ name: 'Average Session', duration: Math.round(averageDuration) }]);

            // 5. Active vs. Inactive Users
            const activeUsers = logs.filter(log => !log.timeOut).length;
            const inactiveUsers = logs.length - activeUsers;
            setActiveInactiveData([
                { name: "Currently Active", value: activeUsers },
                { name: "Checked Out", value: inactiveUsers }
            ]);
        }
    }, [logs, users]);

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px',
                    fontWeight: 500
                }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {label}
                    </Typography>
                    {payload.map((entry, index) => (
                        <Typography
                            key={index}
                            variant="body2"
                            sx={{ color: entry.color, fontWeight: 500 }}
                        >
                            {entry.name}: {entry.value}
                        </Typography>
                    ))}
                </Box>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                backgroundColor: COLORS.lightGray,
                borderRadius: '15px'

            }}>
                <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            </Box>
        );
    }

    if (logs.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
                <Typography variant="h5" sx={{ color: COLORS.gray, fontWeight: 500 }}>
                    No logs available
                </Typography>
            </Container>
        );
    }

    return (
        <Box sx={{
            backgroundColor: COLORS.lightGray,
            borderRadius: '1%',
            minHeight: '100vh',
            py: 4
        }}>
            <Container maxWidth="xl">
                {/* Header Section */}
                <Box sx={{ textAlign: "center", mb: 6 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            color: COLORS.darkGray,
                            mb: 1,
                            letterSpacing: '-0.02em'
                        }}
                    >
                        Analytics Dashboard
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: COLORS.gray,
                            fontWeight: 400,
                            mb: 3
                        }}
                    >
                        Insights into gym activity and member engagement
                    </Typography>

                    {/* Stats Overview */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Chip
                            label={`${logs.length} Total Logs`}
                            sx={{
                                backgroundColor: COLORS.primary,
                                color: 'white',
                                fontWeight: 600,
                                px: 2,
                                py: 1
                            }}
                        />
                        <Chip
                            label={`${users.length} Members`}
                            sx={{
                                backgroundColor: COLORS.success,
                                color: 'white',
                                fontWeight: 600,
                                px: 2,
                                py: 1
                            }}
                        />
                        <Chip
                            label={`${activeInactiveData[0]?.value || 0} Currently Active`}
                            sx={{
                                backgroundColor: COLORS.warning,
                                color: 'white',
                                fontWeight: 600,
                                px: 2,
                                py: 1
                            }}
                        />
                    </Box>
                </Box>

                {/* Charts Grid */}
                <Grid container spacing={3}>
                    {/* Daily Activity - Full Width */}
                    <Grid item xs={12}>
                        <Card sx={{
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            border: 'none',
                            overflow: 'hidden'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 600,
                                        color: COLORS.darkGray,
                                        mb: 3,
                                        letterSpacing: '-0.01em'
                                    }}
                                >
                                    Daily Activity Trends
                                </Typography>
                                <ResponsiveContainer width="100%" height={320}>
                                    <LineChart data={dailyActivityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} opacity={0.3} />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: COLORS.gray }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: COLORS.gray }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke={COLORS.primary}
                                            strokeWidth={3}
                                            dot={{ fill: COLORS.primary, strokeWidth: 2, r: 6 }}
                                            activeDot={{ r: 8, stroke: COLORS.primary, strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Peak Hours */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            height: '100%'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: COLORS.darkGray,
                                        mb: 3
                                    }}
                                >
                                    Peak Hours
                                </Typography>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={peakHoursData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} opacity={0.3} />
                                        <XAxis
                                            dataKey="hour"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: COLORS.gray }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: COLORS.gray }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                            {peakHoursData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Active vs Inactive */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            height: '100%'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: COLORS.darkGray,
                                        mb: 3
                                    }}
                                >
                                    Current Status
                                </Typography>
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie
                                            data={activeInactiveData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            innerRadius={40}
                                            paddingAngle={5}
                                        >
                                            {activeInactiveData.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={index === 0 ? COLORS.success : COLORS.gray}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend
                                            wrapperStyle={{
                                                fontSize: '14px',
                                                fontWeight: 500
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Top Members */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            height: '100%'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: COLORS.darkGray,
                                        mb: 3
                                    }}
                                >
                                    Top Active Members
                                </Typography>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={userFrequencyData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} opacity={0.3} />
                                        <XAxis
                                            type="number"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: COLORS.gray }}
                                        />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: COLORS.gray }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="count" radius={[0, 4, 4, 0]} fill={COLORS.primary}>
                                            {userFrequencyData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Average Session */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            height: '100%'
                        }}>
                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: COLORS.darkGray,
                                        mb: 2
                                    }}
                                >
                                    Average Session Duration
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 200
                                }}>
                                    <Typography
                                        variant="h2"
                                        sx={{
                                            fontWeight: 700,
                                            color: COLORS.primary,
                                            mb: 1,
                                            letterSpacing: '-0.02em'
                                        }}
                                    >
                                        {averageSessionData[0]?.duration || 0}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: COLORS.gray,
                                            fontWeight: 500
                                        }}
                                    >
                                        minutes
                                    </Typography>
                                    <Box sx={{
                                        width: 60,
                                        height: 4,
                                        backgroundColor: COLORS.primary,
                                        borderRadius: 2,
                                        mt: 2
                                    }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default LogCharts;
