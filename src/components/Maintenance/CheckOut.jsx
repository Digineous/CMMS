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
import { getCheckPoint } from "../../api/Maintenance/CheckPoint/api.getCheckPoint";
import { addCheckPoint } from "../../api/Maintenance/CheckPoint/api.addCheckPoint";
import { apiGetMainPoint } from "../../api/Maintenance/MainPoint/api.getMainPoint";

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

export default function CheckOut() {
    const [checkouts, setCheckouts] = useState([]);
    const [mainPoints, setMainPoints] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [openModal, setOpenModal] = useState(false);
    const [newCheckout, setNewCheckout] = useState({
        checklistName: "",
        checklistDescription: "",
        pointNo: "",
    });

    // Build map for quick lookup
    const pointMap = mainPoints.reduce((acc, point) => {
        acc[point.pointNo] = point.pointName;
        return acc;
    }, {});

    // Fetch Main Points + Checkouts
    const fetchData = async () => {
        try {
            const [checkRes, pointRes] = await Promise.all([
                getCheckPoint(),
                apiGetMainPoint(),
            ]);

            if (checkRes?.statusCode === 200) setCheckouts(checkRes.data || []);
            if (pointRes?.statusCode === 200) setMainPoints(pointRes.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setSnackbar({
                open: true,
                message: "Error fetching data.",
                severity: "error",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handlers
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleCloseSnackbar = () =>
        setSnackbar((prev) => ({ ...prev, open: false }));
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCheckout((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddCheckout = async () => {
        try {
            const response = await addCheckPoint(newCheckout);
            if (response?.data.statusCode === 200) {
                setSnackbar({
                    open: true,
                    message: "Checkout added successfully!",
                    severity: "success",
                });
                await fetchData();
                handleCloseModal();
                setNewCheckout({ checklistName: "", checklistDescription: "", pointNo: "" });
            } else {
                throw new Error("Error while adding checkout");
            }
        } catch (err) {
            console.error(err);
            setSnackbar({
                open: true,
                message: "Error adding checkout",
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
                    Check Out
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

                            <StyledTableCell>Checklist Name</StyledTableCell>
                            <StyledTableCell>Description</StyledTableCell>
                            <StyledTableCell>Point Name</StyledTableCell>

                            <StyledTableCell>Created At</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {checkouts &&
                            checkouts
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <StyledTableRow key={row.checklistNo}>

                                        <StyledTableCell>{row.checklistName}</StyledTableCell>
                                        <StyledTableCell>{row.checklistDescription}</StyledTableCell>
                                        <StyledTableCell>
                                            {pointMap[row.pointNo] || row.pointNo}
                                        </StyledTableCell>

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
                    count={checkouts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>

            {/* Add Checkout Modal */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add New Checkout</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Checklist Name"
                        name="checklistName"
                        fullWidth
                        value={newCheckout.checklistName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="checklistDescription"
                        fullWidth
                        multiline
                        rows={3}
                        value={newCheckout.checklistDescription}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Point"
                        name="pointNo"
                        select
                        fullWidth
                        value={newCheckout.pointNo}
                        onChange={handleInputChange}
                    >
                        {mainPoints.map((point) => (
                            <MenuItem key={point.pointNo} value={point.pointNo}>
                                {point.pointName}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleAddCheckout} variant="contained">
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
