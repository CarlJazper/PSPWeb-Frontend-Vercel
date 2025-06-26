import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getToken, errMsg, successMsg, getUser } from '../../../utils/helpers';
import baseURL from '../../../utils/baseURL';
import * as XLSX from 'xlsx';
import {
  Box, Typography, TextField, Button,
  Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Checkbox, IconButton,
  TablePagination, useTheme, alpha, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Fade, CircularProgress
} from '@mui/material';
import { Edit, Delete, Download, Person, PersonAdd } from '@mui/icons-material';

const UsersList = () => {
  const location = useLocation();
  const passedBranchId = location.state?.branchId;
  const user = getUser();
  const userBranch = user.role === 'superadmin' && !passedBranchId ? null : (passedBranchId || user.userBranch);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleted, setIsDeleted] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const navigate = useNavigate();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const listUsers = async () => {
    try {
      const payload = userBranch ? { userBranch } : {};
      const { data } = await axios.post(`${baseURL}/users/get-all-users?role=user`, payload, config);
      const nonAdminUsers = data.users.filter(user => user.role !== 'admin');
      setAllUsers(nonAdminUsers);
      setFilteredUsers(nonAdminUsers);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      const { data } = await axios.delete(`${baseURL}/users/user-delete/${id}`, config);
      setIsDeleted(data.success);
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting user');
    }
  };

  const handleExportCSV = () => {
    const selectedUserData = allUsers.filter(user => selectedUsers.includes(user._id));
    const ws = XLSX.utils.json_to_sheet(selectedUserData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Selected Users');
    XLSX.writeFile(wb, 'selected_users_list.xlsx');
  };

  useEffect(() => {
    listUsers();
  }, [isDeleted]);

  useEffect(() => {
    if (error) {
      errMsg(error);
      setError('');
    }
    if (isDeleted) {
      successMsg('User deleted successfully');
      setIsDeleted('');
    }
  }, [error, isDeleted]);

  useEffect(() => {
    const filtered = allUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(0);
  }, [searchTerm, allUsers]);

  const toggleUserSelection = (id) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = filteredUsers.map(user => user._id);
      setSelectedUsers(allIds);
    } else {
      setSelectedUsers([]);
    }
  };

  const allSelected = filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length;

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 4, borderRadius: 3, background: theme.palette.background.paper, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} sx={{ borderBottom: `1px solid ${theme.palette.divider}`, pb: 2 }}>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Typography variant="h5" fontWeight="bold" display="flex" alignItems="center" gap={1}>
            <Person color="primary" /> User List
          </Typography>
          <TextField label="Search" variant="outlined" size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </Box>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button variant="contained" color="success" size="small" startIcon={<Download />} onClick={handleExportCSV} disabled={!selectedUsers.length}>Export</Button>
          <Button component={Link} to="/admin/client/register" variant="contained"  startIcon={<PersonAdd />} color="primary" size="small">Add Client</Button>
        </Box>
      </Box>

      <Fade in={!loading} unmountOnExit>
        <Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={allSelected} indeterminate={selectedUsers.length > 0 && !allSelected} onChange={handleSelectAll} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Id</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
                  <TableRow key={user._id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedUsers.includes(user._id)} onChange={() => toggleUserSelection(user._id)} />
                    </TableCell>
                    <TableCell>{user._id.slice(-6)}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="center">
                      <IconButton component={Link} to={`/admin/user/${user._id}`} color="primary"><Edit /></IconButton>
                      <IconButton onClick={() => { setUserToDelete(user._id); setOpenConfirm(true); }} color="error"><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>Are you sure you want to delete this user? This action cannot be undone.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirm(false)} color="primary">Cancel</Button>
              <Button onClick={() => { deleteUser(userToDelete); setOpenConfirm(false); }} color="error">Delete</Button>
            </DialogActions>
          </Dialog>

          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Box>
      </Fade>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress color="primary" />
        </Box>
      )}
    </Paper>
  );
};

export default UsersList;
