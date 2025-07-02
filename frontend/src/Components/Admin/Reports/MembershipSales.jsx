import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TablePagination,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
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

const MembershipSales = ({ branchId }) => {
  const user = getUser();
  const branch = branchId || user.userBranch;
  const [salesData, setSalesData] = useState(null);
  const [transactions, setTransactions] = useState({ today: [], all: [], years: [] });
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [selectedYearlyYear, setSelectedYearlyYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState("chart");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [branchName, setBranchName] = useState("");
  const [promoFilter, setPromoFilter] = useState("all"); // ✅ New

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);

  const getMonthName = (monthIndex, format = "short") =>
    new Date(0, monthIndex).toLocaleString("default", { month: format });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const body = branch ? { userBranch: branch } : {};
        const token = localStorage.getItem("token");
        const [salesRes, transRes] = await Promise.all([
          axios.post(`${baseURL}/transaction/membership-sales-stats`, body, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.post(`${baseURL}/transaction/get-all-transactions`, body, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const allTransactions = transRes.data.transactions;
        const today = new Date().setHours(0, 0, 0, 0);
        const years = [...new Set(allTransactions.map((t) =>
          new Date(t.subscribedDate).getFullYear()
        ))].sort((a, b) => b - a);

        setTransactions({
          today: allTransactions.filter((t) => new Date(t.subscribedDate) >= today),
          all: allTransactions,
          years,
        });

        setSalesData(salesRes.data);

        if (branch) {
          axios
            .get(`${baseURL}/branch/get-branch/${branch}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setBranchName(res.data.branch.name))
            .catch(() => setBranchName("Unknown Branch"));
        }

      } catch (err) {
        setError("Failed to fetch membership sales data");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
    const interval = setInterval(fetchSalesData, 2000);
    return () => clearInterval(interval);
  }, [branch]);

  const aggregateMonthly = (key) => {
    const monthly = Array.from({ length: 12 }, (_, i) => ({
      month: getMonthName(i),
      [key]: 0,
    }));

    transactions.all.forEach((t) => {
      const date = new Date(t.subscribedDate);
      if (date.getFullYear() === selectedYearlyYear) {
        monthly[date.getMonth()][key] += key === "count" ? 1 : t.amount;
      }
    });

    return monthly;
  };

  const getFilteredTransactions = (filterFn) =>
    transactions.all.filter(filterFn);

  const monthlyTransactions = getFilteredTransactions(
    (t) =>
      new Date(t.subscribedDate).getFullYear() === selectedMonthYear.year &&
      new Date(t.subscribedDate).getMonth() + 1 === selectedMonthYear.month
  );

  const yearlyTransactions = getFilteredTransactions(
    (t) => new Date(t.subscribedDate).getFullYear() === selectedYearlyYear
  );

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px", width: "100%" }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Typography color="error">{error}</Typography>;

  const renderTable = (data, title) => {
    const filteredData = data.filter((t) => {
      if (promoFilter === "with") return !!t.promo;
      if (promoFilter === "none") return !t.promo;
      return true;
    });

    const sortedData = [...filteredData].sort(
      (a, b) => new Date(b.subscribedDate) - new Date(a.subscribedDate)
    );

    const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
          <Typography variant="h6">{title}</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Select size="small" value={promoFilter} onChange={(e) => setPromoFilter(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="with">With Promo</MenuItem>
              <MenuItem value="none">No Promo</MenuItem>
            </Select>
            <Button variant="outlined" onClick={() => setViewMode("chart")}>Back to Chart</Button>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ mb: 1, mt: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Promo</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length ? paginatedData.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>{t._id.slice(-6)}</TableCell>
                  <TableCell>{t.userId?.name || "N/A"}</TableCell>
                  <TableCell>{t.userId?.email || "N/A"}</TableCell>
                  <TableCell>{formatCurrency(t.amount)}</TableCell>
                  <TableCell>{t.transactionType}</TableCell>
                  <TableCell>
                    {t.promo ? (
                      <span style={{ color: "green" }}>{t.promo}</span>
                    ) : (
                      <span style={{ color: "gray", fontStyle: "italic" }}>No Promo</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(t.subscribedDate).toLocaleString("en-PH", {
                      timeZone: "Asia/Manila",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">No transactions</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredData.length}
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
      {transactions.years.map((year) => (
        <MenuItem key={year} value={year}>{year}</MenuItem>
      ))}
    </Select>
  );

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
    doc.text("Membership Sales Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 14, 26);
    doc.text(title, 14, 32);

    const tableData = transactions.all.map((t) => [
      t._id.slice(-6),
      t.userId?.name || "N/A",
      t.userId?.email || "N/A",
      formatCurrency(t.amount),
      t.transactionType,
      t.promo || "Did not avail a promo",
      new Date(t.subscribedDate).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["ID", "Name", "Email", "Amount", "Type", "Promo", "Date"]],
      body: tableData,
      styles: { fontSize: 8 },
    });

    const total = transactions.all.reduce((sum, t) => sum + t.amount, 0);
    doc.setFontSize(12);
    doc.text(`Total Sales: ${formatCurrency(total)}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save(`Membership_Sales_Report_${branchName || "AllBranches"}.pdf`);
  };

  return (
    <Grid container spacing={2}>
      {["today", "monthly", "yearly"].map((mode) => (
        <Grid item xs={12} sm={4} key={mode}>
          <Card onClick={() => setViewMode(mode)} sx={{ cursor: "pointer" }}>
            <CardContent>
              <Typography variant="h6">{mode.charAt(0).toUpperCase() + mode.slice(1)} Sales</Typography>
              <Typography variant="h4">
                {formatCurrency(salesData[`${mode}Total`])}
              </Typography>
              <Typography variant="caption" color="primary">
                View {mode.charAt(0).toUpperCase() + mode.slice(1)} Transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {viewMode === "chart" && (
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button variant="contained" color="primary" onClick={exportToPDF}>
              Export Sales Report (PDF)
            </Button>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Sales Trend ({selectedYearlyYear})</Typography>
            {renderYearSelector(selectedYearlyYear, setSelectedYearlyYear)}
          </Box>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={aggregateMonthly("amount")} margin={{ left: 50, right: 20, top: 20, bottom: 20 }}>
              <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={2} />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={formatCurrency} />
            </LineChart>
          </ResponsiveContainer>

          <Box mt={4}>
            <Typography variant="h6">Transaction Volume ({selectedYearlyYear})</Typography>
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
          {renderTable(transactions.today, "Today's Transactions")}
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
            <Typography variant="subtitle2" color="textSecondary">Total Sales for the Month of</Typography>
            <Typography variant="h6" color="primary">
              {getMonthName(selectedMonthYear.month - 1, "long")} {selectedMonthYear.year}:{" "}
              {formatCurrency(monthlyTransactions.reduce((sum, t) => sum + t.amount, 0))}
            </Typography>
          </Box>
          {renderTable(monthlyTransactions, "Monthly Transactions")}
        </Grid>
      )}

      {viewMode === "yearly" && (
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>{renderYearSelector(selectedYearlyYear, setSelectedYearlyYear)}</Box>
          <Box sx={{ mb: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 2, border: "1px solid #e0e0e0" }}>
            <Typography variant="subtitle2" color="textSecondary">Total Sales for</Typography>
            <Typography variant="h6" color="primary">
              Year {selectedYearlyYear}: {formatCurrency(yearlyTransactions.reduce((sum, t) => sum + t.amount, 0))}
            </Typography>
          </Box>
          {renderTable(yearlyTransactions, "Yearly Transactions")}
        </Grid>
      )}
    </Grid>
  );
};

export default MembershipSales;
