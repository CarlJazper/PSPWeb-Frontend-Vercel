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
  TablePagination,
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TrainingSessions = ({ branchId }) => {
  const user = getUser();
  const userBranch = branchId || user.userBranch || '';
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [branchName, setBranchName] = useState("");

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value || 0);

  const getMonthName = (monthIndex, format = "short") =>
    new Date(0, monthIndex).toLocaleString("default", { month: format });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const body = user.role === 'superadmin'
          ? (branchId ? { userBranch: branchId } : {}) // only include if explicitly passed
          : { userBranch: user.userBranch };

        const salesRes = await axios.post(`${baseURL}/availTrainer/session-sales`, body);
        const sessionsRes = await axios.post(`${baseURL}/availTrainer/get-all-trainers`, body);


        console.log(salesRes, 'Sales')
        const allSessions = sessionsRes.data;
        const today = new Date().setHours(0, 0, 0, 0);
        const years = [...new Set(allSessions.map((s) => new Date(s.createdAt).getFullYear()))].sort((a, b) => b - a);

        setSessions({
          today: allSessions.filter((s) => new Date(s.createdAt).setHours(0, 0, 0, 0) === today),
          all: allSessions,
          years,
        });

        setSalesData(salesRes.data);

        if (userBranch) {
          axios
            .get(`${baseURL}/branch/get-branch/${userBranch}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
              setBranchName(res.data.branch.name); // ✅ Adjust if structure is different
            })
            .catch(() => {
              setBranchName("Unknown Branch");
            });
        }


      } catch (err) {
        setError("Failed to fetch training sessions data");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
    const interval = setInterval(fetchSalesData, 2000);
    return () => clearInterval(interval);
  }, [userBranch]);

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

  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = branchName ? `Branch: ${branchName}` : "All Branches";
    const date = new Date().toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    doc.setFontSize(16);
    doc.text("Training Session Sales Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 14, 26);
    doc.text(title, 14, 32);

    const tableData = sessions.all.map((s) => [
      s._id.slice(-6),
      s.userId?.name || "N/A",
      s.email,
      s.phone,
      s.package,
      formatCurrency(s.sessionRate),
      formatCurrency(s.total),
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["ID", "Name", "Email", "Phone", "Package", "Rate", "Total"]],
      body: tableData,
      styles: { fontSize: 8 },
    });

    const total = sessions.all.reduce((sum, s) => sum + s.total, 0);
    doc.setFontSize(12);
    doc.text(`Total Sales: ${formatCurrency(total)}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save(`Session_Sales_Report_${branchName || "AllBranches"}.pdf`);
  };

  const renderTable = (data, title) => {
    const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
          <Typography variant="h6">{title}</Typography>
          <Button variant="outlined" onClick={() => setViewMode("chart")}>Back to Chart</Button>
        </Box>

        <TableContainer component={Paper} sx={{ mb: 1, mt: 1 }}>
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
              {paginatedData.length ? paginatedData.map((s) => (
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

        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </>
    );
  };


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
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button variant="contained" color="primary" onClick={exportToPDF}>
              Export Report (PDF)
            </Button>
          </Box>

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