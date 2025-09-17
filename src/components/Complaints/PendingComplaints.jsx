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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { apiGetStatusComplaints } from "../../api/Complaints/api.getComplaintStatus";
import { apiGetPendingComplaints } from "../../api/Complaints/api.getPendingComplaints";
import { apiVerifyCompliant } from "../../api/Complaints/api.VerifyComplaint";
import { apigetUsers } from "../../api/UserMaster/apiGetUsers";
import { apiAssignManager } from "../../api/Complaints/api.assignManager";
import SaveIcon from "@mui/icons-material/Save";

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

export default function PendingComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [status, setStatus] = useState([]);
  const [verifyComplaints, setVerifyComplaints] = useState({});

  // Assign Manager Modal State
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignManagerData, setAssignManagerData] = useState({
    manager: "",
    description: "",
  });
  const [users, setUsers] = useState([]);

  const fetchCompliantsStatus = async () => {
    try {
      const response = await apiGetStatusComplaints();
      setStatus(response.data.data || []);
    } catch (error) {
      console.error("Error Fetching Status Complaints:", error);
      setSnackbar({
        open: true,
        message: "Error fetching complaints status.",
        severity: "error",
      });
    }
  };

  const fetchPendingComplaints = async () => {
    try {
      const response = await apiGetPendingComplaints();
      if (response?.data.statusCode === 200) {
        setComplaints(response.data.data || []);
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Error Fetching Pending Complaints:", error);
      setSnackbar({
        open: true,
        message: "Error fetching pending complaints.",
        severity: "error",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apigetUsers();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error Fetching Users: ", error);
      setSnackbar({
        open: true,
        message: "Error Fetching User",
        severity: "error"
      })
    }
  }

  useEffect(() => {
    fetchPendingComplaints();
    fetchCompliantsStatus();
    fetchUsers();
  }, []);

  const handleInputChange = (complaintNo, field, value) => {
    setVerifyComplaints((prev) => ({
      ...prev,
      [complaintNo]: {
        ...prev[complaintNo],
        [field]: value,
      },
    }));
  };

  const handleVerifyComplaint = async (id) => {
    try {
      await apiVerifyCompliant(id, verifyComplaints[id]);

      // Open Assign Manager modal after saving
      setSelectedComplaint(id);
      setAssignManagerData({ manager: "", description: "" });
      setOpenAssignModal(true);
    } catch (error) {
      console.error("Error Updating Verify Status: ", error);
      setSnackbar({
        open: true,
        message: "Error Updating Verify Status.",
        severity: "error",
      });
    }
  };

  const handleAssignManagerSave = async () => {
    try {
      const response = await apiAssignManager(selectedComplaint, assignManagerData)
      setSnackbar({
        open: true,
        message: "Manager assigned successfully!",
        severity: "success",
      });

      setOpenAssignModal(false);
      setSelectedComplaint(null);

      // Refresh table
      await fetchPendingComplaints();
    } catch (error) {
      console.error("Error assigning manager:", error);
      setSnackbar({
        open: true,
        message: "Error assigning manager.",
        severity: "error",
      });
    }
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
          Pending Complaints
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
              <StyledTableCell>Created At</StyledTableCell>
              <StyledTableCell>Set Status</StyledTableCell>
              <StyledTableCell>Set Remark</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints
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
                    {row.currentStatus === 1 ? "Pending" : "Closed"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {new Date(row.createdAt).toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      select
                      margin="dense"
                      label="Status"
                      fullWidth
                      sx={{ width: "150px" }}
                      value={verifyComplaints[row.complaintNo]?.status || ""}
                      onChange={(e) =>
                        handleInputChange(
                          row.complaintNo,
                          "status",
                          e.target.value
                        )
                      }
                    >
                      {status.map((s) => (
                        <MenuItem key={s.statusId} value={s.statusId}>
                          {s.statusName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </StyledTableCell>

                  <StyledTableCell>
                    <TextField
                      margin="dense"
                      label="Remark"
                      fullWidth
                      sx={{ width: "150px" }}
                      value={verifyComplaints[row.complaintNo]?.remark || ""}
                      onChange={(e) =>
                        handleInputChange(
                          row.complaintNo,
                          "remark",
                          e.target.value
                        )
                      }
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleVerifyComplaint(row.complaintNo)}
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
          count={complaints.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Assign Manager Modal */}
      <Dialog open={openAssignModal} onClose={() => setOpenAssignModal(false)}>
        <DialogTitle>Assign Manager</DialogTitle>
        <DialogContent>
          <TextField
            label="Assign Manager"
            select
            fullWidth
            margin="dense"
            value={assignManagerData.manager}
            onChange={(e) =>
              setAssignManagerData((prev) => ({
                ...prev,
                manager: e.target.value,
              }))
            }
          >
            {users && users.map((row) => (
              <MenuItem key={row.userId} value={row.userId} >
                {row.firstName} {row.lastName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            multiline
            rows={3}
            value={assignManagerData.description}
            onChange={(e) =>
              setAssignManagerData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAssignManagerSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

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
