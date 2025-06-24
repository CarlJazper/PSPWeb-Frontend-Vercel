import React, { useEffect, useState } from 'react';
import {
    Grid,
    Card,
    Typography,
    CircularProgress,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from '@mui/material';
import { Group, Person, Business, Close } from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../../utils/baseURL';
import { getToken, getUser } from '../../../utils/helpers';
import BranchList from '../Branch/BranchList';
import UsersList from '../User/UsersList';
import TrainerList from '../Trainer/TrainerList';
import MembershipSales from './MembershipSales';
import SessionSales from './SessionSales';



const StatCard = ({ title, subheader, count, icon, color, onClick }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Card
            sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, cursor: onClick ? 'pointer' : 'default' }}
            onClick={onClick}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color }}>{icon}</Box>
                <Box>
                    <Typography variant="subtitle2">{title}</Typography>
                    {subheader && (
                        <Typography variant="caption" color="text.secondary">
                            {subheader}
                        </Typography>
                    )}
                </Box>
            </Box>
            <Typography variant="h5" fontWeight="bold" sx={{ pl: 6 }}>
                {count}
            </Typography>
        </Card>
    </Grid>
);

const Overview = () => {
    const [userCount, setUserCount] = useState(0);
    const [trainerCount, setTrainerCount] = useState(0);
    const [branchCount, setBranchCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userLoaded, setUserLoaded] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const [openBranchModal, setOpenBranchModal] = useState(false);
    const [openUserModal, setOpenUserModal] = useState(false);
    const [openTrainerModal, setOpenTrainerModal] = useState(false);

    const [totalSalesYearly, setTotalSalesYearly] = useState(0);
    const [openSalesModal, setOpenSalesModal] = useState(false);

    const [openSessionSalesModal, setOpenSessionSalesModal] = useState(false);
    const [totalSessionSalesYearly, setTotalSessionSalesYearly] = useState(0);


    useEffect(() => {
        const user = getUser();
        setCurrentUser(user);
        setUserLoaded(true);
    }, []);

    useEffect(() => {
        const fetchAllOverview = async () => {
            if (!userLoaded || !currentUser || currentUser.role !== 'superadmin') return;

            setLoading(true);
            try {
                const config = {
                    headers: { Authorization: `Bearer ${getToken()}` },
                };

                const [usersRes, trainersRes, branchesRes, salesRes, sessionSalesRes] = await Promise.all([

                    axios.post(`${baseURL}/users/get-all-users`, {}, config),
                    axios.post(`${baseURL}/users/get-all-users?role=coach`, {}, config),
                    axios.get(`${baseURL}/branch/get-all-branches`, config),
                    axios.post(`${baseURL}/transaction/membership-sales-stats`, {}, config), // 💡 No branch = all branches
                    axios.post(`${baseURL}/availTrainer/session-sales`, {}, config), // 👈 all branches

                ]);

                setTotalSalesYearly(salesRes.data.yearlyTotal || 0);
                setTotalSessionSalesYearly(sessionSalesRes.data.yearlySales || 0);


                setUserCount(usersRes.data.users?.length || 0);
                setTrainerCount(trainersRes.data.users?.length || 0);

                // ✅ Corrected key for branches
                const branches = branchesRes.data.branch || [];
                setBranchCount(Array.isArray(branches) ? branches.length : 0);


            } catch (err) {
                console.error('Failed to fetch superadmin overview:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllOverview();
    }, [userLoaded, currentUser]);

    if (!userLoaded || !currentUser || currentUser.role !== 'superadmin') return null;

    return (
        <Box mt={2}>
            <Typography variant="h5" mb={2}>
                Superadmin Overview (All Branches)
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container spacing={2}>
                        <StatCard
                            title="Total Users"
                            subheader="Click to view all"
                            count={userCount}
                            icon={<Group fontSize="large" />}
                            color="#007aff"
                            onClick={() => setOpenUserModal(true)} // 👈 add this
                        />

                        <StatCard
                            title="Total Trainers"
                            subheader="Click to view all"
                            count={trainerCount}
                            icon={<Person fontSize="large" />}
                            color="#5856d6"
                            onClick={() => setOpenTrainerModal(true)} // 👈 click to open trainer list
                        />

                        <StatCard
                            title="Total Branches"
                            subheader="Click to manage"
                            count={branchCount}
                            icon={<Business fontSize="large" />}
                            color="#34C759"
                            onClick={() => setOpenBranchModal(true)}
                        />

                        <StatCard
                            title="Total Membership Sales"
                            subheader="Yearly Total"
                            count={`₱${totalSalesYearly.toLocaleString()}`}
                            icon={<Group fontSize="large" />}
                            color="#ff9500"
                            onClick={() => setOpenSalesModal(true)}
                        />

                        <StatCard
                            title="Total Session Sales"
                            subheader="Yearly Total"
                            count={`₱${totalSessionSalesYearly.toLocaleString()}`}
                            icon={<Group fontSize="large" />}
                            color="#ff3b30"
                            onClick={() => setOpenSessionSalesModal(true)}
                        />


                    </Grid>
                    {/* Branches */}
                    <Dialog
                        open={openBranchModal}
                        onClose={() => setOpenBranchModal(false)}
                        fullWidth
                        maxWidth="md"
                    >
                        <DialogTitle>
                            Manage Branches
                            <IconButton
                                onClick={() => setOpenBranchModal(false)}
                                sx={{ position: 'absolute', top: 8, right: 8 }}
                            >
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <BranchList />
                        </DialogContent>
                    </Dialog>
                    {/* Users */}
                    <Dialog
                        open={openUserModal}
                        onClose={() => setOpenUserModal(false)}
                        fullWidth
                        maxWidth="lg"
                    >
                        <DialogTitle>
                            All Users
                            <IconButton
                                onClick={() => setOpenUserModal(false)}
                                sx={{ position: 'absolute', top: 8, right: 8 }}
                            >
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <UsersList />
                        </DialogContent>
                    </Dialog>
                    {/* Trainers */}
                    <Dialog
                        open={openTrainerModal}
                        onClose={() => setOpenTrainerModal(false)}
                        fullWidth
                        maxWidth="lg"
                    >
                        <DialogTitle>
                            All Trainers
                            <IconButton
                                onClick={() => setOpenTrainerModal(false)}
                                sx={{ position: 'absolute', top: 8, right: 8 }}
                            >
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <TrainerList />
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={openSalesModal}
                        onClose={() => setOpenSalesModal(false)}
                        fullWidth
                        maxWidth="xl"
                    >
                        <DialogTitle>
                            Membership Sales Report
                            <IconButton
                                onClick={() => setOpenSalesModal(false)}
                                sx={{ position: 'absolute', top: 8, right: 8 }}
                            >
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <MembershipSales /> {/* No props passed = ALL branches */}
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={openSessionSalesModal}
                        onClose={() => setOpenSessionSalesModal(false)}
                        fullWidth
                        maxWidth="xl"
                    >
                        <DialogTitle>
                            Session Sales Report
                            <IconButton
                                onClick={() => setOpenSessionSalesModal(false)}
                                sx={{ position: 'absolute', top: 8, right: 8 }}
                            >
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <SessionSales /> {/* Show all sessions across branches */}
                        </DialogContent>
                    </Dialog>


                </>
            )}
        </Box>
    );
};

export default Overview;
