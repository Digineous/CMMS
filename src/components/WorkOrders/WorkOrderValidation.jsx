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
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { apigetValidation } from "../../api/WorkOrders/api.getValidation";
import { apigetUsers } from "../../api/UserMaster/apiGetUsers";
import { apiGetStatusComplaints } from "../../api/Complaints/api.getComplaintStatus";
import { apiUpdateValidation } from "../../api/WorkOrders/api.putValidation";

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
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:last-child td, &:last-child th": { border: 0 },
}));

export default function WorkOrderValidation() {
  const [workOrders, setWorkOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [rowActions, setRowActions] = useState({});

  useEffect(() => {
    fetchWorkOrders();
    fetchStatusList();
    fetchUsers();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      const response = await apigetValidation();
      setWorkOrders(response.data.data || []);
      setSnackbar({
        open: true,
        message: "Work Orders fetched successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error fetching dummy Work Orders:", error);
      setSnackbar({
        open: true,
        message: "Error fetching work orders.",
        severity: "error",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apigetUsers();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching Users:", error);
      setSnackbar({
        open: true,
        message: "Error fetching Users.",
        severity: "error",
      });
    }
  };

  const fetchStatusList = async () => {
    try {
      const response = await apiGetStatusComplaints();
      setStatusList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching Status:", error);
      setSnackbar({
        open: true,
        message: "Error fetching Status.",
        severity: "error",
      });
    }
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.fullName : userId;
  };

  const getStatusName = (statusId) => {
    const st = statusList.find((s) => s.statusId === statusId);
    return st ? st.statusName : statusId;
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleFieldChange = (workorderNo, field, value) => {
    setRowActions((prev) => ({
      ...prev,
      [workorderNo]: { ...prev[workorderNo], [field]: value },
    }));
  };

  const handleSaveRow = async (row) => {
    const fullData = rowActions[row.workorderNo];
    if (!fullData || !fullData.actionType) {
      setSnackbar({
        open: true,
        message: `Please select a status for Workorder.`,
        severity: "warning",
      });
      return;
    }

    const body = {
      status: fullData.actionType,
      remarks: fullData.actionRemarks || "",
      closeComplaint: fullData.actionType === 11 ? false : true,
    };

    try {
        const response = await apiUpdateValidation(row.workorderNo, body);
        await fetchWorkOrders();
    } catch (error) {
      console.error("Error saving work order:", error);
      setSnackbar({
        open: true,
        message: "Error saving work order.",
        severity: "error",
      });
      return;
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
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          color: "white",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" style={{ fontWeight: "bold", color: "#fff" }}>
          Work Order Validation
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
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Assigned At</StyledTableCell>
              <StyledTableCell>Created By</StyledTableCell>
              <StyledTableCell>Set Status</StyledTableCell>
              <StyledTableCell>Remarks</StyledTableCell>
              <StyledTableCell>Save</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <StyledTableRow key={row.workorderNo}>
                  <StyledTableCell>{row.workorderNo}</StyledTableCell>
                  <StyledTableCell>{row.complaintNo}</StyledTableCell>
                  <StyledTableCell>{row.description}</StyledTableCell>
                  <StyledTableCell>{getStatusName(row.status)}</StyledTableCell>
                  <StyledTableCell>
                    {new Date(row.assignedAt).toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell>
                    {getUserName(row.createdBy)}
                  </StyledTableCell>

                  {/* Editable Fields */}
                  <StyledTableCell>
                    <Select
                      size="small"
                      sx={{ width: "150px" }}
                      value={rowActions[row.workorderNo]?.actionType || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          row.workorderNo,
                          "actionType",
                          e.target.value
                        )
                      }
                      displayEmpty
                      fullWidth
                    >
                      {statusList
                        .filter(
                          (status) =>
                            status.statusId === 8 || status.statusId === 11
                        )
                        .map((status) => (
                          <MenuItem
                            key={status.statusId}
                            value={status.statusId}
                          >
                            {status.statusName}
                          </MenuItem>
                        ))}
                    </Select>
                  </StyledTableCell>

                  <StyledTableCell>
                    <TextField
                      size="small"
                      label="Remarks"
                      sx={{ width: "150px" }}
                      value={rowActions[row.workorderNo]?.actionRemarks || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          row.workorderNo,
                          "actionRemarks",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </StyledTableCell>

                  <StyledTableCell>
                    <IconButton onClick={() => handleSaveRow(row)}>
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
