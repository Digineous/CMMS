import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Modal, TextField, IconButton, Typography, Box,
  FormControl, InputLabel, Select, MenuItem, TablePagination,
  Snackbar, Tooltip, styled, tableCellClasses
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/table.css";
import "../../assets/css/style.css";

// API imports (replace with your actual Breakdown APIs)
// import { apiGetBreakdowns } from "../../api/BreakDown/api.getBreakdowns";
// import { apiAddBreakdown } from "../../api/BreakDown/api.addBreakdown";
// import { apiUpdateBreakdown } from "../../api/BreakDown/api.updateBreakdown";
// import { apiRemoveBreakdown } from "../../api/BreakDown/api.removeBreakdown";

// Styled Table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1FAEC5",
    color: theme.palette.common.white,
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

const BreakDown = () => {
  const [tableData, setTableData] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateBreakdown, setUpdateBreakdown] = useState({});
  const [formData, setFormData] = useState({ reason: "" });

  // Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch data
  useEffect(() => {
    const fetchBreakdowns = async () => {
      try {
        const res = await apiGetBreakdowns();
        setTableData(res.data.data);
      } catch (err) {
        handleSnackbarOpen("Failed to fetch breakdowns", "error");
      }
    };
    fetchBreakdowns();
  }, []);

  const handleSnackbarOpen = (msg, sev) => {
    setSnackbarMessage(msg);
    setSeverity(sev);
    setOpenSnackbar(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiAddBreakdown(formData);
      handleSnackbarOpen("Breakdown added!", "success");
      const updated = await apiGetBreakdowns();
      setTableData(updated.data.data);
      setFormData({ reason: "" });
      setAddOpen(false);
    } catch (err) {
      handleSnackbarOpen("Error adding breakdown", "error");
    }
  };

  // Edit
  const handleEdit = (row) => {
    setUpdateBreakdown(row);
    setEditOpen(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      await apiUpdateBreakdown(updateBreakdown);
      handleSnackbarOpen("Breakdown updated!", "success");
      const updated = await apiGetBreakdowns();
      setTableData(updated.data.data);
      setEditOpen(false);
    } catch (err) {
      handleSnackbarOpen("Error updating breakdown", "error");
    }
  };

  // Delete
  const handleDelete = async () => {
    try {
      await apiRemoveBreakdown(deleteId);
      handleSnackbarOpen("Breakdown deleted!", "success");
      const updated = await apiGetBreakdowns();
      setTableData(updated.data.data);
      setDeleteId(null);
    } catch (err) {
      handleSnackbarOpen("Error deleting breakdown", "error");
    }
  };

  return (
    <div style={{ padding: "0px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 0" }}>
        <h2>Breakdown Master</h2>
        <Button
          onClick={() => setAddOpen(true)}
          style={{
            background: "#1FAEC5",
            fontWeight: "600",
            borderRadius: "10px",
            color: "white",
            border: "4px solid lightblue",
            padding: "5px 10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)"
          }}
        >
          Add New &nbsp;<FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>Breakdown Reason</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.length === 0 ? (
              <TableRow>
                <StyledTableCell colSpan={3} align="center">
                  No breakdowns found
                </StyledTableCell>
              </TableRow>
            ) : (
              tableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <StyledTableRow key={row.breakdownId}>
                    <StyledTableCell>{row.reason}</StyledTableCell>
                    <StyledTableCell>{row.createdAt}</StyledTableCell>
                    <StyledTableCell>
                      <IconButton onClick={() => handleEdit(row)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        style={{ color: "#FF3131" }}
                        onClick={() => setDeleteId(row.breakdownId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <Box sx={{ borderRadius: "10px", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", bgcolor: "white", p: 3, width: 400 }}>
          <Typography variant="h6">Add Breakdown</Typography>
          <TextField
            fullWidth
            name="reason"
            label="Breakdown Reason"
            value={formData.reason}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
          <Button variant="contained" onClick={handleAddSubmit} sx={{ mt: 2 }}>
            Save
          </Button>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <Box sx={{ borderRadius: "10px", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", bgcolor: "white", p: 3, width: 400 }}>
          <Typography variant="h6">Edit Breakdown</Typography>
          <TextField
            fullWidth
            name="reason"
            label="Breakdown Reason"
            value={updateBreakdown.reason || ""}
            onChange={(e) => setUpdateBreakdown({ ...updateBreakdown, reason: e.target.value })}
            sx={{ mt: 2 }}
          />
          <Button variant="contained" onClick={handleUpdateSubmit} sx={{ mt: 2 }}>
            Update
          </Button>
        </Box>
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <Box sx={{ borderRadius: "10px", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", bgcolor: "white", p: 3, width: 400, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Delete this breakdown?
          </Typography>
          <Button variant="contained" color="error" onClick={handleDelete} sx={{ mr: 1 }}>
            Yes, Delete
          </Button>
          <Button variant="outlined" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert severity={severity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default BreakDown ;
