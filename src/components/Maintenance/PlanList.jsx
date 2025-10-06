import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
  Snackbar,
  Alert,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { apigetPlanList } from "../../api/Maintenance/api.GetPlanList";
import AddIcon from "@mui/icons-material/Add";
import { apiGetPlant } from "../../api/PlantMaster/api.getplant";
import { apigetLines } from "../../api/LineMaster/api.getline";
import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
import { apiAddPlan } from "../../api/Maintenance/api.AddPlan";
import { apigetUsers } from "../../api/UserMaster/apiGetUsers";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { apiAssignPlan } from "../../api/Maintenance/api.assignPlan";
import { getCheckPoint } from "../../api/Maintenance/CheckList/api.getCheckList";

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

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [plantList, setPlantList] = useState([]);
  const [lineList, setLineList] = useState([]);
  const [machineList, setMachineList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [checkList, setCheckList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    planName: "",
    planDescription: "",
    plantNo: "",
    lineNo: "",
    machineNo: "",
    checklistNo: "",
    frequencyType: "",
    // frequencyValue: "",
    estimatedDurationHours: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [assignData, setAssignData] = useState({
    assignedTo: "",
    scheduledStart: "",
    scheduledEnd: "",
    assignmentDescription: "",
  });
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const frequencyTypes = ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];

  useEffect(() => {
    fetchPlans();
    fetchPlant();
    fetchLine();
    fetchMachine();
    fetchUsers();
    fetchCheckList();
  }, []);

  const fetchCheckList = async () => {
    try {
      const response = await getCheckPoint();
      setCheckList(response.data);
    } catch (error) {
      console.error("Error fetching checklist:", error);
      setSnackbar({
        open: true,
        message: "Error fetching checklist.",
        severity: "error",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apigetUsers();
      if (response.data.statusCode === 200) {
        setUserList(response.data.data);
      }
    } catch (error) {
      console.log("Error Fetching User: ", error);
      setSnackbar({
        open: true,
        message: "Error Fetching Users",
        severity: "error",
      });
    }
  };

  const fetchPlant = async () => {
    try {
      const response = await apiGetPlant();
      if (response.status === 200) {
        setPlantList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching plants:", error);
      setSnackbar({
        open: true,
        message: "Error fetching plants.",
        severity: "error",
      });
    }
  };

  const fetchLine = async () => {
    try {
      const response = await apigetLines();
      if (response.status === 200) {
        setLineList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching Line:", error);
      setSnackbar({
        open: true,
        message: "Error fetching line.",
        severity: "error",
      });
    }
  };

  const fetchMachine = async () => {
    try {
      const response = await apigetMachine();
      if (response.status === 200) {
        setMachineList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching Machine:", error);
      setSnackbar({
        open: true,
        message: "Error fetching machine.",
        severity: "error",
      });
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await apigetPlanList();
      if (response.status === 200) {
        setPlans(response.data.data);
        setSnackbar({
          open: true,
          message: "Plans Fetched Successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to fetch plans.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setSnackbar({
        open: true,
        message: "Error fetching plans.",
        severity: "error",
      });
    }
  };

  const getCheckList = (checklistNo) => {
    const checklist = checkList.find(
      (check) => check.checklistNo === checklistNo
    );
    return checklist ? checklist.checklistName : "N/A";
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Close modal
  const handleClose = () => {
    setOpenModal(false);
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      const response = await apiAddPlan(formData);
      if (response.data.statusCode === 200) {
        setSnackbar({
          open: true,
          message: "Plan Added Successfully",
          severity: "success",
        });
        fetchPlans();
      }
    } catch (error) {
      console.error("Error adding plan: ", error);
      setSnackbar({
        open: true,
        message: "Error Adding Plan",
        severity: "error",
      });
    }
    console.log("Payload to send:", formData);
    setOpenModal(false);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleAssignChange = (e) => {
    const { name, value } = e.target;
    setAssignData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssignSubmit = async () => {
    try {
      const response = await apiAssignPlan(selectedPlanId, assignData);
      if (response.data.statusCode === 200) {
        setSnackbar({
          open: true,
          message: "Plan Assigned Successfully",
          severity: "success",
        });
        fetchPlans();
        setOpenAssignDialog(false);
      }
    } catch (error) {
      console.error("Error assigning plan: ", error);
      setSnackbar({
        open: true,
        message: "Error Assigning Plan",
        severity: "error",
      });
    }
  };

  return (
    <div style={{ padding: "0px 20px" }}>
      {/* Gradient Header */}
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
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>
          Plan List
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          sx={{ fontWeight: "bold" }}
          onClick={() => setOpenModal(true)}
        >
          Add
        </Button>
      </div>

      <Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Plan No</StyledTableCell>
                <StyledTableCell>Plan Name</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Checklist</StyledTableCell>
                <StyledTableCell>Frequency</StyledTableCell>
                <StyledTableCell>Duration</StyledTableCell>
                <StyledTableCell>Created At</StyledTableCell>
                <StyledTableCell>Updated At</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((plan) => (
                  <StyledTableRow key={plan.planNo}>
                    <StyledTableCell>{plan.planNo}</StyledTableCell>
                    <StyledTableCell>{plan.planName}</StyledTableCell>
                    <StyledTableCell>{plan.planDescription}</StyledTableCell>
                    <StyledTableCell>{getCheckList(plan.checklistNo)}</StyledTableCell>
                    <StyledTableCell>
                      {plan.frequencyValue} {plan.frequencyType}
                    </StyledTableCell>
                    <StyledTableCell>
                      {plan.estimatedDurationHours} hrs
                    </StyledTableCell>
                    <StyledTableCell>
                      {new Date(plan.createdAt).toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell>
                      {new Date(plan.updatedAt).toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setAssignData({
                            assignedTo: "",
                            scheduledStart: "",
                            scheduledEnd: "",
                            assignmentDescription: "",
                          });
                          setOpenAssignDialog(true);
                          setSelectedPlanId(plan.planNo);
                        }}
                      >
                        <AssignmentIndIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={plans.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      </Box>

      {/* Form Modal */}
      <Dialog
        open={openModal}
        onClose={handleClose}
        fullWidth
        maxWidth="sm" // smaller width since no grid
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Add Maintenance Plan
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              select
              fullWidth
              label="Plant No"
              name="plantNo"
              value={formData.plantNo}
              onChange={handleChange}
            >
              {plantList &&
                plantList.map((plant) => (
                  <MenuItem key={plant.plantNo} value={plant.plantNo}>
                    {plant.plantName}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Line No"
              name="lineNo"
              value={formData.lineNo}
              onChange={handleChange}
              disabled={!formData.plantNo}
            >
              {lineList &&
                lineList.map((line) => (
                  <MenuItem key={line.lineNo} value={line.lineNo}>
                    {line.lineName}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Machine No"
              name="machineNo"
              value={formData.machineNo}
              onChange={handleChange}
              disabled={!formData.lineNo}
            >
              {machineList &&
                machineList.map((machine) => (
                  <MenuItem key={machine.machineNo} value={machine.machineNo}>
                    {machine.displayMachineName}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              fullWidth
              label="Plan Name"
              name="planName"
              value={formData.planName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Plan Description"
              name="planDescription"
              multiline
              rows={3}
              value={formData.planDescription}
              onChange={handleChange}
            />
            <TextField
              select
              fullWidth
              label="Checklist No"
              name="checklistNo"
              value={formData.checklistNo}
              onChange={handleChange}
            >
              {checkList &&
                checkList.map((check) => (
                  <MenuItem key={check.checklistNo} value={check.checklistNo}>
                    {check.checklistName}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Frequency Type"
              name="frequencyType"
              value={formData.frequencyType}
              onChange={handleChange}
            >
              {frequencyTypes &&
                frequencyTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
            </TextField>
            {/* <TextField
              fullWidth
              type="number"
              label="Frequency Value"
              name="frequencyValue"
              value={formData.frequencyValue}
              onChange={handleChange}
            /> */}
            <TextField
              fullWidth
              type="number"
              label="Estimated Duration (hrs)"
              name="estimatedDurationHours"
              value={formData.estimatedDurationHours}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAssignDialog}
        onClose={() => setOpenAssignDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Assign Technician</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              select
              fullWidth
              label="Technician"
              name="assignedTo"
              value={assignData.assignedTo}
              onChange={handleAssignChange}
            >
              {userList &&
                userList
                  .filter((row) => row.roles?.some((r) => r.roleId === 5))
                  .map((user) => (
                    <MenuItem key={user.userId} value={user.userId}>
                      {user.fullName}
                    </MenuItem>
                  ))}
            </TextField>

            <TextField
              type="datetime-local"
              fullWidth
              label="Scheduled Start"
              name="scheduledStart"
              InputLabelProps={{ shrink: true }}
              value={assignData.scheduledStart}
              onChange={handleAssignChange}
            />
            <TextField
              type="datetime-local"
              fullWidth
              label="Scheduled End"
              name="scheduledEnd"
              InputLabelProps={{ shrink: true }}
              value={assignData.scheduledEnd}
              onChange={handleAssignChange}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Assignment Description"
              name="assignmentDescription"
              value={assignData.assignmentDescription}
              onChange={handleAssignChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenAssignDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAssignSubmit}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PlanList;
