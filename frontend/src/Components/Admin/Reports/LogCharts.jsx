import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box, Card, CardContent, Grid, Chip, Button } from '@mui/material';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import baseURL from "../../../utils/baseURL";
import { getUser } from '../../../utils/helpers';

const COLORS = {
    primary: "#007AFF", secondary: "#5856D6", success: "#34C759", warning: "#FF9500", error: "#FF3B30", purple: "#AF52DE",
    pink: "#FF2D92", indigo: "#5856D6", teal: "#5AC8FA", gray: "#8E8E93", lightGray: "#F2F2F7", darkGray: "#1C1C1E"
};

const CHART_COLORS = [
    COLORS.primary, COLORS.success, COLORS.warning, COLORS.purple, COLORS.pink,
    COLORS.secondary, COLORS.teal, COLORS.error, COLORS.indigo
];

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

const LogCharts = ({ branchId }) => {
    const user = getUser();
    const branch = branchId || user.userBranch;
    const [branchName, setBranchName] = useState("Unknown Branch");
    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dailyActivityData, setDailyActivityData] = useState([]);
    const [peakHoursData, setPeakHoursData] = useState([]);
    const [userFrequencyData, setUserFrequencyData] = useState([]);
    const [averageSessionData, setAverageSessionData] = useState([]);
    const [activeInactiveData, setActiveInactiveData] = useState([]);
    const [trainingStats, setTrainingStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [genderStats, setGenderStats] = useState([]);
    const [trainingDemographics, setTrainingDemographics] = useState([]);
    const [selectedType, setSelectedType] = useState(null);


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
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, [branch]);

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
            // 6. Gender Statistics
            const genderCount = users.reduce((acc, user) => {
                const gender = user.gender || "Unknown";
                acc[gender] = (acc[gender] || 0) + 1;
                return acc;
            }, {});

            const genderData = Object.entries(genderCount).map(([gender, count]) => ({
                name: gender,
                value: count
            }));

            setGenderStats(genderData);
        }

    }, [logs, users]);

    const fetchTrainingStats = async () => {
        try {
            const body = { userBranch: branch };

            const [trainingRes, typeRes] = await Promise.all([
                axios.post(`${baseURL}/availTrainer/training-usage-stats`, body),
                axios.post(`${baseURL}/availTrainer/training-type-stats`, body)
            ]);

            setTrainingStats({
                allStats: trainingRes.data.allStats,
                mostUsed: trainingRes.data.mostUsed,
                leastUsed: trainingRes.data.leastUsed,
                typeStats: typeRes.data.typeStats,
            });

        } catch (err) {
            console.error("Training stats error:", err);
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        fetchTrainingStats(); // Only fetch once per branch change
    }, [branch]);

    const fetchTrainingDemographics = async () => {
        try {
            const res = await axios.post(`${baseURL}/availTrainer/training-demographics`, {
                userBranch: branch
            });
            setTrainingDemographics(res.data.trainingDemographics);
        } catch (err) {
            console.error("Error fetching training demographics:", err);
        }
    };

    useEffect(() => {
        fetchTrainingDemographics();
    }, [branch]);

    useEffect(() => {
        const fetchBranchName = async () => {
            if (!branch) return;
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get(`${baseURL}/branch/get-branch/${branch}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBranchName(data.branch.name);
            } catch (err) {
                console.error("Failed to fetch branch name:", err);
                setBranchName("Unknown Branch");
            }
        };

        fetchBranchName();
    }, [branch]);

    if (loadingStats) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                backgroundColor: COLORS.lightGray,
                borderRadius: '15px'
            }}>
                <CircularProgress size={40} sx={{ color: COLORS.success }} />
            </Box>
        );
    }

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

    const generateTrainingDemographicsPDF = () => {
        const doc = new jsPDF();
        const currentDate = new Date().toLocaleString();
        const brandColor = [33, 150, 243];
        const textColor = [40, 40, 40];
        const titleColor = [20, 20, 20];

        // === HEADER ===
        doc.setFont("helvetica", "bold").setFontSize(16).setTextColor(...titleColor);
        doc.text("Training Type Demographics Report", 105, 20, { align: "center" });

        doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(100);
        doc.text(`Branch: ${branchName || "All Branches"}`, 14, 28);
        doc.text(`Generated: ${currentDate}`, 14, 34);
        doc.setDrawColor(180);
        doc.line(14, 38, 196, 38);

        // === NO DATA CASE ===
        if (!trainingDemographics?.length) {
            doc.setFont("helvetica", "normal").setFontSize(12).setTextColor(...textColor);
            doc.text("No training demographic data available.", 105, 60, { align: "center" });
            return doc.save("Training_Demographics_Report.pdf");
        }

        // === SECTION: Summary Header ===
        doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(...titleColor);
        doc.text("------ Summary ------", 105, 46, { align: "center" });

        // === SUMMARY TABLE ===
        autoTable(doc, {
            startY: 50,
            head: [["Training Type", "Male", "Female", "Total"]],
            body: trainingDemographics.map(e => [
                e.trainingType,
                e.male || 0,
                e.female || 0,
                (e.male || 0) + (e.female || 0)
            ]),
            theme: "striped",
            headStyles: {
                fillColor: brandColor,
                textColor: 255,
                fontStyle: "bold",
                halign: "center"
            },
            styles: {
                font: "helvetica",
                fontSize: 10,
                cellPadding: 3
            },
            columnStyles: {
                0: { halign: "left", fontStyle: "bold", cellWidth: 70 },
                1: { halign: "center" },
                2: { halign: "center" },
                3: { halign: "center" }
            }
        });

        let y = doc.lastAutoTable.finalY + 10;

        // === SECTION: Breakdown Header ===
        doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(...titleColor);
        doc.text("------ Training Type Breakdown ------", 105, y, { align: "center" });
        y += 8;

        // === DETAILED SECTION PER TRAINING TYPE ===
        trainingDemographics.forEach((entry, idx) => {
            const { trainingType, topGender, genderCount, averageAgeBracket, users = [] } = entry;

            if (y > 240) {
                doc.addPage();
                y = 20;
            }

            const blockStartY = y;

            // We'll estimate the height first
            let estimatedHeight = 30 + (users.length ? users.length * 7 : 10);

            // Pre-fill background block
            doc.setFillColor(248, 248, 248); // very light gray
            doc.rect(13, blockStartY - 1, 184, estimatedHeight, 'F'); // fill background

            // === Section Title Header ===
            doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...titleColor);
            doc.setFillColor(240, 240, 240);
            doc.rect(14, y, 182, 8, 'F');
            doc.text(`${trainingType} – Detailed Breakdown`, 18, y + 5.5);
            y += 10;

            // === Stat Box ===
            doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...textColor);
            doc.setDrawColor(200);
            doc.rect(14, y - 3, 182, 12);
            doc.text(`Top Gender: ${topGender || "N/A"} (${genderCount || 0})`, 18, y + 4);
            doc.text(`Average Age Bracket: ${averageAgeBracket || "N/A"}`, 110, y + 4);
            y += 16;

            // === Users Table ===
            if (!users.length) {
                doc.setFontSize(10).setTextColor(120);
                doc.text("No user data available for this training type.", 18, y);
                y += 10;
            } else {
                autoTable(doc, {
                    startY: y,
                    head: [["Name", "Age", "Gender"]],
                    body: users.map(u => [u.name, `${u.age} y/o`, u.gender]),
                    theme: "grid",
                    headStyles: {
                        fillColor: [50, 50, 50],
                        textColor: 255,
                        fontStyle: "bold",
                        fontSize: 10,
                    },
                    styles: {
                        font: "helvetica",
                        fontSize: 9,
                        cellPadding: 2.5
                    },
                    columnStyles: {
                        0: { halign: "left", cellWidth: 80 },
                        1: { halign: "center" },
                        2: { halign: "center" }
                    }
                });
                y = doc.lastAutoTable.finalY + 6;
            }

            // Draw border around block (overlapping fill)
            const blockHeight = y - blockStartY;
            doc.setDrawColor(210);
            doc.rect(13, blockStartY - 1, 184, blockHeight + 2);

            y += 10;

            if (idx < trainingDemographics.length - 1 && y > 250) {
                doc.addPage();
                y = 20;
            }
        });

        doc.save(`Training_Demographics_Report_${branchName || "AllBranches"}.pdf`);
    };

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
                                            allowDecimals={false}
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
                                            allowDecimals={false}
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
                    {/* Training Demographics */}
                    {trainingDemographics.length > 0 && (
                        <Grid item xs={12}>
                            <Card
                                sx={{
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                    height: '100%',
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 2
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                color: COLORS.darkGray,
                                            }}
                                        >
                                            Training Type Demographics
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={generateTrainingDemographicsPDF}
                                        >
                                            Export PDF
                                        </Button>
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        sx={{ color: COLORS.gray, mb: 2 }}
                                    >
                                        Click a bar to view detailed breakdown of users.
                                    </Typography>

                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={trainingDemographics}
                                            layout="vertical"
                                            margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                                            onClick={(e) => {
                                                if (e?.activePayload?.[0]?.payload) {
                                                    setSelectedType(e.activePayload[0].payload);
                                                }
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} opacity={0.3} />
                                            <XAxis
                                                type="number"
                                                allowDecimals={false}
                                                tick={{ fill: COLORS.gray, fontSize: 12 }}
                                            />
                                            <YAxis
                                                dataKey="trainingType"
                                                type="category"
                                                tick={{ fill: COLORS.gray, fontSize: 13 }}
                                            />
                                            <Tooltip content={<CustomTooltip />} />

                                            {/* Male Bar */}
                                            <Bar dataKey="male" radius={[0, 6, 6, 0]} fill={COLORS.primary}>
                                                {trainingDemographics.map((entry, index) => (
                                                    <Cell key={`male-${index}`} />
                                                ))}
                                                <LabelList
                                                    content={({ x, y, width, height, index }) => {
                                                        const entry = trainingDemographics[index];
                                                        const showNoUser = (entry.male || 0) === 0 && (entry.female || 0) === 0;
                                                        const showNoMale = (entry.female || 0) > 0 && (entry.male || 0) === 0;

                                                        if (showNoUser) {
                                                            return (
                                                                <text
                                                                    x={x + 20}
                                                                    y={y + height / 2 + 5}
                                                                    fill={COLORS.gray}
                                                                    fontSize={12}
                                                                >
                                                                    No user chose this type
                                                                </text>
                                                            );
                                                        }

                                                        if (showNoMale) {
                                                            return (
                                                                <text
                                                                    x={x + 20}
                                                                    y={y + height / 2 + 5}
                                                                    fill={COLORS.gray}
                                                                    fontSize={12}
                                                                >
                                                                    No male
                                                                </text>
                                                            );
                                                        }

                                                        return null;
                                                    }}
                                                />
                                            </Bar>

                                            {/* Female Bar */}
                                            <Bar dataKey="female" radius={[0, 6, 6, 0]} fill={COLORS.pink}>
                                                {trainingDemographics.map((entry, index) => (
                                                    <Cell key={`female-${index}`} />
                                                ))}
                                                <LabelList
                                                    content={({ x, y, width, height, index }) => {
                                                        const entry = trainingDemographics[index];
                                                        const showNoUser = (entry.male || 0) === 0 && (entry.female || 0) === 0;
                                                        const showNoFemale = (entry.male || 0) > 0 && (entry.female || 0) === 0;

                                                        if (showNoFemale) {
                                                            return (
                                                                <text
                                                                    x={x + 20}
                                                                    y={y + height / 2 + 5}
                                                                    fill={COLORS.gray}
                                                                    fontSize={12}
                                                                >
                                                                    No female
                                                                </text>
                                                            );
                                                        }

                                                        return null;
                                                    }}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {/*Training usage*/}
                    {trainingStats && (
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
                                        Training Usage Distribution
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <PieChart>
                                            <Pie
                                                data={trainingStats.allStats}
                                                dataKey="count"
                                                nameKey="_id"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                innerRadius={40}
                                                paddingAngle={3}
                                                label={({ _id }) => _id}
                                            >
                                                {trainingStats.allStats.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 500 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <Box sx={{ mt: 3 }}>
                                        <Chip
                                            label={`Most Used: ${trainingStats.mostUsed?._id} (${trainingStats.mostUsed?.count})`}
                                            sx={{ mr: 2, backgroundColor: COLORS.success, color: "#fff" }}
                                        />
                                        <Chip
                                            label={`Least Used: ${trainingStats.leastUsed?._id} (${trainingStats.leastUsed?.count})`}
                                            sx={{ backgroundColor: COLORS.error, color: "#fff" }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                    {/*Training type*/}
                    {trainingStats?.typeStats?.length > 0 && (
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
                                        Training Type Distribution
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <PieChart>
                                            <Pie
                                                data={trainingStats.typeStats}
                                                dataKey="count"
                                                nameKey="_id"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                innerRadius={40}
                                                paddingAngle={3}
                                                label={({ _id }) => _id}
                                            >
                                                {trainingStats.typeStats.map((_, index) => (
                                                    <Cell key={`cell-type-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 500 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                    {/*Gender distribution*/}
                    {genderStats.length > 0 && (
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
                                        Gender Distribution
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <PieChart>
                                            <Pie
                                                data={genderStats}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                innerRadius={40}
                                                paddingAngle={5}
                                                label={({ name }) => name}
                                            >
                                                {genderStats.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-gender-${index}`}
                                                        fill={
                                                            entry.name.toLowerCase() === 'female' ? COLORS.pink :
                                                                entry.name.toLowerCase() === 'male' ? COLORS.primary :
                                                                    COLORS.gray
                                                        }
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
                    )}
                </Grid>
                {/*Modal for training type demographics*/}
                {selectedType && (
                    <Box
                        sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            backgroundColor: "rgba(0,0,0,0.6)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 2000
                        }}
                        onClick={() => setSelectedType(null)}
                    >
                        <Card
                            sx={{
                                width: '90%',
                                maxWidth: 600,
                                borderRadius: 4,
                                p: 4,
                                maxHeight: '90vh',
                                overflowY: 'auto'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: COLORS.darkGray }}>
                                {selectedType.trainingType} - Demographics
                            </Typography>

                            {/* Top Gender */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body1" sx={{ mr: 1 }}>
                                    <strong>Top Gender:</strong>
                                </Typography>
                                <Chip
                                    label={`${selectedType.topGender} (${selectedType.genderCount})`}
                                    sx={{
                                        backgroundColor:
                                            selectedType.topGender === "male"
                                                ? COLORS.primary
                                                : selectedType.topGender === "female"
                                                    ? COLORS.pink
                                                    : COLORS.gray,
                                        color: "#fff",
                                        fontWeight: 600
                                    }}
                                />
                            </Box>

                            {/* Age Bracket */}
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                <strong>Average Age Bracket:</strong> {selectedType.averageAgeBracket}
                            </Typography>

                            {/* Users List */}
                            {selectedType.users.length > 0 ? (
                                <>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                        All Users Who Availed This Training Type:
                                    </Typography>
                                    {selectedType.users.map((user, i) => (
                                        <Chip
                                            key={i}
                                            label={`${user.name} • ${user.gender} • ${user.age} y/o`}
                                            sx={{
                                                mr: 1,
                                                mb: 1,
                                                backgroundColor:
                                                    user.gender === "male"
                                                        ? "#E3F2FD"
                                                        : user.gender === "female"
                                                            ? "#FCE4EC"
                                                            : COLORS.lightGray,
                                                color:
                                                    user.gender === "male"
                                                        ? COLORS.primary
                                                        : user.gender === "female"
                                                            ? COLORS.pink
                                                            : COLORS.darkGray,
                                                fontWeight: 500
                                            }}
                                        />
                                    ))}
                                </>
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    No users available for this training type.
                                </Typography>
                            )}
                        </Card>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default LogCharts;
