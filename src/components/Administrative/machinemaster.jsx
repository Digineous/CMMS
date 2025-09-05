import {
  Box, Button, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, Table, TableBody, TableHead, Grid, TableRow, TextField, styled, tableCellClasses, TablePagination, Typography,
  TableCell,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Skeleton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthCheck } from "../../utils/Auth";
import { apiGetPlant } from "../../api/PlantMaster/api.getplant";
import { apiGetState } from "../../api/PlantMaster/api.getstate";
import { apiGetCity } from "../../api/PlantMaster/api.getcity";
import { apiAddLineMaster } from "../../api/LineMaster/api.addline";
import { apiUpdateLine } from "../../api/LineMaster/api.updateline";
import { apiDeleteLine } from "../../api/LineMaster/api.deleteline";
import { apigetLines } from "../../api/LineMaster/api.getline";
import DeleteConfirmationModal from "../deletemodal";
import BackButton from "../backbutton";
import { apiMachineMaster } from "../../api/MachineMaster/api.addmachine";
import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
import { apiDeleteMachine } from "../../api/MachineMaster/api.deletemachine";
import { apiUpdateMachineMaster } from "../../api/MachineMaster/api.updatemachine";

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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
export default function MachineMaster() {
  const [addOpen, setAddOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [refreshData, setRefreshData] = useState(false);
  const [plantData, setPlantData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [machineData, setMachineData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [locationData, setlocationData] = useState([]);


  const [error, setError] = useState(null);
  const [machineToDelete, setMachineToDelete] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePlantId, setDeletePlantId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStateId, setSelectedStateId] = useState("");
  const initialFormData = {
    plantNo: null,
    lineNo: null,
    machineName: "",
    displayMachineName: "",
    lineProductionCount: "",
    cycleTime: "",
  }
  const [formData, setFormData] = useState(initialFormData);
  useAuthCheck()
  useEffect(() => {
    const getMachines = async () => {
      try {
        const result = await apigetMachine()
        setMachineData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    }
    getMachines();
  }, [refreshData])
  useEffect(() => {
    const getPlants = async () => {
      try {
        const result = await apiGetPlant()
        setPlantData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    }
    getPlants()
  }, [])
  useEffect(() => {
    const getLines = async () => {
      try {
        const result = await apigetLines();
        setLineData(result.data.data);
        // setUpdatedMachineData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getLines();
  }, [refreshData]);
  useEffect(() => {
    const getState = async () => {
      try {
        const result = await apiGetState();
        if (Array.isArray(result.data.data)) {
          setStateData(result.data.data);
        } else {
          setStateData([]);
        }
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
        setStateData([]);
      }
    };
    getState();
  }, [refreshData]);
  useEffect(() => {
    const getCity = async () => {
      if (selectedStateId) {
        try {
          const result = await apiGetCity(selectedStateId);
          if (Array.isArray(result.data.data)) {
            setlocationData(result.data.data);
          } else {
            setlocationData([]);
          }
        } catch (error) {
          setError(error.message);
          handleSnackbarOpen(error.message, "error");
          setlocationData([]);
        }
      }
    };
    getCity();
  }, [selectedStateId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "state") {
      setSelectedStateId(value);
    }
    if (name === "location") {
    }
  };

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSeverity(severity);
    setOpenSnackbar(true);
  };
  const handleEditClick = (row) => {
    setFormData(row);
    setUpdateOpen(true);
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await apiMachineMaster(
        formData
      );
      handleSnackbarOpen("Machine added successfully!", "success");
      setFormData(initialFormData)
      setAddOpen(false);
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Error adding Machine:", error);
      handleSnackbarOpen("Error adding Plant. Please try again.", "error");
    }
  };
  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await apiUpdateMachineMaster(
        formData
      );
      handleSnackbarOpen("Machine Updated successfully!", "success");
      setFormData(initialFormData);
      setRefreshData((prev) => !prev);
      setUpdateOpen(false);
    } catch (error) {
      console.error("Error updating Machine:", error);
      handleSnackbarOpen("Error updating Machine. Please try again.", "error");
    }
  };
  const handleDeleteClick = async (id) => {
    setDeleteModalOpen(true)
    setMachineToDelete(id)
  };
  const handleConfirmDelete = async () => {
    try {
      const result = await apiDeleteMachine(machineToDelete);
      handleSnackbarOpen("Machine Deleted successfully!", "success");
      setRefreshData((prev) => !prev);

    } catch (error) {
      console.error("Error deleting Machine:", error);
      handleSnackbarOpen("Error deleting Machine. Please try again.", "error");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const getStateName = (stateId) => {
    const state = stateData.find((s) => s.stateId === stateId);
    return state ? state.stateName : "Unknown";
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns = ["Plant Name", "Segment", "Country", "State", "Location", "Create Date"];
  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, plantData.length - page * rowsPerPage

  const formatData = (data) => {
    return data.map((row) => ({
      "Plant Name": row.plantName,
      "Segment": row.segment,
      "Country": row.country,
      "State": getStateName(row.state),
      "Location": row.location,
      "Create Date": row.createdAt,
    }));
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, plantData.length - page * rowsPerPage);
  const handleModalClose = () => {
    // Reset the form data
    setFormData(initialFormData)

    setAddOpen(false);
    setUpdateOpen(false);
  };
  return (
    <div style={{ padding: "0px 20px" }}>
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
          <BackButton background={"transparent"} iconColor="#fff" />
          <Typography
            variant="h5"
            style={{
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            Machine Master
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
      {/* <DownloadButton apiCall={apiGetPlant} formatData={formatData} fileName="PlantMasterReport.xlsx" /> */}

      <Box>
        <div style={{ paddingTop: "5px", paddingBottom: "5px" }}></div>
        <Table
          size="small"
          style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
        >
          <TableHead>
            <TableRow>
              {/* <StyledTableCell className="table-cell">Plant No</StyledTableCell> */}
              <StyledTableCell className="table-cell"> Plant Name </StyledTableCell>
              <StyledTableCell className="table-cell"> Line Name </StyledTableCell>
              <StyledTableCell className="table-cell"> Machine No </StyledTableCell>

              <StyledTableCell className="table-cell">Machine Name</StyledTableCell>
              <StyledTableCell className="table-cell">Display Machine Name</StyledTableCell>
              <StyledTableCell className="table-cell">Created Date</StyledTableCell>
              <StyledTableCell className="table-cell">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {machineData.length === 0
              ? // Render skeleton loaders when data is still loading
              Array.from(Array(5).keys()).map((index) => (
                <StyledTableRow key={index}>
                  {/* <StyledTableCell>
                      <Skeleton animation="wave" />
                    </StyledTableCell> */}
                  <StyledTableCell>
                    <Skeleton animation="wave" />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Skeleton animation="wave" />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Skeleton animation="wave" />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Skeleton animation="wave" />
                  </StyledTableCell>
                  {/* <StyledTableCell>
                      <Skeleton animation="wave" />
                    </StyledTableCell> */}
                  {/* <StyledTableCell> 
                      <Skeleton animation="wave" />
                    </StyledTableCell> */}
                </StyledTableRow>
              ))
              : machineData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <StyledTableRow key={index}>
                    {/* <StyledTableCell className="table-cell">
                      {row.plantNo}
                    </StyledTableCell> */}
                    <StyledTableCell className="table-cell">
                      {row.plantName}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.lineName}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.machineNo}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.machineName}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.displayMachineName}
                    </StyledTableCell>
                    {/* <StyledTableCell className="table-cell">
                        {getStateName(row.state)}
                      </StyledTableCell> */}
                    {/* <StyledTableCell className="table-cell">
                        {row.location}
                      </StyledTableCell> */}
                    <StyledTableCell className="table-cell">
                      {row.createdAt}
                    </StyledTableCell>
                    <StyledTableCell
                      className="table-cell"
                    >
                      <IconButton onClick={() => handleEditClick(row)}>
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        style={{ color: "#FF3131" }}
                        onClick={() => handleDeleteClick(row.machineNo)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            {plantData.length === 0 && (
              <StyledTableRow style={{ height: 53 }}>
                <StyledTableCell colSpan={8} style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {`No further data available`}
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={machineData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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
            <h2>Add New Machine</h2>
            <hr />
            <br />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <InputLabel>Plant Name</InputLabel>
                  <Select
                    name="plantNo"
                    value={formData.plantNo}
                    onChange={handleInputChange}
                  >
                    {plantData.map((row) => (
                      <MenuItem key={row.plantNo} value={row.plantNo}>{row.plantName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <InputLabel>Line Name</InputLabel>
                  <Select
                    name="lineNo"
                    value={formData.lineNo}
                    onChange={handleInputChange}
                  >
                    {lineData.map((row) => (
                      <MenuItem key={row.lineNo} value={row.lineNo}>{row.lineName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField fullWidth
                  name="machineName"
                  value={formData.machineName}
                  onChange={handleInputChange}
                  label="Machine Name "
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  name="displayMachineName"
                  value={formData.displayMachineName}
                  onChange={handleInputChange}
                  label="Display Machine Name "
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  name="lineProductionCount"
                  value={formData.lineProductionCount}
                  onChange={handleInputChange}
                  label="Line Production Count "
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  name="cycleTime"
                  value={formData.cycleTime}
                  onChange={handleInputChange}
                  label="Cycle Time"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  onClick={handleAddSubmit}
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "20px" }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
        <Modal open={updateOpen} onClose={handleModalClose}>
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
            <h2>Update Machine Data</h2>
            <hr />
            <br />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <InputLabel>Plant Name</InputLabel>
                  <Select
                    name="plantNo"
                    value={formData.plantNo}
                    onChange={handleInputChange}
                  >
                    {plantData.map((row) => (
                      <MenuItem key={row.plantNo} value={row.plantNo}>{row.plantName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <InputLabel>Line Name</InputLabel>
                  <Select
                    name="lineNo"
                    value={formData.lineNo}
                    onChange={handleInputChange}
                  >
                    {lineData.map((row) => (
                      <MenuItem key={row.lineNo} value={row.lineNo}>{row.lineName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField fullWidth
                  name="machineName"
                  value={formData.machineName}
                  onChange={handleInputChange}
                  label="Machine Name "
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  name="displayMachineName"
                  value={formData.displayMachineName}
                  onChange={handleInputChange}
                  label="Display Machine Name "
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  name="lineProductionCount"
                  value={formData.lineProductionCount}
                  onChange={handleInputChange}
                  label="Line Production Count "
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  name="cycleTime"
                  value={formData.cycleTime}
                  onChange={handleInputChange}
                  label="Cycle Time"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  onClick={handleEditSubmit}
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "20px" }}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
        <DeleteConfirmationModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </Box>
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
    </div >
  );
}
