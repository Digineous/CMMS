import React, { useEffect, useState } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Snackbar,
    Alert,
    Button,
    Autocomplete,
    TextField,
    styled,
    tableCellClasses,
} from "@mui/material";
import { apiGetComplaintsHistory } from "../../api/Complaints/api.getComplaintsHistory";
import { apiGetStatusComplaints } from "../../api/Complaints/api.getComplaintStatus";
import { apigetUsers } from "../../api/UserMaster/apiGetUsers";
import { apiGetComplaints } from "../../api/Complaints/api.getComplaints";

// Styled Table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#1FAEC5",
        color: theme.palette.common.white,
        fontWeight: "bold",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

export default function ComplaintsHistory() {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [history, setHistory] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [showDetails, setShowDetails] = useState(true);

    // --- Helpers ---
    const getStatusName = (statusId) => {
        const found = statusList.find((s) => s.statusId === statusId);
        return found ? found.statusName : statusId;
    };

    const getUserName = (userId) => {
        const found = userList.find((u) => u.userId === userId);
        return found ? `${found.firstName} ${found.lastName || ""}`.trim() : userId;
    };

    // --- API Fetch ---
    const fetchComplaints = async () => {
        try {
            const response = await apiGetComplaints();
            if (response?.data) {
                setComplaints(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching complaints:", error);
            setSnackbar({
                open: true,
                message: "Error fetching complaints.",
                severity: "error",
            });
        }
    };

    const fetchComplaintHistory = async (complaintNo) => {
        try {
            const response = await apiGetComplaintsHistory(complaintNo);
            if (response?.data?.data) {
                setHistory(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
            setSnackbar({
                open: true,
                message: "Error fetching complaint history.",
                severity: "error",
            });
        }
    };

    const fetchStatusList = async () => {
        try {
            const response = await apiGetStatusComplaints();
            if (response?.data?.statusCode === 200) {
                setStatusList(response.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching statuses:", err);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await apigetUsers();
            if (response?.data?.statusCode === 200) {
                setUserList(response.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    useEffect(() => {
        fetchComplaints();
        fetchStatusList();
        fetchUsers();
    }, []);

    const handleOkClick = () => {
        if (selectedComplaint) {
            fetchComplaintHistory(selectedComplaint.complaintNo);
        }
    };

    const handleCloseSnackbar = () =>
        setSnackbar((prev) => ({ ...prev, open: false }));

    return (
        <div style={{ padding: "0px 20px" }}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    background:
                        "linear-gradient(to right, rgb(0, 93, 114), rgb(79, 223, 255))",
                    padding: "5px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    marginTop: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    color: "white",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h5" style={{ fontWeight: "bold", color: "#fff" }}>
                    Complaints History
                </Typography>
            </div>

            {/* Search & Complaint Details Row */}
            <Box display="flex" gap={3} alignItems="flex-start" mb={3}>
                {/* Autocomplete + OK Button */}
                <Box display="flex" gap={2} alignItems="center">
                    <Autocomplete
                        options={complaints}
                        getOptionLabel={(option) =>
                            `${option.complaintNo} - ${option.title || "No Title"}`
                        }
                        sx={{ width: 400 }}
                        value={selectedComplaint}
                        onChange={(event, newValue) => {
                            setSelectedComplaint(newValue);
                            setShowDetails(true);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Select Complaint" variant="outlined" />
                        )}
                    />
                      <Button
                            variant="contained"
                            sx={{ margin: "5px" }}
                            color="secondary"
                            onClick={() => {
                                handleOkClick();
                                setShowDetails(false); // 👈 hide details when clicking
                            }}
                            disabled={!selectedComplaint}
                        >
                            Get History
                        </Button>

                </Box>

                
                {/* Complaint Details Card */}

            </Box>




            {/* Complaint History Table */}
            {history.length > 0 && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Complaint History
                    </Typography>
                    <Table
                        size="small"
                        style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
                    >
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>From Status</StyledTableCell>
                                <StyledTableCell>To Status</StyledTableCell>
                                <StyledTableCell>Remarks</StyledTableCell>
                                <StyledTableCell>Changed By</StyledTableCell>
                                <StyledTableCell>Changed At</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...history] 
                                .reverse()  
                                .map((row) => (
                                    <StyledTableRow key={row.historyNo}>
                                        <StyledTableCell>
                                            {getStatusName(row.fromStatus) ?? "Create"}
                                        </StyledTableCell>
                                        <StyledTableCell>{getStatusName(row.toStatus)}</StyledTableCell>
                                        <StyledTableCell>{row.changeRemarks}</StyledTableCell>
                                        <StyledTableCell>{getUserName(row.changedBy)}</StyledTableCell>
                                        <StyledTableCell>
                                            {new Date(row.changedAt).toLocaleString()}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                        </TableBody>
                    </Table>
                </Box>
            )}

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
