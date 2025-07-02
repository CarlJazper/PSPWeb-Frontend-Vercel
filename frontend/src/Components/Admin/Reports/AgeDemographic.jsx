import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, IconButton,
    FormControl, InputLabel, Select, MenuItem, Box, Typography
} from '@mui/material';
import { Close } from '@mui/icons-material';

const AgeDemographic = ({
    open,
    onClose,
    ageData,
    branchList,
    selectedBranch,
    onBranchChange
}) => (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
            Age Demographics
            <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                <Close />
            </IconButton>
        </DialogTitle>
        <DialogContent dividers>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Filter by Branch</InputLabel>
                <Select
                    value={selectedBranch}
                    label="Filter by Branch"
                    onChange={(e) => onBranchChange(e.target.value)}
                >
                    <MenuItem value="">All Branches</MenuItem>
                    {branchList.map(branch => (
                        <MenuItem key={branch._id} value={branch._id}>
                            {branch.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {Object.entries(ageData).map(([group, count]) => (
                <Box key={group} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography>{group}</Typography>
                    <Typography fontWeight="bold">{count}</Typography>
                </Box>
            ))}
        </DialogContent>
    </Dialog>
);

export default AgeDemographic;
