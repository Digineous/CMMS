import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  styled,
  tableCellClasses,
  Snackbar,
  Alert,
} from "@mui/material";
import { apiGetComplaints } from "../../api/Complaints/api.getComplaints";
import { apiGetBreakdownReason } from "../../api/Breakdown/apiGetBreakdownReason";
import { apigetUsers } from "../../api/UserMaster/apiGetUsers";
import { apiGetStatusComplaints } from "../../api/Complaints/api.getComplaintStatus";

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

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [breakdownReason, setBreakdownReason] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
    const [statusList, setStatusList] = useState([]);
    const [userList, setUserList] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const response = await apiGetComplaints();
      if (response?.data.statusCode === 200) {
        setComplaints(response.data.data || []);
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (error) {
      console.error("Error Fetching Complaints :", error);
      setSnackbar({
        open: true,
        message: "Error fetching complaints. Showing dummy data.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchBreakDownReason();
    fetchCompliantsStatus();
    fetchUsers();
  }, []);

    const fetchCompliantsStatus = async () => {
      try {
        const response = await apiGetStatusComplaints();
        if (response?.data?.statusCode === 200) {
          setStatusList(response.data.data || []);
        } else {
          throw new Error("Invalid response");
        }
      } catch (error) {
        console.error("Error Fetching Status Complaints:", error);
        setSnackbar({
          open: true,
          message: "Error fetching complaints status.",
          severity: "error",
        });
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await apigetUsers(); // your API call
        if (response?.data?.statusCode === 200) {
          const allUsers = response.data.data || [];
  
          // Filter only Operational Managers (roleId === 2)
          const operationalManagers = allUsers.filter((u) =>
            u.roles?.some((role) => role.roleId === 2)
          );
  
          setUserList(allUsers); // keep all for reference (if needed)
          setUsers(operationalManagers); // only roleId 2
        } else {
          throw new Error("Invalid response");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setSnackbar({
          open: true,
          message: "Error fetching users.",
          severity: "error",
        });
      }
    };

  const fetchBreakDownReason = async () => {
    try {
      const response = await apiGetBreakdownReason();
      setBreakdownReason(response.data.data);
    } catch (error) {
      console.error("Error Fetching Breakdown Reason: ", error);
      setSnackbar({
        open: true,
        message: "Error Fetching Breakdown Reason.",
        severity: "error",
      });
    }
  };

    const getUserName = (userId) => {
    const found = userList.find((u) => u.userId === userId);
    if (!found) return userId; // fallback to ID if not found
    return `${found.firstName} ${found.lastName || ""}`.trim();
  };

  const getStatusName = (statusId) => {
    const found = statusList.find((s) => s.statusId === statusId);
    return found ? found.statusName : statusId; // fallback to ID if not found
  };

  const getBreakdownReasonName = (reasonNo) => {
    const found = breakdownReason.find((r) => r.reasonNo === reasonNo);
    return found ? found.reasonText : reasonNo; // fallback to ID if not found
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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
          Complaint
        </Typography>
      </div>

      {/* Table */}
      <Box>
        <Table
          size="small"
          style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Complaint No</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Priority</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Breakdown Reason</StyledTableCell>
              <StyledTableCell>Breakdown Time</StyledTableCell>
              <StyledTableCell>Assigned Operational Manager</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints &&
              complaints
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <StyledTableRow key={row.complaintNo}>
                    <StyledTableCell>{row.complaintNo}</StyledTableCell>
                    <StyledTableCell>{row.title}</StyledTableCell>
                    <StyledTableCell>{row.description}</StyledTableCell>
                    <StyledTableCell>
                      {row.priority === 1
                        ? "Low"
                        : row.priority === 2
                        ? "Medium"
                        : "High"}
                    </StyledTableCell>
                    <StyledTableCell>
                      {getStatusName(row.currentStatus)}
                      </StyledTableCell>
                    <StyledTableCell>
                      {getBreakdownReasonName(row.breakdownReasonNo)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {new Date(row.breakdownTime).toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell>
                      {getUserName(row.assignedOperationalManager)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {new Date(row.createdAt).toLocaleString()}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={complaints.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
