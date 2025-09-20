import React, { useState } from "react";
import {
  Box,
  TextField,
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
  TablePagination,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { apiGetMTTRMTBFDetails } from "../../api/Reports/api.getmttrdetails";

// Dummy data
const dummyData = [
  {
    machineNo: 1,
    repairsCount: "3",
    mttrHours: "6.34",
    mtbfHours: "0.05",
    mttrInterval: "06:20:19",
    mtbfInterval: "00:02:53",
    date: "2025-09-15",
  },
  {
    machineNo: 7,
    repairsCount: "3",
    mttrHours: "1.52",
    mtbfHours: "-0.62",
    mttrInterval: "01:30:58",
    mtbfInterval: "00:-37:-14",
    date: "2025-09-17",
  },
  {
    machineNo: 1,
    repairsCount: "2",
    mttrHours: "5.12",
    mtbfHours: "0.10",
    mttrInterval: "05:07:30",
    mtbfInterval: "00:06:00",
    date: "2025-09-18",
  },
];

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

export default function MTTRMTBFSummaryReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleFetch = async () => {
    const body = {
      fromDate: fromDate || null,
      toDate: toDate || null,
    };
    try {
      const response = await apiGetMTTRMTBFDetails(body);
      if (response?.data.statusCode === 200) {
        setFilteredData(response.data.data || []);
        setSnackbar({
          open: true,
          message: "Data fetched successfully!",
          severity: "success",
        });
        setPage(0); // Reset to first page on new data
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (error) {
      console.error("Error Fetching MTTR/MTBF Report Details :", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch data!",
        severity: "error",
      });
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
          MTTR & MTBF Report By Machine
        </Typography>
      </div>

      {/* Filters */}
      <Box display="flex" gap={2} mb={2} alignItems="center">
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
              <StyledTableCell>Machine No</StyledTableCell>
              <StyledTableCell>Repairs Count</StyledTableCell>
              <StyledTableCell>MTTR Hours</StyledTableCell>
              <StyledTableCell>MTBF Hours</StyledTableCell>
              <StyledTableCell>MTTR Interval</StyledTableCell>
              <StyledTableCell>MTBF Interval</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredData
            ).map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{row.machineNo}</StyledTableCell>
                <StyledTableCell>{row.repairsCount}</StyledTableCell>
                <StyledTableCell>{row.mttrHours}</StyledTableCell>
                <StyledTableCell>{row.mtbfHours}</StyledTableCell>
                <StyledTableCell>{row.mttrInterval}</StyledTableCell>
                <StyledTableCell>{row.mtbfInterval}</StyledTableCell>
              </StyledTableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No records found. Click OK to filter.
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
