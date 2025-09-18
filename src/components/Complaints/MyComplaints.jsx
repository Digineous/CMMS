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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { apiGetMyComplaints } from "../../api/Complaints/api.getMyComplaints";
import { apiRaiseComplaint } from "../../api/Complaints/api.raiseComplaint";
import { apiGetPlant } from "../../api/PlantMaster/api.getplant";
import { apigetLines } from "../../api/LineMaster/api.getline";
import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
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

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openModal, setOpenModal] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    plantNo: 0,
    lineNo: 0,
    machineNo: 0,
    title: "",
    breakdownReasonNo: 0,
    description: "",
    priority: 0,
    assignedOperationalManager: "",
  });
  const [plant, setPlant] = useState([]);
  const [line, setLine] = useState([]);
  const [machine, setMachine] = useState([]);
  const [breakdownReason, setBreakdownReason] = useState([]);
  const [users, setUsers] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [userList, setUserList] = useState([]);



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





  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const response = await apiGetMyComplaints();
      if (response?.data.statusCode === 200) {
        setComplaints(response.data.data || []);
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (error) {
      console.error("Error Fetching Complaints :", error);
      setSnackbar({
        open: true,
        message: "Error Fetching Complaints.",
        severity: "error",
      });
    }
  };

  const fetchPlant = async () => {
    try {
      const response = await apiGetPlant();
      setPlant(response.data.data);
    } catch (error) {
      console.error("Error Fetching Plant: ", error);
      setSnackbar({
        open: true,
        message: "Error Fetching Plant.",
        severity: "error",
      });
    }
  };

  const fetchLine = async () => {
    try {
      const response = await apigetLines();
      setLine(response.data.data);
    } catch (error) {
      console.error("Error Fetching Line: ", error);
      setSnackbar({
        open: true,
        message: "Error Fetching Line.",
        severity: "error",
      });
    }
  };

  const fetchMachine = async () => {
    try {
      const response = await apigetMachine();
      setMachine(response.data.data);
    } catch (error) {
      console.error("Error Fetching Machine: ", error);
      setSnackbar({
        open: true,
        message: "Error Fetching Machine.",
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

 const fetchUsers = async () => {
  try {
    const response = await apigetUsers(); // your API call
    if (response?.data?.statusCode === 200) {
      const allUsers = response.data.data || [];

      // Filter only Operational Managers (roleId === 2)
      const operationalManagers = allUsers.filter((u) =>
        u.roles?.some((role) => role.roleId === 2)
      );

      setUserList(allUsers);           // keep all for reference (if needed)
      setUsers(operationalManagers);   // only roleId 2
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

  useEffect(() => {
    fetchComplaints();
    fetchPlant();
    fetchLine();
    fetchMachine();
    fetchBreakDownReason();
    fetchUsers();
    fetchCompliantsStatus();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddComplaint = async () => {
    try {
      const response = await apiRaiseComplaint(newComplaint);
      if (response?.data?.statusCode === 200) {
        setSnackbar({ open: true, message: "Complaint added!", severity: "success" });
        await fetchComplaints();
        handleCloseModal();
      }
      setSnackbar({
        open: true,
        message: "Complaint added!",
        severity: "success",
      });
      handleCloseModal();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Error adding complaint",
        severity: "error",
      });
    }
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
          My Complaint
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleOpenModal}
          startIcon={<AddIcon />}
        >
          Add New
        </Button>
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
              <StyledTableCell>Current Status</StyledTableCell>
              <StyledTableCell>Assigned Operational Manager</StyledTableCell>
              <StyledTableCell>Breakdown Reason</StyledTableCell>
              <StyledTableCell>Breakdown Time</StyledTableCell>
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
                    <StyledTableCell>{getStatusName(row.currentStatus)}</StyledTableCell>
                    <StyledTableCell>{getUserName(row.assignedOperationalManager)}</StyledTableCell>
                    <StyledTableCell>{getBreakdownReasonName(row.breakdownReasonNo)}</StyledTableCell>
                    <StyledTableCell>
                      {new Date(row.createdAt).toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell>
                      {new Date(row.breakdownTime).toLocaleString()}
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

      {/* Add Complaint Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Complaint</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Plant"
            name="plantNo"
            fullWidth
            value={newComplaint.plantNo}
            onChange={handleInputChange}
          >
            {plant &&
              plant.map((row) => (
                <MenuItem key={row.plantId} value={row.plantNo}>
                  {row.plantName}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            select
            margin="dense"
            label="Line"
            name="lineNo"
            fullWidth
            value={newComplaint.lineNo}
            onChange={handleInputChange}
            disabled={newComplaint.plantNo === 0}
          >
            {line &&
              line.map((row) => (
                <MenuItem key={row.lineId} value={row.lineNo}>
                  {row.lineName}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            select
            margin="dense"
            label="Machine"
            name="machineNo"
            fullWidth
            value={newComplaint.Machine}
            onChange={handleInputChange}
            disabled={newComplaint.lineNo === 0}
          >
            {machine &&
              machine.map((row) => (
                <MenuItem key={row.machineId} value={row.machineNo}>
                  {row.displayMachineName}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={newComplaint.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={newComplaint.description}
            onChange={handleInputChange}
          />
          <TextField
            select
            margin="dense"
            label="Breakdown Reason"
            name="breakdownReasonNo"
            fullWidth
            value={newComplaint.breakdownReasonNo}
            onChange={handleInputChange}
          >
            {breakdownReason &&
              breakdownReason.map((row) => (
                <MenuItem key={row.reasonNo} value={row.reasonNo}>
                  {row.reasonText}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            select
            margin="dense"
            label="Priority"
            name="priority"
            fullWidth
            value={newComplaint.priority}
            onChange={handleInputChange}
          >
            <MenuItem value={1}>Low</MenuItem>
            <MenuItem value={2}>Medium</MenuItem>
            <MenuItem value={3}>High</MenuItem>
          </TextField>
          <TextField
            select
            margin="dense"
            label="Assign To"
            name="assignedOperationalManager"
            fullWidth
            value={newComplaint.assignedOperationalManager}
            onChange={handleInputChange}
          >
            {users && users.map((row) => (
              <MenuItem key={row.userId} value={row.userId} >
                {row.firstName} {row.lastName}
              </MenuItem>
            ))
            }
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleAddComplaint} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

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
