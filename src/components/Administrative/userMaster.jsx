import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  styled,
  tableCellClasses,
  Skeleton,
  IconButton,
  Snackbar,
  Alert,
  Modal,
  TextField,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BackButton from "../backbutton";
import { apigetUsers } from "../../api/UserMaster/apiGetUsers";
import { apigetRole } from "../../api/UserMaster/apiGetRole";
import { apiAddUser } from "../../api/UserMaster/apiaddUser";

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

export default function UserMaster() {
  const [userData, setUserData] = useState([]);
  const [role, setRole] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    mobile: "",
    userName: "",
    password: "",
    dob: "",
    doj: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    address: "",
    userRoles: [],
  });

  useEffect(() => {
    fetchUsers();
    fetchRole();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apigetUsers();
      if (response.status === 200) {
        setUserData(response.data.data);
        setSnackbar({
          open: true,
          message: "Users fetched successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to fetch users",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error fetching users",
        severity: "error",
      });
    }
  };

  const fetchRole = async () => {
    try {
      const response = await apigetRole();
      if (response.status === 200) {
        setRole(response.data.data);
        setSnackbar({
          open: true,
          message: "Roles fetched successfully",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      setSnackbar({
        open: true,
        message: "Error fetching Role",
        severity: "error",
      });
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    console.log("Payload to save:", formData);
    try {
        const response = await apiAddUser(formData);
        if (response.status === 200) {
          await fetchUsers(); // Refresh user list
              setSnackbar({
      open: true,
      message: "User saved successfully",
      severity: "success",
    });
        } else {
          setSnackbar({
            open: true,
            message: "Failed to save user",
            severity: "error",
          });
        }
    } catch (error) {
        console.error("Error saving user:", error);
        setSnackbar({
            open: true,
            message: "Error saving user",
            severity: "error",
          });
    }   
    setOpenModal(false);
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <BackButton background={"transparent"} iconColor="#fff" />
          <Typography
            variant="h5"
            style={{ fontWeight: "bold", color: "#fff" }}
          >
            User Master
          </Typography>
        </div>
        <Button
          style={{
            fontWeight: "600",
            borderRadius: "10px",
            color: "white",
            border: "4px solid white",
            padding: "5px",
            background: "grey",
          }}
          onClick={() => setOpenModal(true)}
        >
          Add New &nbsp;
          <FontAwesomeIcon
            style={{ fontSize: "18px", color: "white" }}
            icon={faPlus}
          />
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
              <StyledTableCell>Full Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Mobile</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
              <StyledTableCell>Created By</StyledTableCell>
              <StyledTableCell>Create Date</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.length === 0
              ? Array.from(Array(5).keys()).map((i) => (
                  <StyledTableRow key={i}>
                    {Array(7)
                      .fill()
                      .map((_, idx) => (
                        <StyledTableCell key={idx}>
                          <Skeleton animation="wave" />
                        </StyledTableCell>
                      ))}
                  </StyledTableRow>
                ))
              : userData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <StyledTableRow key={row.userId}>
                      <StyledTableCell>{row.fullName}</StyledTableCell>
                      <StyledTableCell>{row.emailId}</StyledTableCell>
                      <StyledTableCell>{row.mobile}</StyledTableCell>
                      <StyledTableCell>
                        {row.roles[0]?.roleName}
                      </StyledTableCell>
                      <StyledTableCell>{row.createdBy}</StyledTableCell>
                      <StyledTableCell>
                        {new Date(row.createdAt).toLocaleDateString()}
                      </StyledTableCell>
                      <StyledTableCell>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setSnackbar({
                              open: true,
                              message: `Edit user: ${row.fullName}`,
                              severity: "info",
                            })
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setSnackbar({
                              open: true,
                              message: `Deleted user: ${row.fullName}`,
                              severity: "error",
                            })
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
          </TableBody>
        </Table>
      </Box>

      <TablePagination
        component="div"
        count={userData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Add User Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "80vh",
            overflowY: "auto", // scroll if too many fields
          }}
        >
          <Typography variant="h6" mb={2}>
            Add New User
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="emailId"
              value={formData.emailId}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Username"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              select
              label="Roles"
              name="userRoles"
              SelectProps={{
                value: formData.userRoles[0],
                onChange: (e) => {
                  setFormData((prev) => ({
                    ...prev,
                    userRoles: [e.target.value],
                  }));
                },
              }}
              fullWidth
            >
              {role.map((option) => (
                <MenuItem key={option.roleId} value={option.roleId}>
                  {option.roleName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Date of Joining"
              name="doj"
              type="date"
              value={formData.doj}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Zip Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              multiline
              rows={2}
              fullWidth
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ mt: 2 }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
