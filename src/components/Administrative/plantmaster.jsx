import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  styled,
  tableCellClasses,
  TablePagination,
  Typography,
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
import { apiAddPlant } from "../../api/PlantMaster/api.addplant";
import { apiUpdatePlant } from "../../api/PlantMaster/api.updateplant";
import { apiDeletePlant } from "../../api/PlantMaster/api.deleteplant";
import DeleteConfirmationModal from "../deletemodal";
import BackButton from "../backbutton";



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
export default function PlantMaster() {
  const [addOpen, setAddOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [refreshData, setRefreshData] = useState(false);
  const [plantData, setPlantData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [locationData, setlocationData] = useState([]);


  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePlantId, setDeletePlantId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [updatedPlantData, setUpdatedPlantData] = useState({
    plantNo: "",
    plantName: "",
    segment: "",
    location: "",
    state: "",
    country: "",
  });
  useAuthCheck()

  useEffect(() => {
    const getPlant = async () => {
      try {
        const result = await apiGetPlant();
        setPlantData(result.data.data);
        setUpdatedPlantData(result.data.data);
      } catch (error) {
        setError(error.message);
        handleSnackbarOpen(error.message, "error");
      }
    };
    getPlant();
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
    setUpdatedPlantData((prevData) => ({
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
    setUpdatedPlantData(row);
    setUpdateOpen(true);
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await apiAddPlant(
        updatedPlantData.plantNo,
        updatedPlantData.plantName,
        updatedPlantData.segment,
        updatedPlantData.location,
        updatedPlantData.state,
        updatedPlantData.country
      );
      handleSnackbarOpen("Plant added successfully!", "success");
      setUpdatedPlantData({
        plantNo: "",
        plantName: "",
        segment: "",
        location: "",
        state: "",
        country: "",
      });

      setAddOpen(false);
      setRefreshData((prev) => !prev);
    } catch (error) {
      handleSnackbarOpen("Error adding Plant. Please try again.", "error");
    }
  };
  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await apiUpdatePlant(
        updatedPlantData.plantNo,
        updatedPlantData.plantName,
        updatedPlantData.segment,
        updatedPlantData.location,
        updatedPlantData.state,
        updatedPlantData.country
      );
      handleSnackbarOpen("Plant Updated successfully!", "success");
      setUpdatedPlantData({
        plantNo: "",
        plantName: "",
        segment: "",
        location: "",
        state: "",
        country: "",
      });
      setRefreshData((prev) => !prev);
      setUpdateOpen(false);
    } catch (error) {
      handleSnackbarOpen("Error updating Plant. Please try again.", "error");
    }
  };
  const handleDelete = async (id) => {
    try {
      const result = await apiDeletePlant(id.plantNo);
      handleSnackbarOpen("Plant Deleted successfully!", "success");
      setRefreshData((prev) => !prev);

    } catch (error) {
      handleSnackbarOpen("Error deleting Plant. Please try again.", "error");
    }
  };
  const handleDeleteClick = (row) => {
    setDeletePlantId(row.plantNo);
    setDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    try {
      await apiDeletePlant(deletePlantId);
      handleSnackbarOpen("Plant Deleted successfully!", "success");
      setRefreshData((prev) => !prev);
    } catch (error) {
      handleSnackbarOpen("Error deleting Plant. Please try again.", "error");
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
    setUpdatedPlantData({
      plantNo: "",
      plantName: "",
      segment: "",
      location: "",
      state: "",
      country: "",
    });

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
            Plant Master
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

              <StyledTableCell className="table-cell">
                Plant Name
              </StyledTableCell>
              <StyledTableCell className="table-cell">Segment</StyledTableCell>
              <StyledTableCell className="table-cell">Country </StyledTableCell>
              <StyledTableCell className="table-cell">State</StyledTableCell>
              <StyledTableCell className="table-cell">Location</StyledTableCell>
              <StyledTableCell className="table-cell">
                Create Date
              </StyledTableCell>
              <StyledTableCell className="table-cell">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plantData.length === 0
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
                  <StyledTableCell>
                    <Skeleton animation="wave" />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Skeleton animation="wave" />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Skeleton animation="wave" />
                  </StyledTableCell>
                </StyledTableRow>
              ))
              : plantData
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
                      {row.segment}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.country}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {getStateName(row.state)}
                    </StyledTableCell>
                    <StyledTableCell className="table-cell">
                      {row.location}
                    </StyledTableCell>
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
                        onClick={() => handleDeleteClick(row)}
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
          count={plantData.length}
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
            <h2>Add New Plant</h2>
            <hr />
            <br />
            <div>
              <TextField
                label="Plant Name "
                name="plantName"
                value={updatedPlantData.plantName}
                onChange={handleInputChange}
                style={{
                  marginRight: "10px",
                  width: "28rem",
                  marginBottom: "10px",
                }}
              />
            </div>
            <div>
              <TextField
                label="Segment Name "
                value={updatedPlantData.segment}
                name="segment"
                onChange={handleInputChange}
                style={{
                  marginRight: "10px",
                  width: "28rem",
                  marginBottom: "10px",
                }}
              />
            </div>

            <FormControl sx={{ marginBottom: "10px", width: "52ch" }}>
              <InputLabel>Select State</InputLabel>
              <Select
                name="state"
                value={updatedPlantData.state}
                onChange={handleInputChange}
              >
                {stateData.map((state) => (
                  <MenuItem key={state.stateId} value={state.stateId}>
                    {state.stateName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div>

              <FormControl sx={{ marginBottom: "10px", width: "52ch" }}>
                <InputLabel>Location</InputLabel>
                <Select
                  name="location"
                  value={updatedPlantData.location}
                  onChange={handleInputChange}
                >
                  <MenuItem key="loc1" value="location1">
                    Location 1
                  </MenuItem>
                  {/* {locationData.map((city) => (
                    <MenuItem key={city.cityId} value={city.cityName}>
                      {city.cityName}
                    </MenuItem>
                  ))} */}
                </Select>
              </FormControl>
            </div>

            <Button
              onClick={handleAddSubmit}
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
            >
              Add
            </Button>
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
            <h2>Update Plant</h2>
            <hr />
            <br />
            <div>
              <TextField
                label="Plant Name "
                name="plantName"
                value={updatedPlantData.plantName}
                onChange={handleInputChange}
                style={{
                  marginRight: "10px",
                  width: "28rem",
                  marginBottom: "10px",
                }}
              />
            </div>
            <div>
              <TextField
                label="Segment Name "
                value={updatedPlantData.segment}
                name="segment"
                onChange={handleInputChange}
                style={{
                  marginRight: "10px",
                  width: "28rem",
                  marginBottom: "10px",
                }}
              />
            </div>
            <div>
            </div>

            <FormControl sx={{ marginBottom: "10px", width: "52ch" }}>
              <InputLabel>Select State</InputLabel>
              <Select
                name="state"
                value={updatedPlantData.state}
                onChange={handleInputChange}
              >
                {stateData.map((state) => (
                  <MenuItem key={state.stateId} value={state.stateId}>
                    {state.stateName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div>
              <FormControl sx={{ marginBottom: "10px", width: "52ch" }}>
                <InputLabel>Location</InputLabel>
                <Select
                  name="location"
                  value={updatedPlantData.location}
                  onChange={handleInputChange}
                >
                  <MenuItem key="loc1" value="location1">
                    Location 1
                  </MenuItem>
                  {/* {locationData.map((city) => (
                    <MenuItem key={city.cityId} value={city.cityName}>
                      {city.cityName}
                    </MenuItem>
                  ))} */}
                </Select>
              </FormControl>
            </div>
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
    </div>
  );
}
