import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import baseURL from "../../../utils/baseURL";

const COLORS = ["#FFAC1C", "#8884d8", "#82ca9d", "#a678de", "#FF8042", "#f44336", "#9c27b0", "#673ab7", "#3f51b5"];

const LogCharts = () => {
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
                const logsResponse = await axios.get(`${baseURL}/logs/get-all-logs`);
                const usersResponse = await axios.get(`${baseURL}/users/get-all-users`);

                setLogs(logsResponse.data.logs);
                setUsers(usersResponse.data.users);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (logs.length > 0 && users.length > 0) {
            // 1. Daily Activity
            const dailyActivity = logs.reduce((acc, log) => {
                const date = format(parseISO(log.date), 'yyyy-MM-dd');
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});

            setDailyActivityData(Object.entries(dailyActivity).map(([date, count]) => ({
                date: format(parseISO(date), 'MMM dd, yyyy'),
                count,
            })));

            // 2. Peak Gym Hours (Converted to 12-hour format)
            const peakHours = logs.reduce((acc, log) => {
                const hour = parseISO(log.timeIn).getHours();
                acc[hour] = (acc[hour] || 0) + 1;
                return acc;
            }, {});

            setPeakHoursData(Object.entries(peakHours).map(([hour, count]) => ({
                hour: format(parseISO(`2022-01-01T${hour.padStart(2, '0')}:00:00`), "h a"), // Converts to 12-hour format
                count,
            })));

            // 3. User Check-in Frequency
            const userFrequency = logs.reduce((acc, log) => {
                const userId = log.userId._id;
                acc[userId] = (acc[userId] || 0) + 1;
                return acc;
            }, {});

            setUserFrequencyData(Object.entries(userFrequency).map(([userId, count]) => {
                const user = users.find((u) => u._id === userId);
                return { name: user ? user.name : `User ${userId}`, count };
            }));

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
                { name: "Active", value: activeUsers },
                { name: "Inactive", value: inactiveUsers }
            ]);
        }
    }, [logs, users]);

    if (loading) return <CircularProgress />;
    if (logs.length === 0) return <Typography variant="h5" color="gray">No logs available</Typography>;

    return (
        <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                PSP <span style={{ color: "#FFAC1C" }}>Log Analytics</span>
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {/* Line Chart - Daily Activity */}
                <Box sx={{ width: '45%', my: 2 }}>
                    <Typography variant="h6" color="#000" mb={1}>Daily User Activity</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dailyActivityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke={COLORS[0]} strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>

                {/* Bar Chart - Peak Gym Hours */}
                <Box sx={{ width: '45%', my: 2 }}>
                    <Typography variant="h6" color="#000" mb={1}>Peak Gym Hours</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={peakHoursData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count">
                                {peakHoursData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>

                {/* Bar Chart - User Check-in Frequency */}
                <Box sx={{ width: '45%', my: 2 }}>
                    <Typography variant="h6" color="#000" mb={1}>User Check-in Frequency</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={userFrequencyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count">
                                {userFrequencyData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>

                {/* Bar Chart - Average Session Duration */}
                <Box sx={{ width: '45%', my: 2 }}>
                    <Typography variant="h6" color="#000" mb={1}>Average Minute Per Session</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={averageSessionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="duration" fill={COLORS[0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>


                {/* Pie Chart - Active vs. Inactive Users */}
                <Box sx={{ width: '45%', my: 2 }}>
                    <Typography variant="h6" color="#000" mb={1}>Active Users Inside Gym</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie data={activeInactiveData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {activeInactiveData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Container>
    );
};

export default LogCharts;
