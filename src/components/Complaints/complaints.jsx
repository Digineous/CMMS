import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Typography,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
  Tooltip,
} from "@mui/material";
import { apiGetAssignmentTechnician } from "../../api/Maintenance/api.getAssignmentTechnician";

// Styled table cells
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

export default function AssignmentCalendar() {
  const [events, setEvents] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Fetch assignments
  const fetchAssignments = async () => {
    try {
      const response = await apiGetAssignmentTechnician();
      if (response.data.statusCode === 200) {
        setCalendar(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    const mappedEvents = calendar.map((item) => {
      const today = new Date();
      const startDate = new Date(item.scheduledStart);
      const endDate = new Date(item.scheduledEnd);

      // Opacity colors
      let backgroundColor = "rgba(0, 128, 0, 0.3)"; // future green
      if (endDate < today) backgroundColor = "rgba(255, 0, 0, 0.3)"; // past red
      else if (startDate <= today && endDate >= today)
        backgroundColor = "rgba(255, 255, 0, 0.8)"; // today yellow

      return {
        id: item.assignmentNo,
        title: item.assignmentDescription,
        start: item.scheduledStart,
        end: item.scheduledEnd,
        backgroundColor,
        borderColor: backgroundColor,
        extendedProps: { ...item },
      };
    });
    setEvents(mappedEvents);
  }, [calendar]);

  // Custom event content with styled tooltip
  const renderEventContent = (eventInfo) => {
    const data = eventInfo.event.extendedProps;

    const tooltipContent = (
      <Box
        sx={{
          p: 1,
          bgcolor: "rgba(0,0,0,0.85)",
          color: "#fff",
          borderRadius: 1,
          fontSize: 12,
        }}
      >
        PlanNo: {data.planNo} <br />
        AssignedTo: {data.assignedTo} <br />
        AssignedBy: {data.assignedBy} <br />
        Process: {data.processDescription || "N/A"} <br />
        CreatedAt: {new Date(data.createdAt).toLocaleString()}
      </Box>
    );

    return (
      <Tooltip
        title={tooltipContent}
        arrow
        placement="top"
        componentsProps={{
          tooltip: { sx: { bgcolor: "transparent", boxShadow: "none" } },
        }}
      >
        <Box
          sx={{
            fontSize: "11px",
            lineHeight: "1.2em",
            backgroundColor: eventInfo.event.backgroundColor,
            padding: "2px 4px",
            borderRadius: "4px",
            fontWeight: "bold",
            textAlign: "center",
            color: "#000",
            cursor: "pointer",
          }}
        >
          {data.assignmentDescription} <br /> {data.status}
        </Box>
      </Tooltip>
    );
  };

  return (
    <div style={{ padding: "0px 20px" }}>
      {/* Gradient Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(to right, rgb(0, 93, 114), rgb(79, 223, 255))",
          padding: "5px",
          borderRadius: "8px",
          marginBottom: 2,
          marginTop: 1,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          color: "white",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>
          Assignment Dashboard
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={handleTabChange} sx={{ marginBottom: 2 }}>
        <Tab label="Calendar" />
        <Tab label="Table" />
      </Tabs>

      {/* Calendar Tab */}
      {tab === 0 && (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventContent={renderEventContent}
          height="80vh"
          eventDisplay="block"
        />
      )}

      {/* Table Tab */}
      {tab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Assignment No</StyledTableCell>
                <StyledTableCell>Plan No</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Assigned To</StyledTableCell>
                <StyledTableCell>Assigned By</StyledTableCell>
                <StyledTableCell>Scheduled Start</StyledTableCell>
                <StyledTableCell>Scheduled End</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calendar.map((item) => (
                <StyledTableRow key={item.assignmentNo}>
                  <StyledTableCell>{item.assignmentNo}</StyledTableCell>
                  <StyledTableCell>{item.planNo}</StyledTableCell>
                  <StyledTableCell>
                    {item.assignmentDescription}
                  </StyledTableCell>
                  <StyledTableCell>{item.status}</StyledTableCell>
                  <StyledTableCell>{item.assignedTo}</StyledTableCell>
                  <StyledTableCell>{item.assignedBy}</StyledTableCell>
                  <StyledTableCell>
                    {new Date(item.scheduledStart).toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell>
                    {new Date(item.scheduledEnd).toLocaleString()}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
