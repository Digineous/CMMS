import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Paper,
    Box,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Grid,
    MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiGetMyRequests } from "../../api/SpareRequest/api.GetMyRequests";
import { getInventory } from "../../api/Master/Inventory/getInventory";
import { apiGetMyWorkOrders } from "../../api/WorkOrders/api.getMyWorkOrders";
import { apiAddRequests } from "../../api/SpareRequest/api.postNewRequests";

// ✅ Styled components for MUI Table
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

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [myWorkOrder, setMyWorkOrder] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [newRequest, setNewRequest] = useState({
        workorderNo: "",
        items: [{ itemNo: "", qtyRequested: "", remarks: "" }],
    });

    useEffect(() => {
        fetchInventory();
        fetchRequests();
        fetchMyWorkOrder();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await apiGetMyRequests();
            setRequests(response.data.data);
        } catch (error) {
            console.error("Error Fetching Requests: ", error);
        }
    };

    const fetchInventory = async () => {
        try {
            const response = await getInventory();
            setInventory(response.data.data);
        } catch (error) {
            console.error("Error Fetching Inventory: ", error);
        }
    };

    const fetchMyWorkOrder = async () => {
        try {
            const response = await apiGetMyWorkOrders();
            setMyWorkOrder(response.data.data);
        } catch (error) {
            console.error("Error Fetching your WorkOrders: ", error);
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "PARTIALLY_ISSUED":
                return "warning";
            case "APPROVED":
                return "success";
            case "REJECTED" : 
                return "error"
            default:
                return "info";
        }
    };

    const findInventoryDetails = (itemNo) => {
        const found = inventory.find((inv) => inv.itemNo === itemNo);
        return found
            ? { partCode: found.partCode, partName: found.partName }
            : { partCode: "—", partName: "—" };
    };

    // ✅ Modal Handlers
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleRequestChange = (e) => {
        const { name, value } = e.target;
        setNewRequest((prev) => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...newRequest.items];
        updatedItems[index][field] = value;
        setNewRequest((prev) => ({ ...prev, items: updatedItems }));
    };

    const handleAddItem = () => {
        setNewRequest((prev) => ({
            ...prev,
            items: [...prev.items, { itemNo: "", qtyRequested: "", remarks: "" }],
        }));
    };

    const handleRemoveItem = (index) => {
        const updatedItems = newRequest.items.filter((_, i) => i !== index);
        setNewRequest((prev) => ({ ...prev, items: updatedItems }));
    };

    const handleSubmitRequest = async () => {
        const payload = {
            workorderNo: Number(newRequest.workorderNo),
            items: newRequest.items
                .filter((i) => i.itemNo && i.qtyRequested)
                .map((i) => ({
                    itemNo: Number(i.itemNo),
                    qtyRequested: Number(i.qtyRequested),
                    remarks: i.remarks || undefined,
                })),
        };
        try {
            const response = await apiAddRequests(payload);
            await fetchRequests();
            handleCloseModal();
        } catch (error) {
            console.error("Error Adding requests: ", error);
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
                    padding: "8px 16px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    marginTop: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    color: "white",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h5" gutterBottom fontWeight="600">
                    My Requests
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleOpenModal}
                    startIcon={<AddIcon />}
                    sx={{ fontWeight: "bold" }}
                >
                    New Request
                </Button>
            </div>

            {requests.length === 0 ? (
                <Typography color="text.secondary">No requests found.</Typography>
            ) : (
                requests.map((req) => (
                    <Accordion key={req.requestNo} elevation={2} sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Request #{req.requestNo}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Work Order: {req.workorderNo} • Requested At:{" "}
                                    {new Date(req.requestedAt).toLocaleString()}
                                </Typography>
                            </Box>
                            <Chip
                                label={req.status.replace("_", " ")}
                                color={getStatusColor(req.status)}
                                variant="outlined"
                            />
                        </AccordionSummary>

                        <AccordionDetails>
                            <Paper elevation={1} sx={{ overflowX: "auto" }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Item No</StyledTableCell>
                                            <StyledTableCell>Part Code</StyledTableCell>
                                            <StyledTableCell>Part Name</StyledTableCell>
                                            <StyledTableCell>Qty Requested</StyledTableCell>
                                            <StyledTableCell>Qty Issued</StyledTableCell>
                                            <StyledTableCell>Remarks</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {req.items.map((item) => {
                                            const { partCode, partName } =
                                                findInventoryDetails(item.itemNo);
                                            return (
                                                <StyledTableRow key={item.requestItemNo}>
                                                    <StyledTableCell>{item.itemNo}</StyledTableCell>
                                                    <StyledTableCell>{partCode}</StyledTableCell>
                                                    <StyledTableCell>{partName}</StyledTableCell>
                                                    <StyledTableCell>{item.qtyRequested}</StyledTableCell>
                                                    <StyledTableCell>{item.qtyIssued}</StyledTableCell>
                                                    <StyledTableCell>
                                                        {item.remarks ? (
                                                            item.remarks
                                                        ) : (
                                                            <Typography
                                                                color="text.secondary"
                                                                fontStyle="italic"
                                                            >
                                                                None
                                                            </Typography>
                                                        )}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </AccordionDetails>
                    </Accordion>
                ))
            )}

            {/* ✅ Modal for New Request */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 600, color: "#005D72" }}>
                    Create New Request
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            select
                            fullWidth
                            label="Work Order"
                            name="workorderNo"
                            value={newRequest.workorderNo}
                            onChange={handleRequestChange}
                            type="number"
                        >
                            {myWorkOrder.map((item) => (
                                <MenuItem key={item.workorderNo} value={item.workorderNo}>
                                    {item.workorderNo} - {item.description}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {newRequest.items.map((item, index) => (
                        <Paper
                            key={index}
                            sx={{
                                p: 2,
                                mb: 2,
                                backgroundColor: "#f9f9f9",
                                border: "1px solid #ddd",
                            }}
                        >
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={3}>
                                    <TextField
                                        select
                                        label="Item No"
                                        value={item.itemNo}
                                        onChange={(e) =>
                                            handleItemChange(index, "itemNo", e.target.value)
                                        }
                                        SelectProps={{ native: true }}
                                        fullWidth
                                    >
                                        {inventory.map((inv) => (
                                            <option key={inv.itemNo} value={inv.itemNo}>
                                                {inv.itemNo} - {inv.partName}
                                            </option>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        label="Qty Requested"
                                        type="number"
                                        value={item.qtyRequested}
                                        onChange={(e) =>
                                            handleItemChange(index, "qtyRequested", e.target.value)
                                        }
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="Remarks"
                                        value={item.remarks}
                                        onChange={(e) =>
                                            handleItemChange(index, "remarks", e.target.value)
                                        }
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemoveItem(index)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}

                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddItem}
                    >
                        Add Item
                    </Button>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmitRequest}
                        sx={{ backgroundColor: "#1FAEC5" }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default MyRequests;
