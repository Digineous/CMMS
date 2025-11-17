import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Fab,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { apiCalenderEvent } from "../../api/Maintenance/api.CalenderEvent";
import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
import { getCheckPoint } from "../../api/Maintenance/CheckList/api.getCheckList";
import { apiGenerateOccurrences } from "../../api/Maintenance/api.generateOccurances";
import { apiOccurrenceDetails } from "../../api/Maintenance/api.occurrenceDetails";
import { apiCheckChecklist } from "../../api/Maintenance/api.checkChecklist";

export default function MaintenanceCalendar() {
  const roleId = localStorage.getItem("roleId");
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [machines, setMachines] = useState([]);
  const [machineMap, setMachineMap] = useState({});
  const [checklists, setChecklists] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedChecklistNos, setSelectedChecklistNos] = useState([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [occDetails, setOccDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);


  const [visibleRange, setVisibleRange] = useState({ start: null, end: null });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [loadingCalendar, setLoadingCalendar] = useState(false);

  const cleanDate = (str) => (str ? str.split("T")[0] : null);

  useEffect(() => {
    fetchMachines();
    fetchCheckLists();
  }, []);

  // ---------------------------
  // FETCH MACHINES (ASYNC/AWAIT)
  // ---------------------------
  const fetchMachines = async () => {
    try {
      const res = await apigetMachine();

      if (res?.data?.statusCode === 200) {
        const machineList = res.data.data || [];
        setMachines(machineList);

        const map = {};
        machineList.forEach((m) => (map[m.machineNo] = m));
        setMachineMap(map);
      }
    } catch (err) {
      console.error("Error fetching machines:", err);
      setSnackbar({
        open: true,
        message: "Failed to load machines",
        severity: "error",
      });
    }
  };

  // ---------------------------
  // FETCH CHECKLISTS (ASYNC/AWAIT)
  // ---------------------------
  const fetchCheckLists = async () => {
    console.log("Role Id: ", roleId);
    if (!roleId) return;
    try {
      const res = await getCheckPoint();

      if (res?.statusCode === 200) {
        setChecklists(res.data);
      }
    } catch (err) {
      console.error("Error fetching checklists:", err);
      setSnackbar({
        open: true,
        message: "Failed to load checklists",
        severity: "error",
      });
    }
  };

  // ---------------------------
  // FETCH CALENDAR EVENTS (ASYNC/AWAIT)
  // ---------------------------
  const fetchCalendarEvents = async (start, end) => {
    if (!start || !end) return;

    setLoadingCalendar(true);

    try {
      const res = await apiCalenderEvent(start, end);
      const items = res?.data?.data || [];

      const mapped = items.map((item) => {
        const machine = machineMap[item.machine_no];

        const displayName =
          (machine &&
            (machine.displayMachineName || machine.machineName)) ||
          `Machine ${item.machine_no}`;

        return {
          id: `occ-${item.occurrence_id}`,
          title: displayName,
          start: item.scheduled_for,
          allDay: true,
          backgroundColor:
            item.status === "completed"
              ? "rgba(0, 200, 0, 0.4)"
              : "rgba(0, 102, 255, 0.4)",
          borderColor:
            item.status === "completed"
              ? "rgba(0, 150, 0, 0.8)"
              : "rgba(0, 102, 255, 0.8)",
          textColor: "#000",
          extendedProps: {
            ...item,
            displayName,
            line: machine?.lineName || "",
            plant: machine?.plantName || "",
            cycle: machine?.cycleTime || "",
            prod: machine?.lineProductionCount || "",
            machineDetails: machine || null,
          },
        };
      });

      setCalendarEvents(mapped);
    } catch (err) {
      console.error("Error fetching calendar:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch calendar events",
        severity: "error",
      });
    } finally {
      setLoadingCalendar(false);
    }
  };

  // ---------------------------
  // ADD OCCURRENCES (ASYNC/AWAIT)
  // ---------------------------
  const handleAddOccurrence = async () => {
    if (!selectedMachine)
      return setSnackbar({
        open: true,
        message: "Please select a machine",
        severity: "warning",
      });

    if (!startDate || !endDate)
      return setSnackbar({
        open: true,
        message: "Please select start & end dates",
        severity: "warning",
      });

    if (endDate < startDate)
      return setSnackbar({
        open: true,
        message: "End date must be same or after start",
        severity: "warning",
      });

    const payload = {
      planNo: Number(selectedMachine),
      startDate,
      endDate,
      checklistNos: selectedChecklistNos.map(Number),
    };

    setLoadingAdd(true);

    try {
      const res = await apiGenerateOccurrences(payload);

      setSnackbar({
        open: true,
        message: "Occurrences generated",
        severity: "success",
      });

      setOpenAdd(false);
      setSelectedMachine("");
      setStartDate("");
      setEndDate("");
      setSelectedChecklistNos([]);

      const startToUse = visibleRange.start || startDate;
      const endToUse = visibleRange.end || endDate;

      await fetchCalendarEvents(startToUse, endToUse);
    } catch (err) {
      console.error("Error generating occurrences:", err);
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.message || "Failed to generate occurrences",
        severity: "error",
      });
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleOpenDetails = async (occId) => {
    setLoadingDetails(true);
    setOpenDetails(true);

    try {
      const res = await apiOccurrenceDetails(occId);

      if (res?.data?.statusCode === 200) {
        const occ = res.data.data;

        // attach display name
        const machine = machineMap[occ.machine_no];
        occ.machineName = machine
          ? machine.displayMachineName || machine.machineName
          : `Machine ${occ.machine_no}`;

        setOccDetails(occ);

      }
    } catch (err) {
      console.error("Error fetching occurrence details:", err);
      setSnackbar({
        open: true,
        message: "Failed to load occurrence details",
        severity: "error",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleMarkChecked = async (checkId) => {
    try {
      await apiCheckChecklist(checkId);
      setSnackbar({
        open: true,
        message: "Checklist item marked as checked",
        severity: "success",
      });

      // Re-fetch occurrence details after marking checked
      await handleOpenDetails(occDetails.occurrence_id);

    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to update checklist status",
        severity: "error",
      });
    }
  };

  const renderEventTitle = (event) => {
    const d = event.extendedProps;

    return (
      <div
        style={{ fontSize: "11px", padding: "2px", color: "#000" }}
        title={`Machine: ${d.displayName}\nLine: ${d.line}\nStatus: ${d.status}`}
      >
        <b>{d.displayName}</b>
        <br />
        {d.status}
      </div>
    );
  };

  return (
    <div style={{ padding: "0px 20px", position: "relative" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(to right, rgb(0, 93, 114), rgb(79, 223, 255))",
          padding: "8px",
          borderRadius: "8px",
          marginBottom: "10px",
          marginTop: "10px",
          color: "white",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Maintenance Calendar
        </Typography>

        <Fab size="small" color="primary" onClick={() => setOpenAdd(true)}>
          <AddIcon />
        </Fab>
      </div>

      {loadingCalendar && (
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "30%",
            transform: "translate(-50%, -30%)",
            zIndex: 50,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* CALENDAR */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        height="80vh"
        datesSet={(info) => {
          const start = cleanDate(info.startStr);
          const end = cleanDate(info.endStr);

          setVisibleRange({ start, end });
          fetchCalendarEvents(start, end);
        }}
        eventClick={async (info) => {
          const occId = info.event.extendedProps.occurrence_id;
          await handleOpenDetails(occId);
        }}
        eventContent={(info) => renderEventTitle(info.event)}
      />

      {/* ADD OCCURRENCE DIALOG */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth>
        <DialogTitle>Add Maintenance Occurrence</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* MACHINE */}
          <FormControl fullWidth>
            <InputLabel>Machine</InputLabel>
            <Select
              value={selectedMachine}
              label="Machine"
              onChange={(e) => setSelectedMachine(e.target.value)}
            >
              <MenuItem value="">
                <em>Select machine</em>
              </MenuItem>
              {machines.map((m) => (
                <MenuItem key={m.machineNo} value={m.machineNo}>
                  {m.displayMachineName || m.machineName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* DATES */}
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <TextField
            label="End Date"
            type="date"
            value={endDate}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setEndDate(e.target.value)}
          />

          {/* CHECKLISTS */}
          <FormControl fullWidth>
            <InputLabel>Checklist (optional)</InputLabel>
            <Select
              multiple
              value={selectedChecklistNos}
              onChange={(e) => setSelectedChecklistNos(e.target.value)}
              input={<OutlinedInput label="Checklist (optional)" />}
              renderValue={(selected) =>
                selected
                  .map((id) => {
                    const cl = checklists.find((c) => c.checklistNo === id);
                    return cl ? cl.checklistName : id;
                  })
                  .join(", ")
              }

            >
              {checklists.map((cl) => (
                <MenuItem key={cl.checklistNo} value={cl.checklistNo}>
                  <Checkbox
                    checked={selectedChecklistNos.includes(cl.checklistNo)}
                  />
                  <ListItemText
                    primary={cl.checklistName}
                    secondary={cl.checklistDescription}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenAdd(false)} disabled={loadingAdd}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddOccurrence}
            disabled={loadingAdd}
          >
            {loadingAdd ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} fullWidth maxWidth="sm">
        <DialogTitle>Maintenance Occurrence Details</DialogTitle>

        <DialogContent>
          {loadingDetails ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : occDetails ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Typography><b>Machine:</b> {occDetails.machineName}</Typography>
              <Typography>
                <b>Scheduled For:</b> {occDetails.scheduled_for?.split("T")[0]}
              </Typography>
              <Typography><b>Status:</b> {occDetails.status.toUpperCase()}</Typography>

              <Typography sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                Checklist:
              </Typography>

              <Box sx={{ mt: 1 }}>
                {occDetails.checklist?.length === 0 && (
                  <Typography>No checklist items.</Typography>
                )}

                {occDetails.checklist?.map((cl) => (
                  <Box
                    key={cl.id}
                    sx={{
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      mb: 1,
                      background: cl.checked ? "#d6ffd6" : "#ffe0e0",
                      position: "relative",
                    }}
                  >
                    {/* CHECK BUTTON - TOP RIGHT */}
                    {roleId === "5" && !cl.checked && (
                      <IconButton
                        size="small"
                        onClick={() => handleMarkChecked(cl.id)}
                        sx={{
                          position: "absolute",
                          bottom: 5,
                          right: 5,
                          color: "grey",
                        }}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    )}

                    <Typography>
                      <b>Check Point Name:</b> {cl.point_name}
                    </Typography>

                    <Typography>
                      <b>Checked:</b> {cl.checked ? "Yes" : "No"}
                    </Typography>
                  </Box>
                ))}

              </Box>

            </div>
          ) : (
            <Typography>No details found.</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
