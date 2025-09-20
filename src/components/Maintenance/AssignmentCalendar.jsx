import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Typography,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { apiGetAssignmentTechnician } from "../../api/Maintenance/api.getAssignmentTechnician";
import { apigetUsers } from "../../api/UserMaster/apiGetUsers";
import { apigetPlanList } from "../../api/Maintenance/api.GetPlanList";
import EditIcon from "@mui/icons-material/Edit";
import { apiUpdateAssignment } from "../../api/Maintenance/api.updateAssignment";
import { apiGetAssignedPlan } from "../../api/Maintenance/api.getAssginedPlan";

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

export default function AssignmentCalendar() {
  const [openDialog, setOpenDialog] = useState(false);
  const [events, setEvents] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [tab, setTab] = useState(0);
  const [userList, setUserList] = useState([]);
  const [planList, setPlanList] = useState([]);
  const [users, setUsers] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [status, setStatus] = useState("InProgress");
  const [processDescription, setProcessDescription] = useState(
    "Assignments InProgress"
  );
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const role = Number(localStorage.getItem("roleId"));

  const handleTabChange = (event, newValue) => setTab(newValue);

  const fetchAssignments = async () => {
    // Read roleId fresh
    const roleIdStr = localStorage.getItem("roleId");
    const roleId = Number(roleIdStr);
    const api = roleId === 4 ? apiGetAssignedPlan : apiGetAssignmentTechnician;

    try {
      const response = await api();
      if (response?.data?.statusCode === 200) {
        const assignments = response.data.data || [];
        setCalendar(assignments);

        const mappedEvents = assignments.map((item) => {
          const today = new Date();
          const startDate = new Date(item.scheduledStart);
          const endDate = new Date(item.scheduledEnd);

          let backgroundColor = "rgba(0, 128, 0, 0.3)";
          if (endDate < today) backgroundColor = "rgba(255, 0, 0, 0.3)";
          else if (startDate <= today && endDate >= today)
            backgroundColor = "rgba(255, 255, 0, 0.3)";

          return {
            id: item.assignmentNo,
            title: item.assignmentDescription,
            start: item.scheduledStart,
            end: item.scheduledEnd,
            backgroundColor,
            borderColor: backgroundColor,
            extendedProps: item,
          };
        });

        setEvents(mappedEvents);
      } else {
        setCalendar([]);
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setCalendar([]);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPlans();
    fetchAssignments();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await apigetPlanList();
      if (response.data.statusCode === 200) {
        setPlanList(response.data.data || []);
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

  const renderEventContent = (eventInfo) => {
    const data = eventInfo.event.extendedProps;

    // Find planName from planList
    const plan = planList.find((p) => p.planNo === data.planNo);
    const planName = plan ? plan.planName : "N/A";

    const tooltip = `
PlanNo: ${data.planNo}
PlanName: ${planName}
AssignedTo: ${getUserName(data.assignedTo)}
AssignedBy: ${getUserName(data.assignedBy)}
Status: ${data.processDescription || "N/A"}
CreatedAt: ${new Date(data.createdAt).toLocaleString()}
  `;

    return (
      <div
        style={{
          fontSize: "11px",
          lineHeight: "1.2em",
          backgroundColor: eventInfo.event.backgroundColor,
          padding: "2px 4px",
          borderRadius: "4px",
          color: "#000",
        }}
        title={tooltip}
      >
        <b>{data.assignmentDescription}</b> <br />
        Plan: {planName} <br />
        Status: {data.status}
      </div>
    );
  };

  const handleOpenDialog = (assignment) => {
    setSelectedAssignmentId(assignment.assignmentNo);
    setSelectedAssignment(assignment);
    setStatus(assignment?.status || "");
    setProcessDescription(assignment?.processDescription || "");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = async () => {
    const payload = {
      status,
      processDescription,
    };
    try {
      const response = await apiUpdateAssignment(selectedAssignmentId, payload);
      if (response.data.statusCode === 200) {
        setSnackbar({
          open: true,
          message: "Assignment updated successfully.",
          severity: "success",
        });
        fetchAssignments(); // Refresh assignments
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      setSnackbar({
        open: true,
        message: "Error updating assignment.",
        severity: "error",
      });
    }
    setOpenDialog(false);
  };

  const getUserName = (userId) => {
    const found = userList.find((u) => u.userId === userId);
    if (!found) return userId; // fallback to ID if not found
    return `${found.firstName} ${found.lastName || ""}`.trim();
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
          marginBottom: "10px",
          marginTop: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          color: "white",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>
          Assignment Dashboard
        </Typography>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{
            minHeight: 24, // smaller overall height
            margin: 1,
            "& .MuiTabs-indicator": { backgroundColor: "transparent" },
          }}
        >
          <Tab
            label="Calendar"
            sx={{
              minHeight: 24,
              color: "#fff",
              backgroundColor: "transparent",
              fontWeight: "bold",
              fontSize: "0.75rem", // smaller text
              padding: "4px 8px", // reduce padding
              "&.Mui-selected": {
                color: "#000",
                backgroundColor: "#fff",
                borderRadius: "4px",
              },
            }}
          />
          <Tab
            label="Table"
            sx={{
              minHeight: 24,
              color: "#fff",
              backgroundColor: "transparent",
              fontWeight: "bold",
              fontSize: "0.75rem",
              padding: "4px 8px",
              "&.Mui-selected": {
                color: "#000",
                backgroundColor: "#fff",
                borderRadius: "4px",
              },
            }}
          />
        </Tabs>
      </div>

      {/* Tab content */}
      {tab === 0 && (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventContent={renderEventContent}
          height="80vh"
        />
      )}

      {tab === 1 && (
        <Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Assignment No</StyledTableCell>
                  <StyledTableCell>Plan Name</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Assigned To</StyledTableCell>
                  <StyledTableCell>Assigned By</StyledTableCell>
                  <StyledTableCell>Scheduled Start</StyledTableCell>
                  <StyledTableCell>Scheduled End</StyledTableCell>
                  {role === 5 && <StyledTableCell>Action</StyledTableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {calendar.map((item) => {
                  // Find planName from planList
                  const plan = planList.find((p) => p.planNo === item.planNo);
                  const planName = plan ? plan.planName : "N/A";

                  return (
                    <StyledTableRow key={item.assignmentNo}>
                      <StyledTableCell>{item.assignmentNo}</StyledTableCell>
                      <StyledTableCell>{planName}</StyledTableCell>{" "}
                      {/* show planName */}
                      <StyledTableCell>
                        {item.assignmentDescription}
                      </StyledTableCell>
                      <StyledTableCell>{item.status}</StyledTableCell>
                      <StyledTableCell>
                        {getUserName(item.assignedTo)}
                      </StyledTableCell>
                      <StyledTableCell>
                        {getUserName(item.assignedBy)}
                      </StyledTableCell>
                      <StyledTableCell>
                        {new Date(item.scheduledStart).toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell>
                        {new Date(item.scheduledEnd).toLocaleString()}
                      </StyledTableCell>
                      {role === 5 && (
                        <StyledTableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <EditIcon />
                          </IconButton>
                        </StyledTableCell>
                      )}
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Update Progress</DialogTitle>
            <DialogContent
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="InProgress">InProgress</MenuItem>
                  <MenuItem value="PartiallyClosed">Partially Closed</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Description"
                multiline
                rows={3}
                fullWidth
                value={processDescription}
                onChange={(e) => setProcessDescription(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </div>
  );
}
