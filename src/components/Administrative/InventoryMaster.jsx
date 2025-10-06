import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Modal, TextField, IconButton, Typography, Box,
  Snackbar, TablePagination, styled, tableCellClasses
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";


import { addInventory } from "../../api/Master/Inventory/addInventory";
import { getInventory } from "../../api/Master/Inventory/getInventory";
import { deleteInventory } from "../../api/Master/Inventory/deleteInventory";
import { updateInventory } from "../../api/Master/Inventory/updateInventory";

// Import your Inventory APIs here
// import { getInventory } from "../../api/Master/Inventory/getInventory";
// import { addInventory } from "../../api/Master/Inventory/addInventory";
// import { updateInventory } from "../../api/Master/Inventory/updateInventory";
// import { deleteInventory } from "../../api/Master/Inventory/deleteInventory";

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
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:last-child td, &:last-child th": { border: 0 },
}));

const InventoryMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    partCode: "",
    partName: "",
    description: "",
    uom: "",
    qtyOnHand: "",
    reorderLevel: "",
    minLevel: "",
    location: ""
  });
  const [updateData, setUpdateData] = useState({});
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [refresh, setRefresh] = useState(false);

  // Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch data
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await getInventory();
        setTableData(res.data.data || []);
      } catch (err) {
        handleSnackbarOpen("Failed to fetch inventory", "error");
      }
    };
    fetchInventory();
  }, [refresh]);

  const handleSnackbarOpen = (msg, sev) => {
    setSnackbarMessage(msg);
    setSeverity(sev);
    setOpenSnackbar(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ADD
  const handleAddSubmit = async () => {
    try {
      await addInventory(formData);
      handleSnackbarOpen("Inventory item added!", "success");
      setFormData({
        partCode: "",
        partName: "",
        description: "",
        uom: "",
        qtyOnHand: "",
        reorderLevel: "",
        minLevel: "",
        location: ""
      });
      setAddOpen(false);
      setRefresh(!refresh);
    } catch {
      handleSnackbarOpen("Error adding item", "error");
    }
  };

  // EDIT
  const handleEdit = (row) => {
    setUpdateData({...row});
    setEditOpen(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      await updateInventory(updateData);
      handleSnackbarOpen("Inventory item updated!", "success");
      setEditOpen(false);
      setRefresh(!refresh);
    } catch {
      handleSnackbarOpen("Error updating item", "error");
    }
  };

  // DELETE
  const handleDelete = async () => {
    try {
      await deleteInventory(deleteId);
      handleSnackbarOpen("Inventory item deleted!", "success");
      setDeleteId(null);
      setRefresh(!refresh);
    } catch {
      handleSnackbarOpen("Error deleting item", "error");
    }
  };

  return (
    <div style={{ padding: "0px 20px" }}>
      {/* Header */}
      {/* <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 0" }}>
        <h2>Inventory Master</h2>
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
      </div> */}
         <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: "linear-gradient(to right, rgb(0, 93, 114), rgb(79, 223, 255))",
                padding: "5px",
                borderRadius: "8px",
                marginBottom: "20px",
                marginTop: '10px',
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                color: "white",
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                
                <Typography
                  variant="h5"
                  style={{
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  Inventory Master
                </Typography>
              </div>
              <Button
                onClick={() => setAddOpen(true)}
                style={{
                  fontWeight: "600",
                  borderRadius: "10px",
                  color: "white",
                  border: "4px solid white",
                  padding: "5px",
                  background: 'grey'
                }}
              >
                {" "}
                Add New &nbsp;{" "}
                <FontAwesomeIcon
                  style={{ fontSize: "18px", color: "white" }}
                  icon={faPlus}
                />
              </Button>
            </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>Part Code</StyledTableCell>
              <StyledTableCell>Part Name</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>UOM</StyledTableCell>
              <StyledTableCell>Qty On Hand</StyledTableCell>
              <StyledTableCell>Reorder Level</StyledTableCell>
              <StyledTableCell>Min Level</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.length === 0 ? (
              <TableRow>
                <StyledTableCell colSpan={9} align="center">
                  No inventory found
                </StyledTableCell>
              </TableRow>
            ) : (
              tableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <StyledTableRow key={row.partCode}>
                    <StyledTableCell>{row.partCode}</StyledTableCell>
                    <StyledTableCell>{row.partName}</StyledTableCell>
                    <StyledTableCell>{row.description}</StyledTableCell>
                    <StyledTableCell>{row.uom}</StyledTableCell>
                    <StyledTableCell>{row.qtyOnHand}</StyledTableCell>
                    <StyledTableCell>{row.reorderLevel}</StyledTableCell>
                    <StyledTableCell>{row.minLevel}</StyledTableCell>
                    <StyledTableCell>{row.location}</StyledTableCell>
                    <StyledTableCell>
                      <IconButton onClick={() => handleEdit(row)}><EditIcon /></IconButton>
                      <IconButton style={{ color: "#FF3131" }} onClick={() => setDeleteId(row.itemNo)}>
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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
        <Box sx={{ borderRadius: "10px", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", bgcolor: "white", p: 3, width: 500 }}>
          <Typography variant="h6">Add Inventory Item</Typography>
          {Object.keys(formData).map((field) => (
            <TextField
              key={field}
              fullWidth
              name={field}
              label={field}
              value={formData[field]}
              onChange={handleInputChange}
              sx={{ mt: 2 }}
            />
          ))}
          <Button variant="contained" onClick={handleAddSubmit} sx={{ mt: 2 }}>
            Save
          </Button>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <Box sx={{ borderRadius: "10px", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", bgcolor: "white", p: 3, width: 500 }}>
          <Typography variant="h6">Edit Inventory Item</Typography>
          {Object.keys(formData).map((field) => (
            <TextField
              key={field}
              fullWidth
              name={field}
              label={field}
              value={updateData[field] || ""}
              onChange={(e) => setUpdateData({ ...updateData, [field]: e.target.value })}
              sx={{ mt: 2 }}
            />
          ))}
          <Button variant="contained" onClick={handleUpdateSubmit} sx={{ mt: 2 }}>
            Update
          </Button>
        </Box>
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <Box sx={{ borderRadius: "10px", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", bgcolor: "white", p: 3, width: 400, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Delete this inventory item?
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
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <MuiAlert severity={severity} sx={{ width: "100%" }}>{snackbarMessage}</MuiAlert>
      </Snackbar>
    </div>
  );
};

export default InventoryMaster;
