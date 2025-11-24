// AssignmentCalendar.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  TextField,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Stack,
} from "@mui/material";

import {
  Assignment,
  CalendarMonth,
  Info,
  AddCircle,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";

import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
import { apiGetPlansByMachine } from "../../api/Maintenance/api.GetPlansByMachine";
import { apiGetPlanDetails } from "../../api/Maintenance/api.GetPlanDetails";
import { getCheckPoint } from "../../api/Maintenance/CheckList/api.getCheckList";
import { apiCreatePlanForAllMachines } from "../../api/Maintenance/api.CreatePlanForAllMachines";
import { apiUpdatePlanStatus } from "../../api/Maintenance/api.UpdatePlanStatus";

// Helper: format ISO date to YYYY-MM-DD (safe)
const fmtDate = (iso) => {
  if (!iso) return "";
  try {
    return iso.split("T")[0];
  } catch {
    return iso;
  }
};

export default function AssignmentCalendar() {
  const [machines, setMachines] = useState([]);
  const [machineMap, setMachineMap] = useState({});
  const [plans, setPlans] = useState({});
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState([]);

  // month/year pickers
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // details dialog
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // add plan
  const [openAdd, setOpenAdd] = useState(false);
  const [addStartDate, setAddStartDate] = useState("");
  const [addChecklists, setAddChecklists] = useState([]);
  const [addPlanName, setAddPlanName] = useState("");
  const [addPlanDescription, setAddPlanDescription] = useState("");

  // update status UI inside details
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateCompletedChecklists, setUpdateCompletedChecklists] = useState([]);
  const [updateRemarks, setUpdateRemarks] = useState("");
  const [updating, setUpdating] = useState(false);

  // initial load
  useEffect(() => {
    loadMachinesAndPlans();
    fetchChecklist();
  }, []);

  useEffect(() => {
    generateMonth(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  // generate date objects for selected month
  const generateMonth = (year, month) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const arr = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      arr.push(new Date(d));
    }
    setDates(arr);
  };

  // load machines + plans grouped by machineNo
  const loadMachinesAndPlans = async () => {
    setLoading(true);
    try {
      const m = await apigetMachine();
      let machineList = m?.data?.data || [];

      // ✅ ORDER MACHINES BY MACHINE NO
      machineList = machineList.sort((a, b) => a.machineNo - b.machineNo);

      setMachines(machineList);

      const mMap = {};
      machineList.forEach((mc) => (mMap[mc.machineNo] = mc));
      setMachineMap(mMap);

      const p = await apiGetPlansByMachine();
      const planList = p?.data?.data || [];

      const grouped = {};
      planList.forEach((plan) => {
        if (!grouped[plan.machineNo]) grouped[plan.machineNo] = [];
        grouped[plan.machineNo].push(plan);
      });

      setPlans(grouped);
    } catch (err) {
      console.error("loadMachinesAndPlans:", err);
    } finally {
      setLoading(false);
    }
  };

  // checklist (for names)
  const fetchChecklist = async () => {
    try {
      const res = await getCheckPoint();
      // earlier you returned array under res.data — adapt accordingly
      const list = res?.data || res || [];
      setChecklist(list);
    } catch (err) {
      console.error("Checklist fetch error:", err);
    }
  };

  // returns icon + small text for cell
  const renderCellContent = (plan) => {
    if (!plan) return <div>-</div>;

    const isCompleted = plan.status && plan.status.toLowerCase() === "completed";
    const updatedAt = plan.updatedAt ? fmtDate(plan.updatedAt) : null;

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div>
          {isCompleted ? <CheckCircle sx={{ color: "green" }} /> : <RadioButtonUnchecked sx={{ color: "#1976d2" }} />}
        </div>
        <div style={{ fontSize: 11, color: "#333" }}>
          {isCompleted ? `Completed: ${updatedAt}` : "Planned"}
        </div>
      </div>
    );
  };

  // find plan for machine+date
  const findPlan = (machineNo, dateStr) => {
    const row = plans[machineNo] || [];
    return row.find((p) => p.startDate === dateStr);
  };

  // open plan details, and preset update form fields
  const openPlan = async (planNo) => {
    try {
      const res = await apiGetPlanDetails(planNo);
      const data = res?.data?.data || res?.data || null;
      setSelectedPlan(data);

      // preset update controls
      const planObj = data?.plan || data || null;
      setUpdateStatus(planObj?.status || "");
      // completed checklists from completedCheckpoints array (your plan example has that)
      const completed = planObj?.completedCheckpoints || [];
      setUpdateCompletedChecklists(Array.isArray(completed) ? completed.slice() : []);
      setUpdateRemarks("");
      setOpenDetails(true);
    } catch (err) {
      console.error("openPlan:", err);
      alert("Failed to load plan details.");
    }
  };

  // toggle checklist selection in details update form
  const toggleChecklist = (checklistNo) => {
    setUpdateCompletedChecklists((prev) => {
      if (prev.includes(checklistNo)) return prev.filter((n) => n !== checklistNo);
      return [...prev, checklistNo];
    });
  };

  // send update payload to backend and refresh
  const handleUpdatePlanStatus = async () => {
    if (!selectedPlan || !selectedPlan.plan) {
      alert("No plan selected");
      return;
    }
    const planNo = selectedPlan.plan.planNo;
    const allChecklistNos = (selectedPlan.checklists || []).map((c) => c.checklistNo);
    const completed = Array.isArray(updateCompletedChecklists) ? updateCompletedChecklists : [];
    const incomplete = allChecklistNos.filter((n) => !completed.includes(n));

    const payload = {
      status: updateStatus || selectedPlan.plan.status,
      completedChecklists: completed,
      incompleteChecklists: incomplete,
      remarks: updateRemarks || "",
    };

    try {
      setUpdating(true);
      await apiUpdatePlanStatus(planNo, payload);

      // refresh table & details
      await loadMachinesAndPlans();
      const fresh = await apiGetPlanDetails(planNo);
      setSelectedPlan(fresh?.data?.data || fresh?.data || null);
      // keep dialog open — user sees updated status/updatedAt
    } catch (err) {
      console.error("handleUpdatePlanStatus:", err);
      alert("Failed to update plan status");
    } finally {
      setUpdating(false);
    }
  };

  // create plan for all machines
  const handleCreatePlan = async () => {
    if (!addStartDate) {
      alert("Select start date");
      return;
    }
    if (!addChecklists.length) {
      alert("Select at least one checklist");
      return;
    }

    const payload = {
      startDate: addStartDate,
      planName: addPlanName || "Monthly Preventive Plan",
      planDescription: addPlanDescription || "",
      checklistNos: addChecklists,
    };

    try {
      await apiCreatePlanForAllMachines(payload);
      alert("Plans created");
      setOpenAdd(false);
      // reload table
      loadMachinesAndPlans();
    } catch (err) {
      console.error("handleCreatePlan:", err);
      alert("Failed to create plans");
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Maintenance Plan Table View
        </Typography>

        <Button startIcon={<AddCircle />} variant="contained" onClick={() => setOpenAdd(true)}>
          Add New
        </Button>
      </Box>

      {/* Month / Year */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <FormControl>
          <InputLabel>Month</InputLabel>
          <Select value={selectedMonth} label="Month" onChange={(e) => setSelectedMonth(e.target.value)} sx={{ minWidth: 140 }}>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((m, i) => (
              <MenuItem key={i} value={i + 1}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Year</InputLabel>
          <Select value={selectedYear} label="Year" onChange={(e) => setSelectedYear(e.target.value)} sx={{ minWidth: 120 }}>
            {[2024, 2025, 2026, 2027, 2028].map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      {loading ? (
        <Box sx={{ textAlign: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ overflowX: "auto", border: "1px solid #ccc", borderRadius: 2 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#003d4d", color: "white" }}>
                <th style={{ padding: 8, border: "1px solid #ccc", minWidth: 160 }}>Machine</th>
                {dates.map((d) => (
                  <th key={d.toISOString()} style={{ padding: 6, border: "1px solid #ccc", whiteSpace: "nowrap" }}>
                    {d.getDate()}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {machines.map((m) => {
                const rowPlans = plans[m.machineNo] || [];
                return (
                  <tr key={m.machineNo}>
                    <td style={{ padding: 8, border: "1px solid #ccc", background: "#eef9ff", fontWeight: "bold" }}>
                      {m.displayMachineName || m.machineName}
                    </td>

                    {dates.map((d) => {
                      const dateStr = d.toISOString().split("T")[0];
                      const found = findPlan(m.machineNo, dateStr);

                      return (
                        <td
                          key={dateStr}
                          style={{
                            padding: 8,
                            border: "1px solid #ccc",
                            textAlign: "center",
                            cursor: found ? "pointer" : "default",
                            background: found
                              ? found.status && found.status.toLowerCase() === "completed"
                                ? "#c6ffd1"
                                : "#dcecff"
                              : "white",
                            minWidth: 90,
                          }}
                          onClick={() => found && openPlan(found.planNo)}
                        >
                          {found ? renderCellContent(found) : "-"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      )}

      {/* Details Dialog (Plan details + update) */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} fullWidth maxWidth="md">
        <DialogTitle>
          <Info sx={{ verticalAlign: "middle", mr: 1 }} /> Plan Details & Update
        </DialogTitle>

        <DialogContent dividers>
          {!selectedPlan ? (
            <Typography>No Data</Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Basic info */}
              <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 1, background: "#f4fbff" }}>
                <Typography sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: "bold", mb: 1 }}>
                  <Assignment /> Basic Info
                </Typography>

                <Typography>
                  <b>Machine:</b>{" "}
                  {machineMap[selectedPlan.plan.machineNo]
                    ? machineMap[selectedPlan.plan.machineNo].displayMachineName
                    : selectedPlan.plan.machineNo}
                </Typography>

                <Typography>
                  <b>Plan Name:</b> {selectedPlan.plan.planName}
                </Typography>

                <Typography>
                  <b>Description:</b> {selectedPlan.plan.planDescription}
                </Typography>

                <Typography>
                  <CalendarMonth sx={{ verticalAlign: "middle", mr: 0.5 }} /> <b>Scheduled:</b>{" "}
                  {selectedPlan.plan.startDate}
                </Typography>

                <Typography>
                  <b>Current status:</b> {selectedPlan.plan.status}
                </Typography>

                {selectedPlan.plan.updatedAt && selectedPlan.plan.status && selectedPlan.plan.status.toLowerCase() === "completed" && (
                  <Typography>
                    <b>Completed at:</b> {fmtDate(selectedPlan.plan.updatedAt)}
                  </Typography>
                )}
              </Box>

              {/* Update UI */}
              <Box sx={{ p: 2, border: "1px solid #eee", borderRadius: 1 }}>
                <Typography sx={{ fontWeight: "bold", mb: 1 }}>Update Plan Status & Checklists</Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={updateStatus} label="Status" onChange={(e) => setUpdateStatus(e.target.value)}>
                      <MenuItem value="Scheduled">Scheduled</MenuItem>
                      <MenuItem value="InProgress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField label="Remarks" value={updateRemarks} onChange={(e) => setUpdateRemarks(e.target.value)} fullWidth />
                </Stack>

                {/* Checklists (not mainpoints). list each checklist with a checkbox indicating completion */}
                <Box>
                  <Typography sx={{ mb: 1, fontWeight: "bold" }}>Checklists</Typography>

                  {(selectedPlan.checklists || []).length === 0 ? (
                    <Typography>No checklists for this plan.</Typography>
                  ) : (
                    (selectedPlan.checklists || []).map((cl) => {
                      const checklistNo = cl.checklistNo;
                      const item = checklist.find((c) => c.checklistNo === checklistNo);
                      const label = item ? item.checklistName : `Checklist ${checklistNo}`;
                      const checked = updateCompletedChecklists.includes(checklistNo);

                      return (
                        <FormControlLabel
                          key={checklistNo}
                          control={<Checkbox checked={checked} onChange={() => toggleChecklist(checklistNo)} />}
                          label={`${label} (${checklistNo})`}
                        />
                      );
                    })
                  )}
                </Box>

                {/* Show checkpoints grouped by checklist for extra clarity */}
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>Checkpoints</Typography>
                  {(selectedPlan.checkpoints || []).length === 0 ? (
                    <Typography>No checkpoint items</Typography>
                  ) : (
                    (selectedPlan.checklists || []).map((cl) => {
                      const clNo = cl.checklistNo;
                      const points = (selectedPlan.checkpoints || []).filter((cp) => cp.checklistNo === clNo);
                      if (!points.length) return null;
                      return (
                        <Box key={`cp-${clNo}`} sx={{ mb: 1, p: 1, border: "1px solid #eee", borderRadius: 1 }}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            {checklist.find((c) => c.checklistNo === clNo)?.checklistName || `Checklist ${clNo}`}
                          </Typography>
                          {points.map((pt) => (
                            <Box key={pt.id} sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                              <Typography>
                                Mainpoint #{pt.mainpointNo}
                                {pt.remarks ? ` — ${pt.remarks}` : ""}
                              </Typography>
                              {pt.isCompleted ? <CheckCircle sx={{ color: "green" }} /> : <RadioButtonUnchecked sx={{ color: "red" }} />}
                            </Box>
                          ))}
                        </Box>
                      );
                    })
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDetails(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={handleUpdatePlanStatus}
            disabled={updating || !selectedPlan}
          >
            {updating ? <CircularProgress size={18} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Plan Modal */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Plan For All Machines</DialogTitle>

        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            type="date"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={addStartDate}
            onChange={(e) => setAddStartDate(e.target.value)}
          />

          <TextField label="Plan Name" value={addPlanName} onChange={(e) => setAddPlanName(e.target.value)} />
          <TextField label="Plan Description" multiline minRows={2} value={addPlanDescription} onChange={(e) => setAddPlanDescription(e.target.value)} />

          <FormControl fullWidth>
            <InputLabel>Checklists</InputLabel>
            <Select
              multiple
              value={addChecklists}
              onChange={(e) => setAddChecklists(e.target.value)}
              renderValue={(selected) =>
                selected
                  .map((id) => checklist.find((c) => c.checklistNo === id)?.checklistName || `Checklist ${id}`)
                  .join(", ")
              }
            >
              {checklist.map((cl) => (
                <MenuItem key={cl.checklistNo} value={cl.checklistNo}>
                  <Checkbox checked={addChecklists.includes(cl.checklistNo)} />
                  <ListItemText primary={cl.checklistName} secondary={cl.checklistDescription} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreatePlan}>Create Plans</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
