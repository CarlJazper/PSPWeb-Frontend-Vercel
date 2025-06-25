import { useEffect, useState, useMemo } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    CircularProgress, Avatar, Alert, TextField, Stack, Button, Box, Chip, InputAdornment,
} from "@mui/material";
import { CalendarToday, FilterList, Person, Schedule, } from "@mui/icons-material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import isEqual from "lodash.isequal";

import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { getUser } from "../../../utils/helpers";

const UserLogs = ({ branchId }) => {
    const [logs, setLogs] = useState([]);
    const user = getUser();
    const branch = branchId || user.userBranch;
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [pendingFrom, setPendingFrom] = useState(null);
    const [pendingTo, setPendingTo] = useState(null);

useEffect(() => {
    let prevLogs = [];

    const fetchLogsAndUsers = async () => {
        try {
            const body = { userBranch: branch };
            const [logsRes, usersRes] = await Promise.all([
                axios.post(`${baseURL}/logs/get-all-logs`, body),
                axios.post(`${baseURL}/users/get-all-users`, body),
            ]);

            const validUsers = usersRes.data.users.filter(user => !user.isDeleted);
            const validUserIds = new Set(validUsers.map(user => user._id));
            const validLogs = logsRes.data.logs.filter(log => validUserIds.has(log.userId?._id));

            // ✅ Only update if logs actually changed
            if (!isEqual(validLogs, prevLogs)) {
                prevLogs = validLogs;
                setLogs(validLogs);
                setFilteredLogs(validLogs);
            }
        } catch (err) {
            setError("Failed to load logs.");
        } finally {
            setLoading(false);
        }
    };

    fetchLogsAndUsers();
    const interval = setInterval(fetchLogsAndUsers, 5000); // ⏱ every 5 seconds
    return () => clearInterval(interval);
}, [branch]);



    const applyFilter = () => {
        const from = pendingFrom ? new Date(pendingFrom).setHours(0, 0, 0, 0) : null;
        const to = pendingTo ? new Date(pendingTo).setHours(23, 59, 59, 999) : null;

        const filtered = logs.filter((log) => {
            if (!log || !log.date) return false; // Skip invalid logs
            const logDate = new Date(log.date).getTime();
            return (!from || logDate >= from) && (!to || logDate <= to);
        });

        setFromDate(pendingFrom);
        setToDate(pendingTo);
        setFilteredLogs(filtered);
    };


    const clearFilter = () => {
        setPendingFrom(null);
        setPendingTo(null);
        setFromDate(null);
        setToDate(null);
        setFilteredLogs(logs);
    };

    const renderStatusChip = (timeOut) => (
        <Chip
            label={timeOut ? "Completed" : "Active"}
            size="small"
            sx={timeOut ? completedChipStyle : activeChipStyle}
        />
    );

    const renderDateRange = () =>
        (fromDate || toDate) && (
            <Box mt={2}>
                <Typography variant="body2" sx={{ color: "#8E8E93" }}>
                    Showing logs from{" "}
                    <strong>{fromDate ? new Date(fromDate).toLocaleDateString() : "beginning"}</strong> to{" "}
                    <strong>{toDate ? new Date(toDate).toLocaleDateString() : "now"}</strong>
                </Typography>
            </Box>
        );

    const renderTable = () => {
        if (loading) {
            return (
                <Box sx={centerBoxStyle}>
                    <CircularProgress size={40} sx={{ color: "#007AFF" }} />
                    <Typography variant="body1" sx={{ mt: 2, color: "#8E8E93" }}>
                        Loading user logs...
                    </Typography>
                </Box>
            );
        }

        if (error) {
            return (
                <Alert severity="error" sx={alertStyle} icon={false}>
                    {error}
                </Alert>
            );
        }

        if (!logs.length) {
            return (
                <Box sx={centerBoxStyle}>
                    <Schedule sx={{ fontSize: 48, color: "#C7C7CC", mb: 2 }} />
                    <Typography variant="h6" sx={{ color: "#8E8E93", fontWeight: 500 }}>
                        No logs found
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#C7C7CC", mt: 1 }}>
                        {fromDate || toDate ? "Try adjusting your date range" : "No user activity recorded yet"}
                    </Typography>
                </Box>
            );
        }

        return (
            <TableContainer component={Paper} sx={tableContainerStyle}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {["User", "Date", "Time In", "Time Out", "Status"].map((label, i) => (
                                <TableCell key={label} sx={headerCellStyle}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        {i === 0 && <Person sx={{ fontSize: 18, color: "#8E8E93" }} />}
                                        {i === 1 && <CalendarToday sx={{ fontSize: 18, color: "#8E8E93" }} />}
                                        {label}
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredLogs.map((log) => (
                            <TableRow key={log._id} sx={tableRowStyle}>
                                <TableCell sx={bodyCellStyle}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Avatar
                                            src={log.userId?.image?.[0]?.url || "https://via.placeholder.com/40"}
                                            alt={log.userId?.name || "Unknown User"}
                                            sx={avatarStyle}
                                        />
                                        <Typography variant="body2" sx={{ fontWeight: 500, color: "#1D1D1F" }}>
                                            {log.userId?.name || "Unknown User"}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={bodyCellStyle}>
                                    {new Date(log.date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </TableCell>
                                <TableCell sx={bodyCellStyle}>
                                    {new Date(log.timeIn).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </TableCell>
                                <TableCell sx={bodyCellStyle}>
                                    {log.timeOut
                                        ? new Date(log.timeOut).toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })
                                        : "—"}
                                </TableCell>
                                <TableCell sx={bodyCellStyle}>{renderStatusChip(log.timeOut)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="lg" sx={containerStyle}>
                <Box sx={headerSectionStyle}>
                    <Typography variant="h4" sx={titleStyle}>
                        User Activity Logs
                    </Typography>
                    <Typography variant="body1" sx={subtitleStyle}>
                        Track user check-ins
                    </Typography>
                </Box>

                <Paper sx={filterSectionStyle}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                        <FilterList sx={{ color: "#007AFF", fontSize: 20 }} />
                        <Typography variant="h6" sx={{ color: "#1D1D1F", fontWeight: 600 }}>
                            Filter Logs
                        </Typography>
                    </Box>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                        {[["From Date", pendingFrom, setPendingFrom], ["To Date", pendingTo, setPendingTo]].map(
                            ([label, value, setter]) => (
                                <DatePicker
                                    key={label}
                                    label={label}
                                    value={value}
                                    onChange={setter}
                                    views={["year", "month", "day"]}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            sx={datePickerStyle}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CalendarToday sx={{ color: "#8E8E93", fontSize: 18 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            )
                        )}
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="contained"
                                onClick={applyFilter}
                                sx={primaryButtonStyle}
                                disabled={!pendingFrom && !pendingTo}
                            >
                                Apply Filter
                            </Button>
                            {(fromDate || toDate) && (
                                <Button variant="outlined" onClick={clearFilter} sx={secondaryButtonStyle}>
                                    Clear
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                    {renderDateRange()}
                </Paper>

                {!loading && !error && (
                    <Box sx={summaryStyle}>
                        <Typography variant="body2" sx={{ color: "#8E8E93" }}>
                            {filteredLogs.length}{" "}
                            {filteredLogs.length === 1 ? "log entry" : "log entries"} found
                        </Typography>
                    </Box>
                )}
                {renderTable()}
            </Container>
        </LocalizationProvider>
    );
};

// Styles
const containerStyle = { py: 4, px: { xs: 2, sm: 3 } };
const headerSectionStyle = { textAlign: "center", mb: 4 };
const titleStyle = { fontWeight: 700, color: "#1D1D1F", fontSize: { xs: "2rem", sm: "2.5rem" }, letterSpacing: "-0.02em", mb: 1 };
const subtitleStyle = { color: "#8E8E93", fontSize: "1.1rem", fontWeight: 400 };
const filterSectionStyle = { p: 3, mb: 3, borderRadius: 3, backgroundColor: "#FBFBFD", border: "1px solid #E5E5EA", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" };
const datePickerStyle = { minWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: 2, backgroundColor: "white", "& fieldset": { borderColor: "#E5E5EA" }, "&:hover fieldset": { borderColor: "#007AFF" }, "&.Mui-focused fieldset": { borderColor: "#007AFF", borderWidth: 2 } }, "& .MuiInputLabel-root": { color: "#8E8E93", "&.Mui-focused": { color: "#007AFF" } } };
const primaryButtonStyle = { backgroundColor: "#007AFF", color: "white", fontWeight: 600, borderRadius: 2, px: 3, py: 1, textTransform: "none", boxShadow: "0 1px 3px rgba(0, 122, 255, 0.3)", "&:hover": { backgroundColor: "#0056CC", boxShadow: "0 2px 6px rgba(0, 122, 255, 0.4)" }, "&:disabled": { backgroundColor: "#E5E5EA", color: "#8E8E93", boxShadow: "none" } };
const secondaryButtonStyle = { borderColor: "#C62828", color: "#C62828", fontWeight: 600, borderRadius: 2, px: 3, py: 1, textTransform: "none", "&:hover": { borderColor: "#007AFF", color: "#007AFF", backgroundColor: "rgba(0, 122, 255, 0.04)" } };
const summaryStyle = { mb: 2, textAlign: "right" };
const tableContainerStyle = { borderRadius: 3, backgroundColor: "white", border: "1px solid #E5E5EA", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)", overflow: "hidden" };
const headerCellStyle = { backgroundColor: "#F2F2F7", color: "#1D1D1F", fontWeight: 600, fontSize: "0.875rem", borderBottom: "1px solid #E5E5EA", py: 2 };
const bodyCellStyle = { borderBottom: "1px solid #F2F2F7", py: 2 };
const tableRowStyle = { "&:hover": { backgroundColor: "#FBFBFD" }, "&:last-child td": { borderBottom: "none" } };
const avatarStyle = { width: 40, height: 40, border: "2px solid #F2F2F7" };
const activeChipStyle = { backgroundColor: "#34C759", color: "white", fontWeight: 600, fontSize: "0.75rem", "& .MuiChip-label": { px: 1.5 } };
const completedChipStyle = { backgroundColor: "#E5E5EA", color: "#8E8E93", fontWeight: 600, fontSize: "0.75rem", "& .MuiChip-label": { px: 1.5 } };
const centerBoxStyle = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8, textAlign: "center" };
const alertStyle = { borderRadius: 2, backgroundColor: "#FFEBEE", color: "#C62828", border: "1px solid #FFCDD2", "& .MuiAlert-message": { fontWeight: 500 } };

export default UserLogs;
