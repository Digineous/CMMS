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
  Modal,
  Button,
} from "@mui/material";
import { apiGetAssginWorkOrder } from "../../api/WorkOrders/api.getassignworkorder";
import { apigetUsers } from "../../api/UserMaster/apiGetUsers";
import { apiGetStatusComplaints } from "../../api/Complaints/api.getComplaintStatus";
import { apiVerifyWorkorder } from "../../api/WorkOrders/api.verifyworkorder";
import { apiAssignTechnician } from "../../api/WorkOrders/api.assignTechnician";
import SaveIcon from "@mui/icons-material/Save";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import EngineeringIcon from "@mui/icons-material/Engineering";

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

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openTechnicianModal, setOpenTechnicianModal] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

  const handleOpenStatusModal = (workorder) => {
    setSelectedWorkOrder(workorder);
    setOpenStatusModal(true);
  };

  const handleOpenTechnicianModal = (workorder) => {
    setSelectedWorkOrder(workorder);
    setOpenTechnicianModal(true);
  };

  const handleCloseModals = () => {
    setOpenStatusModal(false);
    setOpenTechnicianModal(false);
    setSelectedWorkOrder(null);
  };

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
        message: error.response.data.message || "Something went wrong.",
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
      setOpenStatusModal(false);
      setSnackbar({
        open: true,
        message: "Work order verified successfully.",
        severity: "success",
      });
      await fetchWorkOrders();
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
      setOpenTechnicianModal(false);
      setSnackbar({
        open: true,
        message: "Technician assigned successfully.",
        severity: "success",
      });
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

  const getStatusName = (statusId) => {
    if (!status || status.length === 0) return statusId; // fallback
    const found = status.find((s) => String(s.statusId) === String(statusId));
    return found ? found.statusName : statusId;
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
              <StyledTableCell>Assigned At</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              {/* <StyledTableCell>Created By</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
              <StyledTableCell>Updated By</StyledTableCell>
              <StyledTableCell>Updated At</StyledTableCell> */}
              {/* New columns */}
              <StyledTableCell>Update Status</StyledTableCell>
              <StyledTableCell>Assign Technician</StyledTableCell>
              {/* <StyledTableCell>Action</StyledTableCell> */}
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
                  <StyledTableCell>
                    {new Date(row.assignedAt).toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell>{row.description}</StyledTableCell>
                  <StyledTableCell>{getStatusName(row.status)}</StyledTableCell>
                  {/* <StyledTableCell>
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
                  </StyledTableCell> */}

                  {/* New editable fields */}
                  <StyledTableCell>
                    <IconButton onClick={() => handleOpenStatusModal(row)}>
                      <SystemUpdateAltIcon fontSize="large" color="primary" />{" "}
                      {/* you can use EditIcon if better */}
                    </IconButton>
                  </StyledTableCell>

                  <StyledTableCell>
                    <IconButton onClick={() => handleOpenTechnicianModal(row)}>
                      <EngineeringIcon fontSize="large" color="secondary" />
                    </IconButton>
                  </StyledTableCell>

                  {/* <StyledTableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleVerifyWorkorder(row.workorderNo)}
                    >
                      <SaveIcon fontSize="large" color="success" />
                    </IconButton>
                  </StyledTableCell> */}
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
      <Modal open={openStatusModal} onClose={handleCloseModals}>
        <Box
          sx={{
            p: 3,
            backgroundColor: "white",
            borderRadius: 2,
            width: 400,
            mx: "auto",
            mt: 10,
          }}
        >
          <Typography variant="h6">Update Status</Typography>
          <TextField
            select
            label="Status"
            fullWidth
            margin="normal"
            value={rowValues[selectedWorkOrder?.workorderNo]?.status || ""}
            onChange={(e) =>
              handleRowChange(
                selectedWorkOrder.workorderNo,
                "status",
                e.target.value
              )
            }
          >
            {status
              .filter((s) => s.statusId === 9 || s.statusId === 10)
              .map((s) => (
                <MenuItem key={s.statusId} value={s.statusId}>
                  {s.statusName}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            label="Status Remark"
            fullWidth
            margin="normal"
            value={
              rowValues[selectedWorkOrder?.workorderNo]?.statusRemarks || ""
            }
            onChange={(e) =>
              handleRowChange(
                selectedWorkOrder.workorderNo,
                "statusRemarks",
                e.target.value
              )
            }
          />
          <Box mt={2} textAlign="right">
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                handleVerifyWorkorder(selectedWorkOrder.workorderNo)
              }
              sx={{
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                px: 3, // padding left-right
                boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
              }}
            >
              Verify
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={openTechnicianModal} onClose={handleCloseModals}>
        <Box
          sx={{
            p: 3,
            backgroundColor: "white",
            borderRadius: 2,
            width: 400,
            mx: "auto",
            mt: 10,
          }}
        >
          <Typography variant="h6">Assign Technician</Typography>
          <TextField
            select
            label="Technician"
            fullWidth
            margin="normal"
            value={rowValues[selectedWorkOrder?.workorderNo]?.technician || ""}
            onChange={(e) =>
              handleRowChange(
                selectedWorkOrder.workorderNo,
                "technician",
                e.target.value
              )
            }
          >
            {users
              .filter(
                (u) =>
                  u.roles?.some(
                    (r) => r.roleId === 5 && r.roleName === "Technician"
                  ) // ✅ Only technicians
              )
              .map((u) => (
                <MenuItem key={u.userId} value={u.userId}>
                  {u.fullName}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            label="Technician Remarks"
            fullWidth
            margin="normal"
            value={
              rowValues[selectedWorkOrder?.workorderNo]?.technicianRemarks || ""
            }
            onChange={(e) =>
              handleRowChange(
                selectedWorkOrder.workorderNo,
                "technicianRemarks",
                e.target.value
              )
            }
          />
          <Box mt={2} textAlign="right">
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                handleAssignWorkorder(selectedWorkOrder.workorderNo)
              }
              sx={{
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                px: 3, // padding left-right
                boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

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
