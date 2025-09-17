import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../assets/css/navbar.css";
import {
  faBars,
  faClose,
  faAngleDown,
  faAngleUp,
  faGear,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import { Button, SwipeableDrawer, Box } from "@mui/material";
import brandlogo from "../assets/images/logo.png";
import "../assets/css/navbar.css";
import { darken } from "@mui/material/styles";

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
  const [reportsOpen, SetReportsOpen] = useState(false);

  const [method2Open, setMethod2Open] = useState(false);
  const [method1Open, setMethod1Open] = useState(false);
  const [emsReportOpen, setEmsReportOpen] = useState(false);
  const [state, setState] = React.useState({
    right: false,
  });
  const role = "operator"; // default fallback
  const allowedMenus = roleMenus[role] || [];
  const roleMenus = {
    operator: [
      { path: "/complaint/all", label: "All Complaints", group: "complaints" },
      { path: "/complaint/my", label: "My Complaints", group: "complaints" },
    ],

    operational_manager: [
      { path: "/complaint/all", label: "All Complaints", group: "complaints" },
      { path: "/complaint/pending", label: "Pending Complaints", group: "complaints" },
    ],

    maintenance_manager: [
      { path: "/complaint/all", label: "All Complaints", group: "complaints" },
      { path: "/workorder/assign", label: "Assigned Work Order", group: "workorder" },
    ],

    technician: [
      { path: "/complaint/all", label: "All Complaints", group: "complaints" },
      { path: "/workorder/my", label: "My Work Order", group: "workorder" },
    ],

    super_admin: [
      { path: "/complaint/all", label: "All Complaints", group: "complaints" },
      { path: "/complaint/my", label: "My Complaints", group: "complaints" },
      { path: "/complaint/pending", label: "Pending Complaints", group: "complaints" },
      { path: "/workorder/assign", label: "Assigned Work Order", group: "workorder" },
      { path: "/workorder/my", label: "My Work Order", group: "workorder" },
      // plus all other admin menus you already have
    ],
  };

  const navigate = useNavigate();
  const [complaintsOpen, setComplaintsOpen] = useState(false);
  const [woOpen, setWoOpen] = useState(false);
  const handleProductionClick = () => {
    setUATOpen(false);
    setMethod2Open(false);
    setMethod1Open(false);
    setProductionOpen(false);
    setRawDataOpen(false);
    setProductionOpen(!productionOpen);
    setEmsReportOpen(false);
  };

  const handleMethod1CLick = () => {
    setMethod1Open(!method1Open);
    setUATOpen(false);
    setMethod2Open(false);
    setProductionOpen(false);
    setRawDataOpen(false);
    setPlantArchitectureOpen(false);
    setEmsReportOpen(false);
  };

  const handleReportCLick = () => {
    SetReportsOpen(!reportsOpen);
    setUATOpen(false);
    setMethod2Open(false);
    setProductionOpen(false);
    setRawDataOpen(false);
    setPlantArchitectureOpen(false);
    setEmsReportOpen(false);
  };

  const handleAdministrativeClick = () => {
    setAdministrativeOpen(!adminstrativeOpen);
    setUATOpen(false);
    setMethod2Open(false);
    setProductionOpen(false);
    setRawDataOpen(false);
    setPlantArchitectureOpen(false);
    setEmsReportOpen(false);
  };

  const handleEMSReportClick = () => {
    setAdministrativeOpen(false);
    setUATOpen(false);
    setMethod2Open(false);
    setProductionOpen(false);
    setRawDataOpen(false);
    setPlantArchitectureOpen(false);
    setEmsReportOpen(!emsReportOpen);
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
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userID");
    localStorage.removeItem("tokenExpiredAt");

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
              <ListItem
                button
                component={Link}
                to="/complaint/all"
                sx={{
                  cursor: "pointer",
                  marginBottom: "15px",
                  bgcolor:
                    location.pathname === "/complaint/all"
                      ? darken("#1faec5", 0.2)
                      : "background.paper",
                  borderRadius: 2,
                  padding: 1.2,
                }}
              >
                <ListItemText primary="All Complaints" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/complaint/my"
                sx={{
                  cursor: "pointer",
                  marginBottom: "15px",
                  bgcolor:
                    location.pathname === "/complaint/my"
                      ? darken("#1faec5", 0.2)
                      : "background.paper",
                  borderRadius: 2,
                  padding: 1.2,
                }}
              >
                <ListItemText primary="My Complaints" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/complaint/pending"
                sx={{
                  cursor: "pointer",
                  marginBottom: "15px",
                  bgcolor:
                    location.pathname === "/complaint/pending"
                      ? darken("#1faec5", 0.2)
                      : "background.paper",
                  borderRadius: 2,
                  padding: 1.2,
                }}
              >
                <ListItemText primary="Pending Complaints" />
              </ListItem>
            </List>
          </Collapse>

          {/* Work Order*/}
          <ListItem
            button
            onClick={() => setWoOpen(!woOpen)}
            sx={{
              cursor: "pointer",
              marginBottom: "20px",
              bgcolor: location.pathname.startsWith("/workOrder")
                ? darken("#1faec5", 0.2)
                : "background.paper",
              borderRadius: 2,
              padding: 1.5,
            }}
          >
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="WorkOrder" />
            {woOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={woOpen} timeout="auto" unmountOnExit>
            <List sx={{ pl: 2 }}>
              <ListItem
                button
                component={Link}
                to="/workorder/assign"
                sx={{
                  cursor: "pointer",
                  marginBottom: "15px",
                  bgcolor:
                    location.pathname === "/workorder/assign"
                      ? darken("#1faec5", 0.2)
                      : "background.paper",
                  borderRadius: 2,
                  padding: 1.2,
                }}
              >
                <ListItemText primary="Assign Work Order" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/workorder/my"
                sx={{
                  cursor: "pointer",
                  marginBottom: "15px",
                  bgcolor:
                    location.pathname === "/workorder/my"
                      ? darken("#1faec5", 0.2)
                      : "background.paper",
                  borderRadius: 2,
                  padding: 1.2,
                }}
              >
                <ListItemText primary="My Work Order" />
              </ListItem>


            </List>
          </Collapse>

          {/* Administrative */}
          <ListItem
            button
            onClick={handleAdministrativeClick}
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
            <ListItemText primary="Administrative" />
            {adminstrativeOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={adminstrativeOpen} timeout="auto" unmountOnExit>
            <List sx={{ pl: 2 }}>
              {[
                { path: "/administrative/plantmaster", label: "Plant Master" },
                { path: "/administrative/linemaster", label: "Line Master" },
                { path: "/administrative/machinemaster", label: "Machine Master", },
                { path: "/administrative/devicemaster", label: "Device Master", },
                { path: "/administrative/breakdown", label: "Breakdown Master", },
                { path: "/administrative/inventory", label: "Inventory Master", },
              ].map((item) => (
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
