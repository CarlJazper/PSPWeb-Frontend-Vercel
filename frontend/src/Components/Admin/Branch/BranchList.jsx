import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { toast } from "react-toastify";
import baseURL from "../../../utils/baseURL";

const BranchList = ({ refresh }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetchBranches();
  }, [refresh]);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/branch/get-all-branches`);
      setBranches(response.data.branch);
    } catch (error) {
      console.error("Error fetching branches", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDelete = (id) => {
    setBranchToDelete(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${baseURL}/branch/delete-branch/${branchToDelete}`);
      setBranches(branches.filter((branch) => branch._id !== branchToDelete));
      toast.success("Branch deleted successfully");
    } catch (error) {
      console.error("Error deleting branch", error);
      toast.error("Failed to delete branch");
    } finally {
      setOpenDialog(false);
      setBranchToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setBranchToDelete(null);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 4,
        mb: 4,
        borderRadius: 3,
        background: theme.palette.background.paper,
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)'
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}`, pb: 2 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessOutlinedIcon sx={{ fontSize: 28 }} />
          Branch Management
        </Typography>
        <Button
          component={Link}
          to="/admin/create-branch"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1,
            background: theme.palette.primary.main,
            '&:hover': { background: theme.palette.primary.dark },
          }}
        >
          Add New Branch
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 8 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Branch Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact Details</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {branches.length > 0 ? (
                branches.map((branch) => (
                  <TableRow key={branch._id} hover sx={{ '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.02) } }}>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{branch.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2">{branch.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2">{branch.contact}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2">{branch.place}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Branch">
                          <IconButton
                            component={Link}
                            to={`/admin/update-branch/${branch._id}`}
                            size="small"
                            sx={{
                              color: theme.palette.primary.main,
                              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Branch">
                          <IconButton
                            onClick={() => handleOpenDelete(branch._id)}
                            size="small"
                            sx={{
                              color: theme.palette.error.main,
                              '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.1) },
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8, color: 'text.secondary', backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <BusinessOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                      <Typography variant="body1">No branches found</Typography>
                      <Button
                        component={Link}
                        to="/admin/create-branch"
                        variant="outlined"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{ mt: 2, textTransform: 'none' }}
                      >
                        Add Your First Branch
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this branch? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BranchList;