import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  Box,
} from "@mui/material";
import baseURL from "../../../utils/baseURL";

const TrainingSessions = () => {
  const [salesData, setSalesData] = useState(null);
  const [sessions, setSessions] = useState({ today: [], all: [], years: [] });
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [selectedYearlyYear, setSelectedYearlyYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value || 0);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${baseURL}/availTrainer/session-sales`);
        setSalesData(response.data);
      } catch (err) {
        setError("Failed to fetch sales data");
      }
    };

    const fetchTrainingSessions = async () => {
      try {
        const response = await axios.get(`${baseURL}/availTrainer/get-all-trainers`);
        const allSessions = response.data;
        const today = new Date().setHours(0, 0, 0, 0);
        const years = [...new Set(allSessions.map((s) => new Date(s.createdAt).getFullYear()))];

        setSessions({
          today: allSessions.filter((s) => new Date(s.createdAt).setHours(0, 0, 0, 0) === today),
          all: allSessions,
          years: years.sort((a, b) => b - a),
        });
      } catch (err) {
        setError("Failed to fetch training sessions data");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
    fetchTrainingSessions();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const monthlySessions = sessions.all.filter(
    (s) =>
      new Date(s.createdAt).getFullYear() === selectedMonthYear.year &&
      new Date(s.createdAt).getMonth() + 1 === selectedMonthYear.month
  );
  const totalMonthlySales = monthlySessions.reduce((sum, s) => sum + s.total, 0);

  const yearlySessions = sessions.all.filter(
    (s) => new Date(s.createdAt).getFullYear() === selectedYearlyYear
  );
  const totalYearlySales = yearlySessions.reduce((sum, s) => sum + s.total, 0);

  return (
    <Grid container spacing={2}>
      {salesData &&
        ["todaySales", "monthlySales", "yearlySales"].map((key, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace("Sales", " Session Sales")}
                </Typography>

                <Typography variant="h4">{formatCurrency(salesData?.[key])}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

      <Grid item xs={12}>
        {/* Today's Training Sessions */}
        <Typography variant="h6" gutterBottom>Today's Training Sessions</Typography>
        <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Session Rate</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.today.length > 0 ? (
                sessions.today.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell>{s._id.slice(-6)}</TableCell>
                    <TableCell>{s.userId?.name || "N/A"}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell>{s.package}</TableCell>
                    <TableCell>{formatCurrency(s.sessionRate)}</TableCell>
                    <TableCell>{formatCurrency(s.total)}</TableCell>
                    <TableCell style={{ color: s.status === "active" ? "green" : "gray" }}>
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">No training sessions today</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Monthly Training Sessions */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
          <Typography variant="h6" gutterBottom>Monthly Training Sessions</Typography>
          <Typography variant="h6" color="primary">
             Total Sales for {new Date(0, selectedMonthYear.month - 1).toLocaleString("default", { month: "long" })} {selectedMonthYear.year}: {formatCurrency(totalMonthlySales)}
          </Typography>
        </Box>

        <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
          <Box sx={{ padding: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Select
              value={selectedMonthYear.year}
              onChange={(e) => setSelectedMonthYear((prev) => ({ ...prev, year: Number(e.target.value) }))}
              size="small"
              variant="outlined"
            >
              {sessions.years.map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
            <Select
              value={selectedMonthYear.month}
              onChange={(e) => setSelectedMonthYear((prev) => ({ ...prev, month: Number(e.target.value) }))}
              size="small"
              variant="outlined"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Session Rate</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthlySessions.length > 0 ? (
                monthlySessions.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell>{s._id.slice(-6)}</TableCell>
                    <TableCell>{s.userId?.name || "N/A"}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell>{s.package}</TableCell>
                    <TableCell>{formatCurrency(s.sessionRate)}</TableCell>
                    <TableCell>{formatCurrency(s.total)}</TableCell>
                    <TableCell style={{ color: s.status === "active" ? "green" : "gray" }}>
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">No training sessions this month</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

           {/* Yearly Training Sessions */}
           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
          <Typography variant="h6" gutterBottom>Yearly Training Sessions</Typography>
          <Typography variant="h6" color="primary">
             Total Sales for Year {selectedMonthYear.year}: {formatCurrency(totalYearlySales)}
          </Typography>
        </Box>

        <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
          <Box sx={{ padding: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Select
              value={selectedYearlyYear}
              onChange={(e) => setSelectedYearlyYear(Number(e.target.value))}
              size="small"
              variant="outlined"
            >
              {sessions.years.map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Session Rate</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {yearlySessions.length > 0 ? (
                yearlySessions.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell>{s._id.slice(-6)}</TableCell>
                    <TableCell>{s.userId?.name || "N/A"}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell>{s.package}</TableCell>
                    <TableCell>{formatCurrency(s.sessionRate)}</TableCell>
                    <TableCell>{formatCurrency(s.total)}</TableCell>
                    <TableCell style={{ color: s.status === "active" ? "green" : "gray" }}>
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">No training sessions this year</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default TrainingSessions;
