import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Modal,
    TextField,
    IconButton,
    Typography,
    Box,
    Grid,
    useMediaQuery,
    useTheme,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    tableCellClasses,
    styled,
    TablePagination,
    Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/table.css";
import "../../assets/css/style.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { apiGetDevice } from "../../api/DeviceMaster/api.getdevice";
import { apiGetPlant } from "../../api/PlantMaster/api.getplant";
import { apigetLines } from "../../api/LineMaster/api.getline";
import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
// import { apiAddPart } from "../../api/api.addpart";
// import { apiAddPart } from "../../api";
// import { apiGetPart } from "../../api/api.getpart";
// import { apiUpdatePart } from "../api/api.updatepart";
// import { apiDeletePart } from "../api/api.deletepart";
// import DeleteConfirmationModal from "./deletemodal";
import { Skeleton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
// import { useAuthCheck } from "../utils/Auth";
// import { apiViewMultipleParts } from "../api/api.viewmultipleparts";
// import { apiGetPartsName } from "../api/api.getPartsName";
// import PartNamesModal from "./PartsNameModal";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#1FAEC5",
        color: theme.palette.common.white,
        // position: "sticky",
        top: 0,
        zIndex: 1,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const DeviceMaster = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [open, setOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);


    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [severity, setSeverity] = useState("success");
    const [refreshData, setRefreshData] = useState(false);
    const [lineData, setLineData] = useState([]);
    const [plantData, setPlantData] = useState([]);
    const [machineData, setMachineData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);
    const [partData, setPartData] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletePartId, setDeleteParttId] = useState(null);
    const [selectedLine, setSelectedLine] = useState("");
    const [viewMPResultOpen, setViewMPResultOpen] = useState(false);
    const [partsData, setPartsData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPartNames, setSelectedPartNames] = useState("");
    const [reasons, setReasons] = useState("");
    const [partsNames, setPartsNames] = useState({});
    const [editOpen, setEditOpen] = useState(false)
    const [mPartsData, setMPartsData] = useState({
        lineNo: "",
        machineNo: "",
        partName: "",
    });
    const [viewMPAdd, setViewMPAdd] = useState(false);

    const [updatedPartData, setUpdatedPartData] = useState({
        partNo: "",
        plantNo: 1,
        lineNo: "",
        machineNo: "",
        partName: "",
        cycleTime: "",
        plantProduction: "",
        multipleFactor: "",
        ctReduction: "",
        lowerBound: "",
        upperBound: "",
    });
    const date = new Date()
    const currentDate = date.toLocaleDateString()
    const [tableData, setTableData] = useState([]);
    const [reasonToDelete, setReasonToDelete] = useState(null);
    const [formData, setFormData] = useState({
        plantNo: null,
        lineNo: null,
        machineNo: null,
        deviceName: "",
        topic: ""
    })
    useEffect(() => {
        const getPlant = async () => {
            try {
                const result = await apiGetPlant();
                //console.log("Result data plant:", result.data.data);
                setPlantData(result.data.data);
            } catch (error) {
                setError(error.message);
                handleSnackbarOpen(error.message, "error");
            }
        };
        getPlant();
    }, [refreshData]);

    useEffect(() => {
        const getDevices = async () => {
            try {
                const result = await apiGetDevice();
                setTableData(result.data.data)
            } catch (error) {
                setError(error.message);
                handleSnackbarOpen(error.message, "error");
            }
        }
        getDevices()
    }, [])


    const handleOpenModal = (partNames) => {
        setSelectedPartNames(partNames);
        setModalOpen(true);
    };
    useEffect(() => {
        const getline = async () => {
            try {
                const result = await apigetLines();
                //console.log("Result data line:", result.data.data);
                setLineData(result.data.data);
            } catch (error) {
                setError(error.message);
                handleSnackbarOpen(error.message, "error");
            }
        };
        getline();
    }, [refreshData]);

    useEffect(() => {
        const getmachine = async () => {
            try {
                const result = await apigetMachine();
                //console.log("Result data machine:", result.data.data);
                setMachineData(result.data.data);
            } catch (error) {
                setError(error.message);
                handleSnackbarOpen(error.message, "error");
            }
        };
        getmachine();
    }, [refreshData]);
    const handleSnackbarOpen = (message, severity) => {
        setSnackbarMessage(message);
        setSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData, // Spread previous state
            [name]: value, // Dynamically update the field based on `name`
        }));
    };

    const handleVMPClick = () => {
        setViewMPAdd(true);
    };
    // const handleUpdateSubmit = async () => {
    //     try {
    //         const { upperBound, lowerBound, cycleTime, ...data } = updatedPartData;
    //         const payload = {
    //             ...data,
    //             cycleTime: cycleTime.toString(),
    //             upperBound: parseFloat(upperBound),
    //             lowerBound: parseFloat(lowerBound),
    //         };

    //         const result = await apiUpdatePart(payload);
    //         await getParts();
    //         //console.log("Part updated successfully:", result.data);
    //         handleSnackbarOpen("Part updated successfully!", "success");
    //         setRefreshData((prev) => !prev);
    //         setOpen(false);
    //     } catch (error) {
    //         setOpen(false);
    //         handleSnackbarOpen("Error updating device. Please try again.", "error");
    //         console.error("Error updating device:", error);
    //     }
    // };
    // const fetchPartsNameByPartId = async (machineId, partId) => {
    //     try {
    //         const response = await apiGetPartsName({ machineId, partId });
    //         //console.log("view device name:", response.data.data);
    //         const partData = response.data.data[0];
    //         return partData.partNames || "N/A";
    //     } catch (error) {
    //         console.error("error getting device name:", error);
    //         return null;
    //     }
    // };
    // const fetchAllPartsNames = async () => {
    //     const newPartsNames = {};
    //     for (const row of partData) {
    //         const partName = await fetchPartsNameByPartId(
    //             row.machineId,
    //             row.partName
    //         );
    //         if (partName) {
    //             newPartsNames[`${row.machineNo}-${row.partNo}`] = partName;
    //         }
    //     }
    //     setPartsNames(newPartsNames);
    // };
    // useEffect(() => {
    //     fetchAllPartsNames();
    // }, [partData]);
    const handleAddSubmit = async () => {
        //console.log(formData)
    };

    const filteredLines = lineData.filter((line) => line.plantNo === 1);

    const filteredMachines = machineData.filter(
        (machine) => machine.lineNo === selectedLine
    );

    const filteredParts2 = partData.filter(
        (device) =>
            device.lineNo === mPartsData.lineNo &&
            device.machineNo === mPartsData.machineNo
    );

    const handleViewMPartsChange = (e) => {
        const { name, value } = e.target;
        setMPartsData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleConfirmDelete = () => {
        // dispatch(deletePart(reasonToDelete))
        // setReasonToDelete(null)
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const filteredMachines2 = machineData.filter(
        (machine) => machine.lineNo === mPartsData.lineNo
    );

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleModalClose = () => {
        setUpdatedPartData({
            partNo: "",
            plantNo: "",
            lineNo: "",
            machineNo: "",
            partName: "",
            cycleTime: "",
            plantProduction: "",
            multipleFactor: "",
            ctReduction: "",
            lowerBound: "",
            upperBound: "",
        });

        setAddOpen(false);
        setOpen(false);
        setViewMPAdd(false);
        setViewMPResultOpen(false);
        // setTableData(initialFormData)
        setEditOpen(false)
    };
    const handleDelete = (id) => {
        // dispatch(deletePart(id))
    }
    const handleEdit = (id) => {
        setEditOpen(true)
        const device = device.find((device) => device.id === id);
        setTableData(device)
    }
    const handleEditSubmit = () => {
        // dispatch(editPart({
        //     ...tableData
        // }))
    }
    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, partData.length - page * rowsPerPage);

    return (
        <div style={{ padding: "0px 20px" }}>
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "20px",
                    paddingBottom: "10px",
                }}
            >
                <h2>Device Master</h2>
                <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Button
                    onClick={() => setAddOpen(true)}
                    style={{
                        background: "#1FAEC5",
                        fontWeight: "600",
                        borderRadius: "10px",
                        color: "white",
                        border: "4px solid lightblue",
                        padding: "5px 8px 5px 8px",
                        marginBottom: "5px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = "#17A2B8";
                        e.target.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = "#1FAEC5";
                        e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
                    }}
                >
                    Add New &nbsp;
                    <FontAwesomeIcon
                        style={{ fontSize: "18px", color: "white" }}
                        icon={faPlus}
                    />
                </Button>


                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={tableData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>

            <Box sx={{ maxHeight: "500px", overflow: "auto", marginBottom: "40px" }}>
                <TableContainer component={Paper}>
                    <Table
                        size="small"
                        style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
                    >
                        <TableHead>
                            <TableRow sx={{ position: "sticky", top: 0, zIndex: 1 }}>
                                <StyledTableCell className="table-cell">Plant Name</StyledTableCell>
                                <StyledTableCell className="table-cell">Line Name</StyledTableCell>
                                <StyledTableCell className="table-cell">Machine Name</StyledTableCell>
                                <StyledTableCell className="table-cell">Device No</StyledTableCell>
                                <StyledTableCell className="table-cell">Device Name</StyledTableCell>
                                <StyledTableCell className="table-cell">Topic</StyledTableCell>
                                <StyledTableCell className="table-cell">Created Date</StyledTableCell>
                                <StyledTableCell className="table-cell">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.length === 0 ? (
                                <TableRow>
                                    <StyledTableCell colSpan={9} style={{ textAlign: "center" }}>
                                        No more rows to display
                                    </StyledTableCell>
                                </TableRow>
                            ) : (
                                tableData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <StyledTableRow key={row.id}>
                                            <StyledTableCell className="table-cell">{row.plantName}</StyledTableCell>
                                            <StyledTableCell className="table-cell">{row.lineName}</StyledTableCell>
                                            <StyledTableCell className="table-cell">{row.displayMachineName}</StyledTableCell>
                                            <StyledTableCell className="table-cell">{row.deviceNo}</StyledTableCell>
                                            <StyledTableCell className="table-cell">{row.deviceName}</StyledTableCell>

                                            <StyledTableCell className="table-cell">{row.topic}
                                            </StyledTableCell>
                                            <StyledTableCell className="table-cell">{row.createdAt}
                                            </StyledTableCell>
                                            <StyledTableCell className="table-cell">
                                                <IconButton onClick={() => handleEdit(row.deviceNo)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    style={{ color: "#FF3131" }}
                                                    onClick={() => setReasonToDelete(row.deviceNo)}
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

            </Box>
            {/* <PartNamesModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                partNames={selectedPartNames}
            /> */}
            {/* <DeleteConfirmationModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            /> */}
            <Modal open={addOpen} onClose={handleModalClose}>
                <div
                    style={{
                        borderRadius: "10px",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        padding: "20px",
                        width: isMobile ? "90%" : "500px",
                    }}
                >
                    <button
                        onClick={handleModalClose}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            cursor: "pointer",
                            backgroundColor: "transparent",
                            border: "none",
                            fontSize: "30px",
                        }}
                    >
                        &times;
                    </button>
                    <h2>Add New Part</h2>
                    <hr />
                    <br />

                    <Grid container spacing={2}>
                        {/* Plant and Line Name */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Plant Name</InputLabel>
                                <Select
                                    name="plantNo"
                                    value={formData.plantNo}
                                    onChange={handleInputChange}
                                >
                                    {plantData.map((row) => (
                                        <MenuItem key={row.plantNo} value={row.plantNo}>
                                            {row.plantName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Line Name</InputLabel>
                                <Select
                                    name="lineNo"
                                    value={formData.lineNo}
                                    onChange={handleInputChange}
                                >
                                    {lineData.map((row) => (
                                        <MenuItem key={row.lineNo} value={row.lineNo}>
                                            {row.lineName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Machine Name and Part Name */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Machine Name</InputLabel>
                                <Select
                                    name="machineNo"
                                    value={formData.machineNo}
                                    onChange={handleInputChange}
                                >
                                    {machineData.map((row) => (
                                        <MenuItem key={row.machineNo} value={row.machineNo}>
                                            {row.machineName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Device Name */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    name="deviceName"
                                    label="Device Name"
                                    value={formData.deviceName}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        </Grid>

                        {/* Topic */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="topic"
                                label="Topic"
                                value={formData.topic}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>

                            <Button
                                onClick={handleAddSubmit}
                                variant="contained"
                                color="primary"
                                fullWidth
                                style={{ marginTop: "20px" }}
                            >
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
            <Modal open={editOpen} onClose={handleModalClose}>
                <div
                    style={{
                        borderRadius: "10px",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        padding: "20px",
                        minWidth: "500px",
                    }}
                >
                    <button
                        onClick={handleModalClose}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            cursor: "pointer",
                            backgroundColor: "transparent",
                            border: "none",
                            fontSize: "30px",
                        }}
                    >
                        &times;
                    </button>
                    <h2>Edit Part Master </h2>
                    <hr />
                    <br />

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}
                    >
                        <FormControl sx={{ width: "17rem", mr: "10px" }}>
                            <InputLabel>Plant Name</InputLabel>
                            <Select
                                name="plant_name"
                                value={tableData.plant_name}
                                onChange={(e) => {
                                    setSelectedLine(e.target.value);
                                    handleInputChange(e);
                                }}
                            >
                                <MenuItem key="linamar" value="Linamar">
                                    Linamar
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: "17rem" }}>
                            <InputLabel>Line Name</InputLabel>
                            <Select
                                name="line_name"
                                value={tableData.line_name}
                                onChange={(e) => handleInputChange(e)}
                            >
                                <MenuItem key="cylinder_head" value="CylinderHead">
                                    CylinderHead
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}
                    >
                        <FormControl sx={{ width: "17rem" }}>
                            <InputLabel>Machine Name</InputLabel>
                            <Select
                                name="machine_name"
                                onChange={(e) => handleInputChange(e)}
                                value={tableData.machine_name}
                            >
                                <MenuItem key="OP-70" value="OP-70">
                                    OP-70
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            style={{ width: "17rem" }}
                            name="part_name"
                            label="Part Name"
                            value={tableData.part_name}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}
                    >
                        <TextField
                            name="cycle_time"
                            label="Standard Cycle Time"
                            value={tableData.cycle_time}
                            onChange={(e) => handleInputChange(e)}
                            style={{ width: "17rem" }}
                        />
                        <TextField
                            style={{ width: "17rem" }}
                            name="part_number"
                            label="Part Number"
                            value={tableData.part_number}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}
                    >
                        <TextField
                            style={{ width: "17rem" }}
                            name="planned_production"
                            label="Planned Production"
                            value={tableData.planned_production}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}
                    ></div>

                    <Button
                        onClick={handleEditSubmit}
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "20px" }}
                    >
                        Update
                    </Button>
                </div>
            </Modal>
            <Modal open={reasonToDelete !== null} onClose={handleModalClose}>
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        width: "400px",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6" style={{ marginBottom: "20px" }}>
                        Are you sure you want to delete this item?
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirmDelete}
                        style={{ marginRight: "10px" }}
                    >
                        Yes, Delete
                    </Button>
                    <Button variant="outlined" onClick={() => setReasonToDelete(null)}>
                        Cancel
                    </Button>
                </div>
            </Modal>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
            >
                <MuiAlert
                    onClose={() => setOpenSnackbar(false)}
                    severity={severity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default DeviceMaster;
