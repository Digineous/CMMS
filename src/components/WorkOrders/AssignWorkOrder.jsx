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
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { apiGetAssginWorkOrder } from "../../api/WorkOrders/api.getassignworkorder";
import { apigetUsers } from "../../api/UserMaster/apiGetUsers";
import { apiGetStatusComplaints } from "../../api/Complaints/api.getComplaintStatus";
import { apiVerifyWorkorder } from "../../api/WorkOrders/api.verifyworkorder";
import { apiAssignTechnician } from "../../api/WorkOrders/api.assignTechnician";
import SaveIcon from "@mui/icons-material/Save";

// Styled Table Cells
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

export default function AssginWorkOrderPage() {
  const [workOrders, setWorkOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [rowValues, setRowValues] = useState({});
  const [status, setStatus] = useState([]);

  useEffect(() => {
    fetchWorkOrders();
    fetchUsers();
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await apiGetStatusComplaints();
      setStatus(response.data.data);
    } catch (error) {
      console.error("Error fetching Status:", error);
      setSnackbar({
        open: true,
        message: "Error fetching status.",
        severity: "error",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apigetUsers();
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching Users:", error);
      setSnackbar({
        open: true,
        message: "Error fetching users.",
        severity: "error",
      });
    }
  };

  const fetchWorkOrders = async () => {
    try {
      const response = await apiGetAssginWorkOrder();
      setWorkOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching Work Orders:", error);
      setSnackbar({
        open: true,
        message: "Error fetching work orders.",
        severity: "error",
      });
    }
  };

  const handleVerifyWorkorder = async (workorderNo) => {
    const row = rowValues[workorderNo]; // get the row object
    if (!row) return;

    const body = {
      status: row.status,
      remark: row.statusRemarks,
    };

    try {
      const response = await apiVerifyWorkorder(workorderNo, body);
      await handleAssignWorkorder(workorderNo);
    } catch (error) {
      console.error("Error verify Work Orders:", error);
      setSnackbar({
        open: true,
        message: "Error verifying work orders.",
        severity: "error",
      });
    }
  };

  const handleAssignWorkorder = async (workorderNo) => {
    const row = rowValues[workorderNo]; // get the row object
    if (!row) return;
    const body = {
      technicianId: row.technician,
      assignmentRemarks: row.technicianRemarks,
    };

    try {
        const response = await apiAssignTechnician(workorderNo, body);
        await fetchWorkOrders();
    } catch (error) {
      console.error("Error assigning technician :", error);
      setSnackbar({
        open: true,
        message: "Error assigning technician.",
        severity: "error",
      });
    }

    console.log("Technician Update and Id", body, workorderNo);
  };

  // Handler for changing any field
  const handleRowChange = (workorderNo, field, value) => {
    setRowValues((prev) => ({
      ...prev,
      [workorderNo]: {
        ...prev[workorderNo],
        [field]: value,
      },
    }));
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Helpers
  const getUserFullName = (userId) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.fullName : userId;
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
          Assign Work Order
        </Typography>
      </div>

      {/* Table */}
      <Box sx={{ overflow: "scroll" }}>
        <Table
          size="small"
          style={{ boxShadow: "0px 0px 5px rgba(0,0,0,0.3)" }}
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Workorder No</StyledTableCell>
              <StyledTableCell>Complaint No</StyledTableCell>
              <StyledTableCell>Assigned To</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
              <StyledTableCell>Assigned At</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Active</StyledTableCell>
              <StyledTableCell>Created By</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
              <StyledTableCell>Updated By</StyledTableCell>
              <StyledTableCell>Updated At</StyledTableCell>
              {/* New columns */}
              <StyledTableCell>Update Status</StyledTableCell>
              <StyledTableCell>Assign Technician</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <StyledTableRow key={row.workorderNo}>
                  <StyledTableCell>{row.workorderNo}</StyledTableCell>
                  <StyledTableCell>{row.complaintNo}</StyledTableCell>
                  <StyledTableCell>
                    {getUserFullName(row.assignedTo)}
                  </StyledTableCell>
                  <StyledTableCell>{row.assignedRole}</StyledTableCell>
                  <StyledTableCell>
                    {new Date(row.assignedAt).toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell>{row.description}</StyledTableCell>
                  <StyledTableCell>{row.status}</StyledTableCell>
                  <StyledTableCell>
                    {row.isActive ? "Yes" : "No"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {getUserFullName(row.createdBy)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {new Date(row.createdAt).toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell>
                    {getUserFullName(row.updatedBy)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {new Date(row.updatedAt).toLocaleString()}
                  </StyledTableCell>

                  {/* New editable fields */}
                  <StyledTableCell>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                      <TextField
                        select
                        label="Status"
                        size="small"
                        variant="outlined"
                        sx={{ width: "150px" }}
                        value={rowValues[row.workorderNo]?.status || ""}
                        onChange={(e) =>
                          handleRowChange(
                            row.workorderNo,
                            "status",
                            e.target.value
                          )
                        }
                      >
                        {status &&
                          status.map((row) => (
                            <MenuItem key={row.statusId} value={row.statusId}>
                              {row.statusName}
                            </MenuItem>
                          ))}
                      </TextField>
                      <TextField
                        size="small"
                        label="Status Remark"
                        variant="outlined"
                        sx={{ width: "150px" }}
                        value={rowValues[row.workorderNo]?.statusRemarks || ""}
                        onChange={(e) =>
                          handleRowChange(
                            row.workorderNo,
                            "statusRemarks",
                            e.target.value
                          )
                        }
                      />
                    </Box>
                  </StyledTableCell>

                  <StyledTableCell>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                      <TextField
                        select
                        label="Technician"
                        size="small"
                        variant="outlined"
                        sx={{ width: "150px" }}
                        value={rowValues[row.workorderNo]?.technician || ""}
                        onChange={(e) =>
                          handleRowChange(
                            row.workorderNo,
                            "technician",
                            e.target.value
                          )
                        }
                      >
                        {users.map((u) => (
                          <MenuItem key={u.userId} value={u.userId}>
                            {u.fullName}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        size="small"
                        label="Technician Remarks"
                        variant="outlined"
                        sx={{ width: "150px" }}
                        value={
                          rowValues[row.workorderNo]?.technicianRemarks || ""
                        }
                        onChange={(e) =>
                          handleRowChange(
                            row.workorderNo,
                            "technicianRemarks",
                            e.target.value
                          )
                        }
                      />
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleVerifyWorkorder(row.workorderNo)}
                    >
                      <SaveIcon color="success" />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={workOrders.length}
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
