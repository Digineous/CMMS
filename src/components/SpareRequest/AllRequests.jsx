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
    CircularProgress,
    Stack,
    Tooltip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { issueRequests } from "../../api/SpareRequest/api.IssueRequests";
import { rejectRequests } from "../../api/SpareRequest/api.RejectRequests";
import { approveRequests } from "../../api/SpareRequest/api.ApproveRequests";
import { apiGetAllRequests } from "../../api/SpareRequest/api.GetAllRequests";
import { getInventory } from "../../api/Master/Inventory/getInventory";

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

const AllRequests = () => {
    const [requests, setRequests] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [partialModalOpen, setPartialModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [rejectRemark, setRejectRemark] = useState("");
    const [partialItems, setPartialItems] = useState([]);

    useEffect(() => {
        fetchRequests();
        fetchInventory();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await apiGetAllRequests();
            setRequests(response.data.data || []);
        } catch (error) {
            console.error("❌ Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInventory = async () => {
        try {
            const response = await getInventory();
            setInventory(response.data.data || []);
        } catch (error) {
            console.error("❌ Error fetching inventory:", error);
        }
    };

    const setApproveRequests = async (id) => {
        console.log("✅ Approve function hit for request:", id);
        try {
            await approveRequests(id);
            await fetchRequests();
        } catch (error) {
            console.error("Error Approving Request: ", error);
        }
    };

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

    // --- Reject Modal Handlers ---
    const handleOpenRejectModal = (request) => {
        setSelectedRequest(request);
        setRejectRemark("");
        setRejectModalOpen(true);
    };

    const handleCloseRejectModal = () => {
        setRejectModalOpen(false);
        setSelectedRequest(null);
    };

    const handleRejectSubmit = async () => {
        if (selectedRequest) {
            console.log("🚫 Reject Request Payload:", {
                requestNo: selectedRequest.requestNo,
                remark: rejectRemark,
            });
            const id = selectedRequest.requestNo;
            const payload = { remark: rejectRemark };
            try {
                await rejectRequests(id, payload);
                await fetchRequests();
                handleCloseRejectModal();
            } catch (error) {
                console.error("Error rejecting request: ", error);
            }
        }
    };

    // --- Partial Issue Modal Handlers ---
    const handleOpenPartialModal = (request) => {
        const initialItems = request.items.map((item) => ({
            requestItemNo: item.requestItemNo,
            itemNo: item.itemNo, // ✅ include itemNo for correct mapping
            qtyRequested: item.qtyRequested,
            qtyIssued: item.qtyIssued,
            qtyToIssue: "",
        }));
        setSelectedRequest(request);
        setPartialItems(initialItems);
        setPartialModalOpen(true);
    };

    const handleClosePartialModal = () => {
        setPartialModalOpen(false);
        setSelectedRequest(null);
        setPartialItems([]);
    };

    const handlePartialQtyChange = (index, value) => {
        const updatedItems = [...partialItems];
        updatedItems[index].qtyToIssue = value;
        setPartialItems(updatedItems);
    };

const handlePartialSubmit = async () => {
  if (!selectedRequest) return;

  const id = selectedRequest.requestNo;
  const payload = {
    items: partialItems.map((item) => ({
      requestItemNo: item.requestItemNo,
      qtyToIssue: Number(item.qtyToIssue),
    })),
  };

  try {
    const response = await issueRequests(id, payload);
    console.log("✅ Issue Request Response:", response.data || response);
    await fetchRequests();
    handleClosePartialModal();
  } catch (error) {
    console.error("❌ Error Issuing Request:", error);
  }
};


    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <div style={{ padding: "0px 20px" }}>
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
                    All Requests
                </Typography>
            </div>

            {requests.length === 0 ? (
                <Typography color="text.secondary" sx={{ mt: 3 }}>
                    No requests available.
                </Typography>
            ) : (
                requests.map((req) => (
                    <Accordion key={req.requestNo} elevation={2} sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Request #{req.requestNo}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Work Order: {req.workorderNo} • Requested By:{" "}
                                    {req.requestedBy || "N/A"} • Requested At:{" "}
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
                            {/* Action Buttons */}
                            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 2 }}>
                                <Tooltip title="Approve Request" arrow>
                                    <IconButton
                                        color="success"
                                        size="large"
                                        sx={{ bgcolor: "#e8f5e9", "&:hover": { bgcolor: "#c8e6c9" } }}
                                        onClick={() => setApproveRequests(req.requestNo)}
                                    >
                                        <CheckCircleIcon fontSize="large" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Partial Issue" arrow>
                                    <IconButton
                                        color="warning"
                                        size="large"
                                        sx={{ bgcolor: "#fff3e0", "&:hover": { bgcolor: "#ffe0b2" } }}
                                        onClick={() => handleOpenPartialModal(req)}
                                    >
                                        <LocalShippingIcon fontSize="large" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Reject Request" arrow>
                                    <IconButton
                                        color="error"
                                        size="large"
                                        sx={{ bgcolor: "#ffebee", "&:hover": { bgcolor: "#ffcdd2" } }}
                                        onClick={() => handleOpenRejectModal(req)}
                                    >
                                        <CancelIcon fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>

                            {/* Table Section */}
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
                                            const { partCode, partName } = findInventoryDetails(item.itemNo);
                                            return (
                                                <StyledTableRow key={item.requestItemNo}>
                                                    <StyledTableCell>{item.itemNo}</StyledTableCell>
                                                    <StyledTableCell>{partCode}</StyledTableCell>
                                                    <StyledTableCell>{partName}</StyledTableCell>
                                                    <StyledTableCell>{item.qtyRequested}</StyledTableCell>
                                                    <StyledTableCell>{item.qtyIssued}</StyledTableCell>
                                                    <StyledTableCell>
                                                        {item.remarks || (
                                                            <Typography color="text.secondary" fontStyle="italic">
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

            {/* Reject Modal */}
            <Dialog open={rejectModalOpen} onClose={handleCloseRejectModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600, color: "#c62828" }}>
                    Reject Request #{selectedRequest?.requestNo}
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Please enter a remark for rejecting this request:
                    </Typography>
                    <TextField
                        fullWidth
                        label="Remark"
                        multiline
                        rows={3}
                        value={rejectRemark}
                        onChange={(e) => setRejectRemark(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRejectModal}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleRejectSubmit}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Partial Issue Modal */}
            <Dialog open={partialModalOpen} onClose={handleClosePartialModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600, color: "#f57c00" }}>
                    Partial Issue - Request #{selectedRequest?.requestNo}
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Enter quantities to issue for each item:
                    </Typography>

                    {partialItems.map((item, index) => {
                        const { partCode, partName } = findInventoryDetails(item.itemNo);
                        return (
                            <Box key={item.requestItemNo} sx={{ mb: 2 }}>
                                <Typography fontWeight={600}>
                                    Item #{item.itemNo} — {partCode} ({partName})
                                </Typography>
                                <TextField
                                    label={`Qty to Issue (Requested: ${item.qtyRequested})`}
                                    type="number"
                                    fullWidth
                                    value={item.qtyToIssue}
                                    onChange={(e) => handlePartialQtyChange(index, e.target.value)}
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        );
                    })}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePartialModal}>Cancel</Button>
                    <Button variant="contained" color="warning" onClick={handlePartialSubmit}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AllRequests;
