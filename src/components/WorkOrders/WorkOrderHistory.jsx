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
import { apiGetWorkOrderHistory } from "../../api/WorkOrders/api.getWorkOrderHistory";
import { apiGetStatusComplaints } from "../../api/Complaints/api.getComplaintStatus";
import { apigetUsers } from "../../api/UserMaster/apiGetUsers";
import { apiGetAllWorkOrdersForHisotry } from "../../api/WorkOrders/api.getAllWorkOrdersForHisotry";
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

export default function WorkOrderHistory() {
  const [workOrders, setWorkOrders] = useState([]);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
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
  const fetchWorkOrders = async () => {
    try {
      const [woRes, complaintsRes] = await Promise.all([
        apiGetAllWorkOrdersForHisotry(),
        apiGetComplaints(),
      ]);

      if (woRes?.data?.data && complaintsRes?.data) {
        const complaintsData = complaintsRes.data.data;

        // merge complaint title into work order list
        const merged = woRes.data.data.map((wo) => {
          const complaint = complaintsData.find(
            (c) => c.complaintNo === wo.complaintNo
          );
          return {
            ...wo,
            complaintTitle: complaint ? complaint.title : "No Title",
          };
        });

        setWorkOrders(merged);
      }
    } catch (error) {
      console.error("Error fetching work orders or complaints:", error);
      setSnackbar({
        open: true,
        message: "Error fetching work orders or complaints.",
        severity: "error",
      });
    }
  };

  const fetchWorkOrderHistory = async (workorderNo) => {
    try {
      const response = await apiGetWorkOrderHistory(workorderNo);
      if (response?.data?.data) {
        // reverse order so latest comes first
        setHistory((response.data.data || []).reverse());
      }
    } catch (error) {
      console.error("Error fetching work order history:", error);
      setSnackbar({
        open: true,
        message: "Error fetching work order history.",
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
    fetchWorkOrders();
    fetchStatusList();
    fetchUsers();
  }, []);

  const handleOkClick = () => {
    if (selectedWorkOrder) {
      fetchWorkOrderHistory(selectedWorkOrder.workorderNo);
      setShowDetails(false);
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
          Work Order History
        </Typography>
      </div>

      {/* Search & Work Order Details Row */}
      <Box display="flex" gap={3} alignItems="flex-start" mb={3}>
        {/* Autocomplete */}
        <Box display="flex" gap={2} alignItems="center">
          <Autocomplete
            options={workOrders}
            getOptionLabel={(option) =>
              option
                ? `${option.complaintNo} - ${option.complaintTitle || "No Title"}`
                : ""
            }
            sx={{ width: 400 }}
            value={selectedWorkOrder}
            onChange={(event, newValue) => {
              setSelectedWorkOrder(newValue);
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
              onClick={handleOkClick}
              disabled={!selectedWorkOrder}
            >
              Get History
            </Button>
        </Box>
      </Box>

      {/* Work Order History Table */}
      {history.length > 0 && (
        <Box>

          <Table
            size="small"
            style={{ boxShadow: "0px 0px 5px rgba(0,0,0,0.3)" }}
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
              {history.map((row) => (
                <StyledTableRow key={row.historyNo}>
                  <StyledTableCell>
                    {row.fromStatus ? getStatusName(row.fromStatus) : "Create"}
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
