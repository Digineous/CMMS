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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { apiGetMainPoint } from "../../api/Maintenance/MainPoint/api.getMainPoint";
import { apiAddMainPoint } from "../../api/Maintenance/MainPoint/api.AddMainPoint";

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

export default function MainPointPage() {
  const [points, setPoints] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openModal, setOpenModal] = useState(false);
  const [newPoint, setNewPoint] = useState({
    pointName: "",
    pointDescription: "",
    category: "",
  });

  // Fetch Main Points
  const fetchMainPoints = async () => {
    try {
      const response = await apiGetMainPoint();
      if (response?.statusCode === 200) {
        setPoints(response.data || []);
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Error fetching Work Orders:", error);
      setSnackbar({
        open: true,
        message: error.response.data.message || "Something went wrong.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchMainPoints();
  }, []);

  // Handlers
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
    setNewPoint((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPoint = async () => {
    try {
      const response = await apiAddMainPoint(newPoint);
      if (response?.statusCode === 200) {
        setSnackbar({
          open: true,
          message: "Main Point added successfully!",
          severity: "success",
        });
        await fetchMainPoints();
        handleCloseModal();
        setNewPoint({ pointName: "", pointDescription: "", category: "" });
      } else {
        throw new Error("Error while adding main point");
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Error adding Main Point",
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
          Main Point
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
             
              <StyledTableCell>Point Name</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
             
              <StyledTableCell>Created At</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {points &&
              points
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <StyledTableRow key={row.pointNo}>
                  
                    <StyledTableCell>{row.pointName}</StyledTableCell>
                    <StyledTableCell>{row.pointDescription}</StyledTableCell>
                    <StyledTableCell>{row.category}</StyledTableCell>
                  
                    <StyledTableCell>
                      {new Date(row.createdAt).toLocaleString()}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={points.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Add Point Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Main Point</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Point Name"
            name="pointName"
            fullWidth
            value={newPoint.pointName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Description"
            name="pointDescription"
            fullWidth
            multiline
            rows={3}
            value={newPoint.pointDescription}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Category"
            name="category"
            fullWidth
            value={newPoint.category}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleAddPoint} variant="contained">
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
