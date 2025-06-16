import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import { getToken, errMsg, successMsg, getUser } from '../../../utils/helpers';
import baseURL from "../../../utils/baseURL";
import Loader from '../../Layout/Loader';
import * as XLSX from 'xlsx';
import { Box, Typography } from '@mui/material';

const UsersList = () => {
  const user = getUser();
  const userBranch = user.userBranch || '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleted, setIsDeleted] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const listUsers = async () => {
    try {
      const { data } = await axios.post(`${baseURL}/users/get-all-users`, { userBranch }, config);

      console.log(data.users)
      const nonAdminUsers = data.users.filter(user => user.role !== 'admin');

      setAllUsers(nonAdminUsers);
      setFilteredUsers(nonAdminUsers);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const deleteUser = async (id) => {
    try {
      const { data } = await axios.delete(`${baseURL}/users/user-delete/${id}`, config);
      setIsDeleted(data.success);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleExportCSV = () => {
    // Export only the selected users
    const selectedUserData = allUsers.filter(user => selectedUsers.includes(user._id));
    const ws = XLSX.utils.json_to_sheet(selectedUserData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Selected Users');
    XLSX.writeFile(wb, 'selected_users_list.xlsx');
  };

  useEffect(() => {
    listUsers();
    if (error) {
      errMsg(error);
      setError('');
    }
    if (isDeleted) {
      successMsg('User deleted successfully');
      navigate('/admin/users');
    }
  }, [error, isDeleted]);

  useEffect(() => {
    setFilteredUsers(
      allUsers.filter(user =>
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (roleFilter ? user.role.toLowerCase() === roleFilter.toLowerCase() : true)
      )
    );
  }, [searchTerm, allUsers, roleFilter]);

  const deleteUserHandler = (id) => deleteUser(id);

  const columns = [
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'Email', selector: (row) => row.email, sortable: true },
    { name: 'Role', selector: (row) => row.role, sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="actions">
          <Link to={`/admin/user/${row._id}`} className="edit-btn" title="Edit User">
            <FaEdit size={18} />
          </Link>
          <button onClick={() => deleteUserHandler(row._id)} className="delete-btn" title="Delete User">
            <FaTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="users-container">
        <h1>All Users</h1>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <Link
              to="/client/register"
              style={{
                color: '#4ECDC4',
                textDecoration: 'none',
                backgroundColor: 'black',
                padding: 15,
                borderRadius: 20,
              }}
            >
              Add Client
            </Link>
          </Typography>
        </Box>
        <div className="filters">
          <input
            type="text"
            placeholder="Search users..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="role-filter"
            value={roleFilter}
            onChange={handleRoleFilterChange}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="coach">Coach</option>
            <option value="client">Client</option>
          </select>
          <button
            onClick={handleExportCSV}
            className={`export-btn ${!selectedUsers.length ? 'disabled' : ''}`}
            disabled={!selectedUsers.length}
          >
            <FaDownload size={18} /> Export Selected CSV
          </button>

        </div>
        {loading ? <Loader /> :
          <DataTable
            columns={columns}
            data={filteredUsers}
            pagination
            paginationPerPage={itemsPerPage}
            onChangeRowsPerPage={setItemsPerPage}
            highlightOnHover
            responsive
            striped
            selectableRows
            onSelectedRowsChange={state => setSelectedUsers(state.selectedRows.map(row => row._id))}
            selectableRowsHighlight
          />
        }
      </div>
    </>
  );
};
export default UsersList;

/* CSS STYLES */
const styles = `
.users-container {
  max-width: none;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.filters {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}

.search-input, .role-filter {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.export-btn, .delete-selected-btn {
  padding: 10px;
  border: none;
  border-radius: 10px;
  background-color: #28a745;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.export-btn:hover, .delete-selected-btn:hover {
  background-color: #218838;
}

.export-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.actions {
  display: flex;
  gap: 12px;
}

.edit-btn, .delete-btn {
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.edit-btn {
  background: #007bff;
  color: white;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.edit-btn:hover {
  background: #0056b3;
}

.delete-btn:hover {
  background: #a71d2a;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);