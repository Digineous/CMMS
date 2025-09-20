import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Snackbar,
  Alert,
  tableCellClasses,
  TablePagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { apigetMachine } from "../../api/MachineMaster/apigetmachine";
import { apiGetMTTRMTBFMachineReport } from "../../api/Reports/api.getmttrmachine";

// Styled Table Components
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
  "&:hover": {
    backgroundColor: "#e0f7ff",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function MttrMtbfReportByMachine() {
  const [machineNo, setMachineNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [machinesData, setMachinesData] = useState([]);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    handleFetchMachines();
  }, []);

  const handleFetch = async () => {
    const body = {
      machineNo: machineNo ? Number(machineNo) : null,
      fromDate: fromDate || null,
      toDate: toDate || null,
    };
    try {
      const response = await apiGetMTTRMTBFMachineReport(body);
      if (response?.data.statusCode === 200) {
        setFilteredData(response.data.data || []);
        setSnackbar({ open: true, message: "Data fetched successfully!", severity: "success" });
        setPage(0); // Reset to first page on new data
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (error) {
      console.error("Error Fetching MTTR/MTBF Report :", error);
      setSnackbar({ open: true, message: "Failed to fetch data!", severity: "error" });
    }
  };

  const handleFetchMachines = async () => {
    try {
      const response = await apigetMachine();
      if (response?.data.statusCode === 200) {
        setMachinesData(response.data.data || []);
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (error) {
      console.error("Error Fetching Machines :", error);
      setSnackbar({ open: true, message: "Failed to fetch machines!", severity: "error" });
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box p={2}>
      {/* Gradient Header */}
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
          MTTR & MTBF Report Details
        </Typography>
      </div>

      {/* Filters */}
      <Box display="flex" gap={2} mb={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Machine No</InputLabel>
          <Select
            value={machineNo}
            label="Machine No"
            onChange={(e) => setMachineNo(e.target.value)}
          >
            {machinesData.map((m) => (
              <MenuItem key={m.machineNo} value={m.machineNo}>
                {m.displayMachineName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="From Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <TextField
          size="small"
          label="To Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <Button variant="contained" onClick={handleFetch}>
          OK
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>Complaint No</StyledTableCell>
              <StyledTableCell>Workorder No</StyledTableCell>
              <StyledTableCell>Machine No</StyledTableCell>
              <StyledTableCell>Breakdown Time</StyledTableCell>
              <StyledTableCell>Repair Completed</StyledTableCell>
              <StyledTableCell>MTTR Hours</StyledTableCell>
              <StyledTableCell>MTBF Hours</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredData
            ).map((row) => (
              <StyledTableRow key={row.complaintNo}>
                <StyledTableCell>{row.complaintNo}</StyledTableCell>
                <StyledTableCell>{row.workorderNo || "-"}</StyledTableCell>
                <StyledTableCell>{row.machineNo}</StyledTableCell>
                <StyledTableCell>{row.breakdownTime}</StyledTableCell>
                <StyledTableCell>{row.repairCompletedAt || "-"}</StyledTableCell>
                <StyledTableCell>{row.mttrHours || "-"}</StyledTableCell>
                <StyledTableCell>{row.mtbfHours || "-"}</StyledTableCell>
              </StyledTableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
