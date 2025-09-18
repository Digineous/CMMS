import { faBars, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
  const [reportsOpen, SetReportsOpen] = useState(false);

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
      { path: "/complaint/all", label: "All Complaints", group: "complaints" },
      { path: "/complaint/my", label: "My Complaints", group: "complaints" },
      {
        path: "/complaint/pending",
        label: "Pending Complaints",
        group: "complaints",
      },
      {
        path: "/workorder/assign",
        label: "Assigned Work Order",
        group: "workorder",
      },
      { path: "/workorder/my", label: "My Work Order", group: "workorder" },
    ],

    3: [
      // operator
      { path: "/complaint/all", label: "All Complaints", group: "complaints" },
      { path: "/complaint/my", label: "My Complaints", group: "complaints" },
    ],

    2: [
      // operational_manager
      { path: "/complaint/all", label: "All Complaints", group: "complaints" },
      {
        path: "/complaint/pending",
        label: "Pending Complaints",
        group: "complaints",
      },
    ],

    4: [
      // maintenance_manager
      { path: "/complaint/all", label: "All Complaints", group: "complaints" },
      {
        path: "/workorder/assign",
        label: "Assigned Work Order",
        group: "workorder",
      },
    ],

    5: [
      // technician
      { path: "/complaint/all", label: "All Complaints", group: "complaints" },
      { path: "/workorder/my", label: "My Work Order", group: "workorder" },
    ],
  };

  const navigate = useNavigate();
  const [complaintsOpen, setComplaintsOpen] = useState(false);
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

          {/* Masters (always visible) */}
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
            <ListItemText primary="Masters" />
            {adminstrativeOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={adminstrativeOpen} timeout="auto" unmountOnExit>
            <List sx={{ pl: 2 }}>
              {[
                { path: "/administrative/plantmaster", label: "Plant Master" },
                { path: "/administrative/linemaster", label: "Line Master" },
                {
                  path: "/administrative/machinemaster",
                  label: "Machine Master",
                },
                {
                  path: "/administrative/devicemaster",
                  label: "Device Master",
                },
                {
                  path: "/administrative/breakdownmaster",
                  label: "Breakdown Master",
                },
                {
                  path: "/administrative/inventorymaster",
                  label: "Inventory Master",
                },
                {
                  path: "/administrative/usermaster",
                  label: "User Master",
                },
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
                  ? darken("#1faec5",
                      0.2)
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
