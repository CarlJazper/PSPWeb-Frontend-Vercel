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
  Button,
} from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import baseURL from "../../../utils/baseURL";
import { getUser } from "../../../utils/helpers";

const TrainingSessions = () => {
  const user = getUser();
  const userBranch = user.userBranch || '';
  const [salesData, setSalesData] = useState(null);
  const [sessions, setSessions] = useState({ today: [], all: [], years: [] });
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [selectedYearlyYear, setSelectedYearlyYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState("chart");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value || 0);

  const getMonthName = (monthIndex, format = "short") =>
    new Date(0, monthIndex).toLocaleString("default", { month: format });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const salesRes = await axios.post(`${baseURL}/availTrainer/session-sales`, { userBranch });
        const sessionsRes = await axios.post(`${baseURL}/availTrainer/get-all-trainers`, { userBranch });

        console.log(salesRes,'Sales')
        const allSessions = sessionsRes.data;
        const today = new Date().setHours(0, 0, 0, 0);
        const years = [...new Set(allSessions.map((s) => new Date(s.createdAt).getFullYear()))].sort((a, b) => b - a);

        setSessions({
          today: allSessions.filter((s) => new Date(s.createdAt).setHours(0, 0, 0, 0) === today),
          all: allSessions,
          years,
        });

        setSalesData(salesRes.data);
      } catch (err) {
        setError("Failed to fetch training sessions data");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const aggregateMonthly = (key) => {
    const monthly = Array.from({ length: 12 }, (_, i) => ({
      month: getMonthName(i),
      [key]: 0,
    }));

    sessions.all.forEach((s) => {
      const date = new Date(s.createdAt);
      if (date.getFullYear() === selectedYearlyYear) {
        monthly[date.getMonth()][key] += key === "count" ? 1 : s.total;
      }
    });

    return monthly;
  };

  const renderTable = (data, title) => (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
        <Typography variant="h6">{title}</Typography>
        <Button variant="outlined" onClick={() => setViewMode("chart")}>Back to Chart</Button>
      </Box>
      <TableContainer component={Paper} sx={{ mb: 3, mt: 1 }}>
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
            {data.length ? data.map((s) => (
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
            )) : (
              <TableRow>
                <TableCell colSpan={8} align="center">No training sessions</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  const renderYearSelector = (value, onChange) => (
    <Select value={value} onChange={(e) => onChange(+e.target.value)} size="small">
      {sessions.years.map((year) => (
        <MenuItem key={year} value={year}>{year}</MenuItem>
      ))}
    </Select>
  );

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const monthlySessions = sessions.all.filter(
    (s) =>
      new Date(s.createdAt).getFullYear() === selectedMonthYear.year &&
      new Date(s.createdAt).getMonth() + 1 === selectedMonthYear.month
  );

  const yearlySessions = sessions.all.filter(
    (s) => new Date(s.createdAt).getFullYear() === selectedYearlyYear
  );

  return (
    <Grid container spacing={2}>
      {["today", "monthly", "yearly"].map((mode) => (
        <Grid item xs={12} sm={4} key={mode}>
          <Card onClick={() => setViewMode(mode)} sx={{ cursor: "pointer" }}>
            <CardContent>
              <Typography variant="h6">{mode.charAt(0).toUpperCase() + mode.slice(1)} Session Sales</Typography>
              <Typography variant="h4">{formatCurrency(salesData?.[`${mode}Sales`])}</Typography>
              <Typography variant="caption" color="primary">
                View {mode.charAt(0).toUpperCase() + mode.slice(1)} Sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {viewMode === "chart" && (
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Training Sales Trend ({selectedYearlyYear})</Typography>
            {renderYearSelector(selectedYearlyYear, setSelectedYearlyYear)}
          </Box>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={aggregateMonthly("total")} margin={{ left: 50, right: 20, top: 20, bottom: 20 }}>
              <Line type="monotone" dataKey="total" stroke="#1976d2" strokeWidth={2} />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={formatCurrency} />
            </LineChart>
          </ResponsiveContainer>

          <Box mt={4}>
            <Typography variant="h6">Session Volume ({selectedYearlyYear})</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={aggregateMonthly("count")}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#66bb6a" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      )}

      {viewMode === "today" && (
        <Grid item xs={12}>
          {renderTable(sessions.today, "Today's Training Sessions")}
        </Grid>
      )}

      {viewMode === "monthly" && (
        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            {renderYearSelector(selectedMonthYear.year, (year) =>
              setSelectedMonthYear((prev) => ({ ...prev, year }))
            )}
            <Select
              value={selectedMonthYear.month}
              onChange={(e) =>
                setSelectedMonthYear((prev) => ({ ...prev, month: +e.target.value }))
              }
              size="small"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {getMonthName(i, "long")}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ mb: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 2, border: "1px solid #e0e0e0" }}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Sales for the Month of
            </Typography>
            <Typography variant="h6" color="primary">
              {getMonthName(selectedMonthYear.month - 1, "long")} {selectedMonthYear.year}: {formatCurrency(monthlySessions.reduce((sum, s) => sum + s.total, 0))}
            </Typography>
          </Box>
          {renderTable(monthlySessions, "Monthly Training Sessions")}
        </Grid>
      )}

      {viewMode === "yearly" && (
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>{renderYearSelector(selectedYearlyYear, setSelectedYearlyYear)}</Box>
          <Box sx={{ mb: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 2, border: "1px solid #e0e0e0" }}>
            <Typography variant="subtitle2" color="textSecondary">Total Sales for</Typography>
            <Typography variant="h6" color="primary">
              Year {selectedYearlyYear}: {formatCurrency(yearlySessions.reduce((sum, s) => sum + s.total, 0))}
            </Typography>
          </Box>
          {renderTable(yearlySessions, "Yearly Training Sessions")}
        </Grid>
      )}
    </Grid>
  );
};

export default TrainingSessions;