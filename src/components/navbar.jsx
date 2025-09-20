import { faBars, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Box, SwipeableDrawer } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { darken } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../assets/css/navbar.css";
import brandlogo from "../assets/images/logo.png";

function NavBar() {
  const location = useLocation();
  const [clicked, setClicked] = useState(false);
  const [hideMenu, setHideMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [plantArchitectureOpen, setPlantArchitectureOpen] = useState(false);

  const [UATOpen, setUATOpen] = useState(false);
  const [rawDataOpen, setRawDataOpen] = useState(false);
  const [productionOpen, setProductionOpen] = useState(false);
  const [adminstrativeOpen, setAdministrativeOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const [method2Open, setMethod2Open] = useState(false);
  const [method1Open, setMethod1Open] = useState(false);
  const [emsReportOpen, setEmsReportOpen] = useState(false);
  const [state, setState] = React.useState({
    right: false,
  });
  const roleId = localStorage.getItem("roleId");
  const roleMenus = {
    1: [
      // SuperAdmin
      // Complaints
      { path: "/complaint/all", label: "All Complaints", group: "complaints" },
      // Work Orders
      // {
      //   path: "/workorder/assign",
      //   label: "Assigned Work Order",
      //   group: "workorder",
      // },
      // { path: "/workorder/my", label: "My Work Order", group: "workorder" },
      // Masters
      {
        path: "/administrative/plantmaster",
        label: "Plant Master",
        group: "masters",
      },
      {
        path: "/administrative/linemaster",
        label: "Line Master",
        group: "masters",
      },
      {
        path: "/administrative/machinemaster",
        label: "Machine Master",
        group: "masters",
      },
      {
        path: "/administrative/devicemaster",
        label: "Device Master",
        group: "masters",
      },
      {
        path: "/administrative/breakdownmaster",
        label: "Breakdown Master",
        group: "masters",
      },
      {
        path: "/administrative/inventorymaster",
        label: "Inventory Master",
        group: "masters",
      },
      {
        path: "/administrative/usermaster",
        label: "User Master",
        group: "masters",
      },
      // Reports
      {
        path: "/reports/mttrmtbfdetails",
        label: "MTTR & MTBF By Machine",
        group: "reports",
      },
      {
        path: "/reports/mttrmtbfbymachine",
        label: "MTTR & MTBF Summary",
        group: "reports",
      },
      {
        path: "/reports/workorderhistory",
        label: "Work Order History",
        group: "reports",
      },
      {
        path: "/reports/complaintshistory",
        label: "Complaint History",
        group: "reports",
      },
    ],

    2: [
      // operational_manager
      // Complaints
      { path: "/complaint/all", label: "All Complaints", group: "complaints" },
      {
        path: "/complaint/pending",
        label: "Pending Complaints",
        group: "complaints",
      },
      {
        path: "/complaint/validation",
        label: "Work Order Validation",
        group: "complaints",
      },
      // Masters
      {
        path: "/administrative/plantmaster",
        label: "Plant Master",
        group: "masters",
      },
      {
        path: "/administrative/linemaster",
        label: "Line Master",
        group: "masters",
      },
      {
        path: "/administrative/machinemaster",
        label: "Machine Master",
        group: "masters",
      },
      {
        path: "/administrative/devicemaster",
        label: "Device Master",
        group: "masters",
      },
      {
        path: "/administrative/breakdownmaster",
        label: "Breakdown Master",
        group: "masters",
      },
      {
        path: "/administrative/inventorymaster",
        label: "Inventory Master",
        group: "masters",
      },
      {
        path: "/administrative/usermaster",
        label: "User Master",
        group: "masters",
      },
      // Reports
      {
        path: "/reports/mttrmtbfdetails",
        label: "MTTR & MTBF By Machine",
        group: "reports",
      },
      {
        path: "/reports/mttrmtbfbymachine",
        label: "MTTR & MTBF Summary",
        group: "reports",
      },
      {
        path: "/reports/workorderhistory",
        label: "Work Order History",
        group: "reports",
      },
      {
        path: "/reports/complaintshistory",
        label: "Complaint History",
        group: "reports",
      },
    ],

    3: [
      // operator
      // Complaints
      { path: "/complaint/all", label: "All Complaints", group: "complaints" },
      { path: "/complaint/my", label: "My Complaints", group: "complaints" },
      // Masters
      {
        path: "/administrative/plantmaster",
        label: "Plant Master",
        group: "masters",
      },
      {
        path: "/administrative/linemaster",
        label: "Line Master",
        group: "masters",
      },
      {
        path: "/administrative/machinemaster",
        label: "Machine Master",
        group: "masters",
      },
      {
        path: "/administrative/devicemaster",
        label: "Device Master",
        group: "masters",
      },
      {
        path: "/administrative/breakdownmaster",
        label: "Breakdown Master",
        group: "masters",
      },
      {
        path: "/administrative/inventorymaster",
        label: "Inventory Master",
        group: "masters",
      },
      {
        path: "/administrative/usermaster",
        label: "User Master",
        group: "masters",
      },
      // Reports
      {
        path: "/reports/mttrmtbfdetails",
        label: "MTTR & MTBF By Machine",
        group: "reports",
      },
      {
        path: "/reports/mttrmtbfbymachine",
        label: "MTTR & MTBF Summary",
        group: "reports",
      },
      {
        path: "/reports/workorderhistory",
        label: "Work Order History",
        group: "reports",
      },
      {
        path: "/reports/complaintshistory",
        label: "Complaint History",
        group: "reports",
      },
    ],

    4: [
      // maintenance_manager
      // Complaints
      { path: "/complaint/all", label: "All Complaints", group: "complaints" },
      // Work Orders
      {
        path: "/workorder/assign",
        label: "Assigned Work Order",
        group: "workorder",
      },
      // Maintenance
      {
        path: "/maintenance/calendar",
        label: "Assignment Calendar",
        group: "maintenance",
      },
      { path: "/maintenance/plan", label: "Plan List", group: "maintenance" },
      {
        path: "/maintenance/mainpoint",
        label: "Main Point",
        group: "maintenance",
      },
      {
        path: "/maintenance/checklist",
        label: "Check List",
        group: "maintenance",
      },
      // Masters
      {
        path: "/administrative/plantmaster",
        label: "Plant Master",
        group: "masters",
      },
      {
        path: "/administrative/linemaster",
        label: "Line Master",
        group: "masters",
      },
      {
        path: "/administrative/machinemaster",
        label: "Machine Master",
        group: "masters",
      },
      {
        path: "/administrative/devicemaster",
        label: "Device Master",
        group: "masters",
      },
      {
        path: "/administrative/breakdownmaster",
        label: "Breakdown Master",
        group: "masters",
      },
      {
        path: "/administrative/inventorymaster",
        label: "Inventory Master",
        group: "masters",
      },
      {
        path: "/administrative/usermaster",
        label: "User Master",
        group: "masters",
      },
      // Reports
      {
        path: "/reports/mttrmtbfdetails",
        label: "MTTR & MTBF By Machine",
        group: "reports",
      },
      {
        path: "/reports/mttrmtbfbymachine",
        label: "MTTR & MTBF Summary",
        group: "reports",
      },
      {
        path: "/reports/workorderhistory",
        label: "Work Order History",
        group: "reports",
      },
      {
        path: "/reports/complaintshistory",
        label: "Complaint History",
        group: "reports",
      },
    ],

    5: [
      // technician
      // Complaints
      // { path: "/complaint/all", label: "All Complaints", group: "complaints" },
      // Work Orders
      { path: "/workorder/my", label: "My Work Order", group: "workorder" },
      // Maintenance
      {
        path: "/maintenance/calendar",
        label: "Assignment Calendar",
        group: "maintenance",
      },
      // Masters
      // {
      //   path: "/administrative/plantmaster",
      //   label: "Plant Master",
      //   group: "masters",
      // },
      // {
      //   path: "/administrative/linemaster",
      //   label: "Line Master",
      //   group: "masters",
      // },
      // {
      //   path: "/administrative/machinemaster",
      //   label: "Machine Master",
      //   group: "masters",
      // },
      // {
      //   path: "/administrative/devicemaster",
      //   label: "Device Master",
      //   group: "masters",
      // },
      // {
      //   path: "/administrative/breakdownmaster",
      //   label: "Breakdown Master",
      //   group: "masters",
      // },
      // {
      //   path: "/administrative/inventorymaster",
      //   label: "Inventory Master",
      //   group: "masters",
      // },
      // {
      //   path: "/administrative/usermaster",
      //   label: "User Master",
      //   group: "masters",
      // },
      // // Reports
      // {
      //   path: "/reports/mttrmtbfdetails",
      //   label: "MTTR & MTBF By Machine",
      //   group: "reports",
      // },
      // {
      //   path: "/reports/mttrmtbfbymachine",
      //   label: "MTTR & MTBF Summary",
      //   group: "reports",
      // },
      // {
      //   path: "/reports/workorderhistory",
      //   label: "Work Order History",
      //   group: "reports",
      // },
      // {
      //   path: "/reports/complaintshistory",
      //   label: "Complaint History",
      //   group: "reports",
      // },
    ],
  };

  const navigate = useNavigate();
  const [complaintsOpen, setComplaintsOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [woOpen, setWoOpen] = useState(false);

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");
    console.log("Role ID:", roleId);
  }, []);

  const handleAdministrativeClick = () => {
    setAdministrativeOpen(!adminstrativeOpen);
    setUATOpen(false);
    setMethod2Open(false);
    setProductionOpen(false);
    setRawDataOpen(false);
    setPlantArchitectureOpen(false);
    setEmsReportOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

const handleLogout = () => {
  localStorage.clear();
  navigate("/login");
};

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ right: open });
  };

  const renderSideBarMES = () => {
    return (
      <SwipeableDrawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box
          sx={{
            width: 300,
            backgroundColor: "primary.main",
            height: "100%",
            padding: 2,
            overflowY: "auto",
          }}
        >
          {/* Home */}
          <ListItem
            button
            component={Link}
            to="/welcome"
            onClick={toggleDrawer(false)}
            sx={{
              cursor: "pointer",
              marginBottom: "20px",
              bgcolor:
                location.pathname === "/welcome"
                  ? darken("#1faec5", 0.2)
                  : "background.paper",
              borderRadius: 2,
              padding: 1.5,
            }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          {/* Complaints*/}
          {roleMenus[roleId]?.some((m) => m.group === "complaints") && (
            <>
              <ListItem
                button
                onClick={() => setComplaintsOpen(!complaintsOpen)}
                sx={{
                  cursor: "pointer",
                  marginBottom: "20px",
                  bgcolor: location.pathname.startsWith("/complaint")
                    ? darken("#1faec5", 0.2)
                    : "background.paper",
                  borderRadius: 2,
                  padding: 1.5,
                }}
              >
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Complaints" />
                {complaintsOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={complaintsOpen} timeout="auto" unmountOnExit>
                <List sx={{ pl: 2 }}>
                  {roleMenus[roleId]
                    .filter((m) => m.group === "complaints")
                    .map((item) => (
                      <ListItem
                        key={item.path}
                        button
                        component={Link}
                        to={item.path}
                        sx={{
                          cursor: "pointer",
                          marginBottom: "15px",
                          bgcolor:
                            location.pathname === item.path
                              ? darken("#1faec5", 0.2)
                              : "background.paper",
                          borderRadius: 2,
                          padding: 1.2,
                        }}
                      >
                        <ListItemText primary={item.label} />
                      </ListItem>
                    ))}
                </List>
              </Collapse>
            </>
          )}

          {/* Work Order (role-based) */}
          {roleMenus[roleId]?.some((m) => m.group === "workorder") && (
            <>
              <ListItem
                button
                onClick={() => setWoOpen(!woOpen)}
                sx={{
                  cursor: "pointer",
                  marginBottom: "20px",
                  bgcolor: location.pathname.startsWith("/workorder")
                    ? darken("#1faec5", 0.2)
                    : "background.paper",
                  borderRadius: 2,
                  padding: 1.5,
                }}
              >
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Work Order" />
                {woOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={woOpen} timeout="auto" unmountOnExit>
                <List sx={{ pl: 2 }}>
                  {roleMenus[roleId]
                    .filter((m) => m.group === "workorder")
                    .map((item) => (
                      <ListItem
                        key={item.path}
                        button
                        component={Link}
                        to={item.path}
                        sx={{
                          cursor: "pointer",
                          marginBottom: "15px",
                          bgcolor:
                            location.pathname === item.path
                              ? darken("#1faec5", 0.2)
                              : "background.paper",
                          borderRadius: 2,
                          padding: 1.2,
                        }}
                      >
                        <ListItemText primary={item.label} />
                      </ListItem>
                    ))}
                </List>
              </Collapse>
            </>
          )}
          {roleMenus[roleId]?.some((m) => m.group === "maintenance") && (
            <>
              <ListItem
                button
                onClick={() => setMaintenanceOpen(!maintenanceOpen)}
                sx={{
                  cursor: "pointer",
                  marginBottom: "20px",
                  bgcolor: location.pathname.startsWith("/maintenance")
                    ? darken("#1faec5", 0.2)
                    : "background.paper",
                  borderRadius: 2,
                  padding: 1.5,
                }}
              >
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Maintenance" />
                {maintenanceOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={maintenanceOpen} timeout="auto" unmountOnExit>
                <List sx={{ pl: 2 }}>
                  {roleMenus[roleId]
                    .filter((m) => m.group === "maintenance")
                    .map((item) => (
                      <ListItem
                        key={item.path}
                        button
                        component={Link}
                        to={item.path}
                        sx={{
                          cursor: "pointer",
                          marginBottom: "15px",
                          bgcolor:
                            location.pathname === item.path
                              ? darken("#1faec5", 0.2)
                              : "background.paper",
                          borderRadius: 2,
                          padding: 1.2,
                        }}
                      >
                        <ListItemText primary={item.label} />
                      </ListItem>
                    ))}
                </List>
              </Collapse>
            </>
          )}


          {/* Reports (role-based) */}
          {roleMenus[roleId]?.some((m) => m.group === "reports") && (
            <>
              <ListItem
                button
                onClick={() => setReportsOpen(!reportsOpen)}
                sx={{
                  cursor: "pointer",
                  marginBottom: "20px",
                  bgcolor: location.pathname.startsWith("/reports")
                    ? darken("#1faec5", 0.2)
                    : "background.paper",
                  borderRadius: 2,
                  padding: 1.5,
                }}
              >
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
                {reportsOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
                <List sx={{ pl: 2 }}>
                  {roleMenus[roleId]
                    .filter((m) => m.group === "reports")
                    .map((item) => (
                      <ListItem
                        key={item.path}
                        button
                        component={Link}
                        to={item.path}
                        sx={{
                          cursor: "pointer",
                          marginBottom: "15px",
                          bgcolor:
                            location.pathname === item.path
                              ? darken("#1faec5", 0.2)
                              : "background.paper",
                          borderRadius: 2,
                          padding: 1.2,
                        }}
                      >
                        <ListItemText primary={item.label} />
                      </ListItem>
                    ))}
                </List>
              </Collapse>
            </>
          )}

          {roleMenus[roleId]?.some((m) => m.group === "masters") && (
            <>
              <ListItem
                button
                onClick={() => setAdministrativeOpen(!adminstrativeOpen)}
                sx={{
                  cursor: "pointer",
                  marginBottom: "20px",
                  bgcolor: location.pathname.startsWith("/administrative")
                    ? darken("#1faec5", 0.2)
                    : "background.paper",
                  borderRadius: 2,
                  padding: 1.5,
                }}
              >
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Masters" />
                {adminstrativeOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={adminstrativeOpen} timeout="auto" unmountOnExit>
                <List sx={{ pl: 2 }}>
                  {roleMenus[roleId]
                    .filter((m) => m.group === "masters")
                    .map((item) => (
                      <ListItem
                        key={item.path}
                        button
                        component={Link}
                        to={item.path}
                        sx={{
                          cursor: "pointer",
                          marginBottom: "15px",
                          bgcolor:
                            location.pathname === item.path
                              ? darken("#1faec5", 0.2)
                              : "background.paper",
                          borderRadius: 2,
                          padding: 1.2,
                        }}
                      >
                        <ListItemText primary={item.label} />
                      </ListItem>
                    ))}
                </List>
              </Collapse>
            </>
          )}

          <ListItem
            button
            component={Link}
            to="/profile"
            onClick={toggleDrawer(false)}
            sx={{
              cursor: "pointer",
              marginBottom: "20px",
              bgcolor:
                location.pathname === "/profile"
                  ? darken("#1faec5", 0.2)
                  : "background.paper",
              borderRadius: 2,
              padding: 1.5,
            }}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>

          {/* Logout */}
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              cursor: "pointer",
              marginBottom: "20px",
              bgcolor: "background.paper",
              borderRadius: 2,
              padding: 1.5,
            }}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faSignOut} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </Box>
      </SwipeableDrawer>
    );
  };

  return (
    <nav>
      <div>
        <Link className="clogo" to="/welcome">
          <img
            src={brandlogo}
            style={{ height: "45px", width: "140px", objectFit: "contain" }}
            alt="logo"
          />
        </Link>
      </div>
      <div className="seticon">
        <FontAwesomeIcon
          style={{ fontSize: "25px", padding: "0px 40px", cursor: "pointer" }}
          icon={faBars}
          onClick={toggleDrawer(true)}
        />
        {renderSideBarMES()}
      </div>
    </nav>
  );
}

export default NavBar;
