import { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Avatar, Button } from "@mui/material";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTodayLogs, setShowTodayLogs] = useState(true); // State to manage which logs to display

    useEffect(() => {
        console.log("Fetching logs...");
        axios.get(`${baseURL}/logs/get-all-logs`)
            .then(response => {
                console.log("Logs response:", response.data);
                setLogs(response.data.logs);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching logs:", error);
                setLoading(false);
            });
    }, []);

    // Function to filter today's logs
    const getTodayLogs = () => {
        const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD
        return logs.filter(log => log.date.startsWith(today));
    };

    const todayLogs = getTodayLogs();

    return (
        <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
            {/* Buttons to toggle between Today's Logs and All Logs */}
            <Button 
                variant="contained" 
                color={showTodayLogs ? "primary" : "secondary"} 
                onClick={() => setShowTodayLogs(true)}
                sx={{ mr: 2 }}
            >
                Today's Logs
            </Button>
            <Button 
                variant="contained" 
                color={showTodayLogs ? "secondary" : "primary"} 
                onClick={() => setShowTodayLogs(false)}
            >
                All Logs
            </Button>

            {/* Display Logs */}
            {showTodayLogs ? (
                <>
                    <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                        Today's Logs
                    </Typography>
                    {loading ? (
                        <CircularProgress />
                    ) : todayLogs.length === 0 ? (
                        <Typography variant="h6" color="gray">No users logged in today</Typography>
                    ) : (
                        <TableContainer component={Paper} sx={{ backgroundColor: "#212121", color: "white", mb: 4 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell sx={{ color: "#FFAC1C", fontWeight: "bold" }}>User</TableCell>
                                        <TableCell sx={{ color: "#FFAC1C", fontWeight: "bold" }}>Time In</TableCell>
                                        <TableCell sx={{ color: "#FFAC1C", fontWeight: "bold" }}>Time Out</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {todayLogs.map((log) => (
                                        <TableRow key={log._id}>
                                            <TableCell>
                                                <Avatar src={log.userId?.image?.[0]?.url || "https://via.placeholder.com/50"} />
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }}>{log.userId?.name || "Unknown User"}</TableCell>
                                            <TableCell sx={{ color: "white" }}>{new Date(log.timeIn).toLocaleTimeString()}</TableCell>
                                            <TableCell sx={{ color: "white" }}>{log.timeOut ? new Date(log.timeOut).toLocaleTimeString() : "Active"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            ) : (
                <>
                    <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                        All Logs
                    </Typography>
                    {loading ? (
                        <CircularProgress />
                    ) : logs.length === 0 ? (
                        <Typography variant="h6" color="gray">No logs available</Typography>
                    ) : (
                        <TableContainer component={Paper} sx={{ backgroundColor: "#212121", color: "white" }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell sx={{ color: "#FFAC1C", fontWeight: "bold" }}>User</TableCell>
                                        <TableCell sx={{ color: "#FFAC1C", fontWeight: "bold" }}>Date</TableCell>
                                        <TableCell sx={{ color: "#FFAC1C", fontWeight: "bold" }}>Time In</TableCell>
                                        <TableCell sx={{ color: "#FFAC1C", fontWeight: "bold" }}>Time Out</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {logs.map((log) => (
                                        <TableRow key={log._id}>
                                            <TableCell>
                                                <Avatar src={log.userId?.image?.[0]?.url || "https://via.placeholder.com/50"} />
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }}>{log.userId?.name || "Unknown User"}</TableCell>
                                            <TableCell sx={{ color: "white" }}>{new Date(log.date).toLocaleDateString()}</TableCell>
                                            <TableCell sx={{ color: "white" }}>{new Date(log.timeIn).toLocaleTimeString()}</TableCell>
                                            <TableCell sx={{ color: "white" }}>{log.timeOut ? new Date(log.timeOut).toLocaleTimeString() : "Active"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            )}
        </Container>
    );
};

export default Logs;