import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Guest
import Home from './Components/Home';
import Coaches from './Components/Coaches';
import Services from './Components/Services';
import Memberships from './Components/Memberships';
import Map from './Components/Map';

// Auth
import Register from './Components/User/Auth/Register';
import Login from './Components/User/Auth/Login';

// User
import Profile from './Components/User/Profile';
import UpdateProfile from './Components/User/UpdateProfile';
import UpdatePassword from './Components/User/UpdatePassword';
import ForgotPassword from './Components/User/ForgotPassword';
import NewPassword from './Components/User/NewPassword';

// Admin
import Dashboard from './Components/Admin/Dashboard';
import UsersList from './Components/Admin/User/UsersList';
import UpdateUser from './Components/Admin/User/UpdateUser';
import BranchList from './Components/Admin/Branch/BranchList';
import CreateBranch from './Components/Admin/Branch/CreateBranch';
import UpdateBranch from './Components/Admin/Branch/UpdateBranch';
import ExerciseList from './Components/Admin/Exercise/ExerciseList';
import CreateExercise from './Components/Admin/Exercise/CreateExercise';
import UpdateExercise from './Components/Admin/Exercise/UpdateExercise';
import TrainerList from './Components/Admin/Trainer/TrainerList';
import CreateTrainer from './Components/Admin/Trainer/CreateTrainer';
import UpdateTrainer from './Components/Admin/Trainer/UpdateTrainer';
import TrainerDetail from './Components/Admin/Trainer/TrainerDetail';
import Reports from './Components/Admin/Reports/Reports';
import MembershipSales from './Components/Admin/Reports/MembershipSales';
import UserLogs from './Components/Admin/Reports/UserLogs';
import LogCharts from './Components/Admin/Reports/LogCharts';
import GymMonitoring from './Components/Admin/Reports/GymMonitoring';
import TrainingSession from './Components/Admin/Reports/TrainingSession';

// Layouts & Utils
import Header from './Components/Layout/Header';
import Footer from './Components/Layout/Footer';
import Exercise from './Components/Exercises';
import ProtectedRoute from './utils/ProtectedRoute';
import SuperAdminDashboard from './Components/Admin/SuperAdminDashboard';

function App() {
  const [refresh, setRefresh] = useState(false);
  const toggleRefresh = () => setRefresh((prev) => !prev);

  return (
    <Router basename="/">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header />

        {/* Main content area grows to push footer down */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            {/* ----------------- Guest Routes ----------------- */}
            <Route path="/" element={<Home />} />
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/services" element={<Services />} />
            <Route path="/memberships" element={<Memberships />} />
            <Route path="/map" element={<Map />} />
            <Route path="/exercises" element={<Exercise />} />

            {/* ----------------- Auth Routes ----------------- */}
            <Route path="/login" element={<Login />} />

            {/* ----------------- Public Password Reset ----------------- */}
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<NewPassword />} />

            {/* ----------------- Protected Profile Routes ----------------- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/me" element={<Profile />} />
              <Route path="/me/update" element={<UpdateProfile />} />
              <Route path="/password/update" element={<UpdatePassword />} />
            </Route>

            {/* ----------------- Protected Admin Routes ----------------- */}
            <Route path="/admin" element={<ProtectedRoute isAdmin={true} />}>
              {/* Dashboard */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="super-dashboard" element={<SuperAdminDashboard/>} />

              {/* User Management */}
              <Route path="users" element={<UsersList />} />
              <Route path="user/:id" element={<UpdateUser />} />
              <Route path="client/register" element={<Register />} />

              {/* Branch Management */}
              <Route path="branches" element={<BranchList refresh={refresh} />} />
              <Route path="create-branch" element={<CreateBranch onBranchCreated={toggleRefresh} />} />
              <Route path="update-branch/:id" element={<UpdateBranch />} />

              {/* Exercise Management */}
              <Route path="exercises" element={<ExerciseList refresh={refresh} />} />
              <Route path="create-exercises" element={<CreateExercise onExerciseCreated={toggleRefresh} />} />
              <Route path="update-exercise/:id" element={<UpdateExercise />} />

              {/* Trainer Management */}
              <Route path="trainers" element={<TrainerList refresh={refresh} />} />
              <Route path="trainer-detail/:id" element={<TrainerDetail />} />
              <Route path="create-trainer" element={<CreateTrainer onTrainerCreated={toggleRefresh} />} />
              <Route path="update-trainer/:id" element={<UpdateTrainer />} />

              {/* Reports */}
              <Route path="reports" element={<Reports />} />
              <Route path="membership-sales" element={<MembershipSales />} />
              <Route path="user-logs" element={<UserLogs refresh={refresh} />} />
              <Route path="log-charts" element={<LogCharts />} />
              <Route path="gym-monitoring" element={<GymMonitoring />} />
              <Route path="training-sessions" element={<TrainingSession />} />
            </Route>
          </Routes>
        </Box>

        <Footer />
      </Box>

      <ToastContainer />
    </Router>
  );
}

export default App;