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
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { Button, SwipeableDrawer } from "@mui/material";
import brandlogo from "../assets/images/logo.png";
import "../assets/css/navbar.css";

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
  const navigate = useNavigate();
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

  const renderTopBarMES = () => {
    return (
      <div className="mylinks">
        <ul id="navbar" className={clicked ? "active" : ""}>
          <li>
            {" "}
            <Link
              to="/standarddashboard/oee"
              className={
                location.pathname === "/standarddashboard/oee" ||
                location.pathname === "/machinestatus" ||
                location.pathname === "/cockpitview"
                  ? "active"
                  : ""
              }
            >
              OEE
            </Link>
          </li>
          <li>
            {" "}
            <Link
              to="/standarddashboard/cbm"
              className={
                location.pathname === "/standarddashboard/cbm" ||
                location.pathname === "/iconicdashboard"
                  ? "active"
                  : ""
              }
            >
              CBM
            </Link>
          </li>
          <li>
            {" "}
            <Link
              to="/standarddashboard/ems2/plant"
              className={
                location.pathname === "/standarddashboard/ems2/plant" ||
                location.pathname === "/standarddashboard/ems2"
                  ? "active"
                  : ""
              }
            >
              EMS
            </Link>
          </li>
          <li>
            {" "}
            <Link
              to="/dmta/home"
              className={
                location.pathname === "/dmta/home" ||
                location.pathname === "/dmta/invoicematching" ||
                location.pathname === "/dmta/kyccapture" ||
                location.pathname === "/dmta/cvextraction" ||
                location.pathname === "/dmta/ebillinsight"
                  ? "active"
                  : ""
              }
            >
              SDM
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const renderTopBarSmart = () => {
    return <></>;
  };

  const renderSideBarMES = () => {
    return (
      <SwipeableDrawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <div className={`sidebar ${toggleDrawer(true) ? "open" : ""}`}>
          <List
            style={{
              flex: 1,
              overflowY: "auto",
              paddingBottom: "80px",
            }}
          >
            <ListItem
              Button
              onClick={toggleDrawer(false)}
              component={Link}
              to="/welcome"
              className={
                location.pathname === "/prewolcome" ? "activeListItem" : ""
              }
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home " />
            </ListItem>
            <ListItem
              Button
              onClick={toggleDrawer(false)}
              component={Link}
              to="/threshold"
              className={
                location.pathname === "/threshold" ? "activeListItem" : ""
              }
            >
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary=" Threshold  " />
            </ListItem>
            <ListItem
              style={{ cursor: "pointer" }}
              Button
              onClick={handleEMSReportClick}
            >
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="EMS Report" />

              {emsReportOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={emsReportOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  Button
                  onClick={toggleDrawer(false)}
                  component={Link}
                  to="/rawdata"
                  className={
                    location.pathname === "/rawdata" ? "activeListItem" : ""
                  }
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Raw Data " />
                </ListItem>
                <ListItem
                  Button
                  onClick={toggleDrawer(false)}
                  component={Link}
                  to="/emshourlyenergy"
                  className={
                    location.pathname === "/emshourlyenergy"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Hourly" />
                </ListItem>
                <ListItem
                  Button
                  onClick={toggleDrawer(false)}
                  component={Link}
                  to="/dailyviewreport"
                  className={
                    location.pathname === "/dailyviewreport"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Daily" />
                </ListItem>
                <ListItem
                  Button
                  onClick={toggleDrawer(false)}
                  component={Link}
                  to="/areawisereport"
                  className={
                    location.pathname === "/areawisereport"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Area Wise Daily " />
                </ListItem>
                <ListItem
                  Button
                  onClick={toggleDrawer(false)}
                  component={Link}
                  to="/combinereport"
                  className={
                    location.pathname === "/combinereport"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Combined Machine " />
                </ListItem>
                <ListItem
                  Button
                  onClick={toggleDrawer(false)}
                  component={Link}
                  to="/feederwisereport"
                  className={
                    location.pathname === "/feederwisereport"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Feeder Report " />
                </ListItem>
              </List>
            </Collapse>
            <ListItem
              style={{ cursor: "pointer" }}
              Button
              onClick={handleMethod1CLick}
            >
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Method" />

              {method1Open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={method1Open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  Button
                  component={Link}
                  to="/method/ope"
                  className={
                    location.pathname === "/method/ope" ? "activeListItem" : ""
                  }
                >
                  <ListItemText primary="OPE" />
                </ListItem>
                <ListItem
                  Button
                  component={Link}
                  to="/production/machineInput"
                  className={
                    location.pathname === "/production/machineInput"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemText primary="Machine Input" />
                </ListItem>

                <ListItem
                  style={{ cursor: "pointer" }}
                  Button
                  onClick={handleReportCLick}
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reports" />

                  {reportsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem
                      Button
                      component={Link}
                      to="/reports/hourly"
                      className={
                        location.pathname === "/reports/hourly"
                          ? "activeListItem"
                          : ""
                      }
                    >
                      <ListItemText primary="Hour Bucket" />
                    </ListItem>
                    <ListItem
                      Button
                      component={Link}
                      to="/reports/daily"
                      className={
                        location.pathname === "/reports/daily"
                          ? "activeListItem"
                          : ""
                      }
                    >
                      <ListItemText primary="Daily " />
                    </ListItem>
                    <ListItem
                      Button
                      component={Link}
                      to="/reports/weekly"
                      className={
                        location.pathname === "/reports/weekly"
                          ? "activeListItem"
                          : ""
                      }
                    >
                      <ListItemText primary="Weekly" />
                    </ListItem>
                    <ListItem
                      Button
                      component={Link}
                      to="/reports/monthly"
                      className={
                        location.pathname === "/reports/monthly"
                          ? "activeListItem"
                          : ""
                      }
                    >
                      <ListItemText primary="Monthly" />
                    </ListItem>
                    <ListItem
                      Button
                      component={Link}
                      to="/reports/quaterly"
                      className={
                        location.pathname === "/reports/quaterly"
                          ? "activeListItem"
                          : ""
                      }
                    >
                      <ListItemText primary="Quaterly" />
                    </ListItem>
                    <ListItem
                      Button
                      component={Link}
                      to="/reports/yearly"
                      className={
                        location.pathname === "/reports/yearly"
                          ? "activeListItem"
                          : ""
                      }
                    >
                      <ListItemText primary="Yearly" />
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            </Collapse>

            <ListItem
              style={{ cursor: "pointer" }}
              Button
              onClick={handleProductionClick}
            >
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Production Master" />

              {productionOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={productionOpen}
              timeout="auto"
              unmountOnExit
              style={{
                padding: "0 10px",
                margin: "0 10px",
              }}
            >
              <List component="div" disablePadding>
                <ListItem
                  Button
                  component={Link}
                  to="/production/partmaster"
                  className={
                    location.pathname === "/production/partmaster"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemText primary="Part Master" />
                </ListItem>

                <ListItem
                  Button
                  component={Link}
                  to="/production/downtime/DtEntry"
                  className={
                    location.pathname === "/production/downtime/DtEntry"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemText primary="Down Time Entry" />
                </ListItem>

                <ListItem
                  Button
                  component={Link}
                  to="/production/defective/entry"
                  className={
                    location.pathname === "/production/defective/entry"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemText primary="Defective Part Entry" />
                </ListItem>

                <ListItem
                  Button
                  component={Link}
                  to="/production/changeom"
                  className={
                    location.pathname === "/production/changeom"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemText primary="Change Over Master" />
                </ListItem>
                <ListItem
                  Button
                  component={Link}
                  to="/production/unknownloss"
                  className={
                    location.pathname === "/production/unknownloss"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemText primary="Unkown Loss" />
                </ListItem>
                <ListItem
                  Button
                  component={Link}
                  to="/production/qualityrejection"
                  className={
                    location.pathname === "/production/qualityrejection"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemText primary="Quality Rejection" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem
              style={{ cursor: "pointer" }}
              Button
              onClick={handleAdministrativeClick}
            >
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Administrative" />

              {adminstrativeOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={adminstrativeOpen}
              timeout="auto"
              unmountOnExit
              style={{
                padding: "0 10px",
                margin: "0 10px",
              }}
            >
              <List component="div" disablePadding>
                <ListItem
                  Button
                  component={Link}
                  to="/administrative/plantmaster"
                  className={
                    location.pathname === "/administrative/plantmaster"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemText primary="Plant Master" />
                </ListItem>
                <ListItem
                  Button
                  component={Link}
                  to="/administrative/linemaster"
                  className={
                    location.pathname === "/administrative/linemaster"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemText primary="Line Master" />
                </ListItem>
                <ListItem
                  Button
                  component={Link}
                  to="/administrative/machinemaster"
                  className={
                    location.pathname === "/administrative/machinemaster"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemText primary="Machine Master" />
                </ListItem>
                <ListItem
                  Button
                  component={Link}
                  to="/administrative/devicemaster"
                  className={
                    location.pathname === "/administrative/devicemaster"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemText primary="Device Master" />
                </ListItem>
                <ListItem
                  Button
                  component={Link}
                  to="/administrative/devicestatus"
                  className={
                    location.pathname === "/administrative/devicestatus"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemText primary="Device Status" />
                </ListItem>
                <ListItem
                  Button
                  component={Link}
                  to="/administrative/shiftmaster"
                  className={
                    location.pathname === "/administrative/shiftmaster"
                      ? "activeListItem"
                      : ""
                  }
                >
                  <ListItemText primary="Shift Master" />
                </ListItem>
              </List>
            </Collapse>

            <ListItem
              onClick={handleLogout}
              Button
              className={
                location.pathname === "/logout" ? "activeListItem" : ""
              }
              style={{ cursor: "pointer", marginBottom: "30px" }}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={faSignOut} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </div>
      </SwipeableDrawer>
    );
  };

  const renderSideBarSmart = () => {
    return (
      <SwipeableDrawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <div className={`sidebar ${toggleDrawer(true) ? "open" : ""}`}>
          <List>
            <ListItem
              onClick={toggleDrawer(false)}
              Button
              component={Link}
              to="/prewelcome"
              className={
                location.pathname === "/prewelcome" ? "activeListItem" : ""
              }
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem
              onClick={toggleDrawer(false)}
              Button
              component={Link}
              to="/dmta/home"
              className={
                location.pathname === "/dmta/home" ? "activeListItem" : ""
              }
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="SDM Main Page" />
            </ListItem>
            <ListItem
              onClick={toggleDrawer(false)}
              Button
              component={Link}
              to="/dmta/kyccapture"
              className={
                location.pathname === "/dmta/kyccapture" ? "activeListItem" : ""
              }
            >
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary="KYC Capture" />
            </ListItem>{" "}
            <ListItem
              onClick={toggleDrawer(false)}
              Button
              component={Link}
              to="/dmta/invoicematching"
              className={
                location.pathname === "/dmta/invoicematching"
                  ? "activeListItem"
                  : ""
              }
            >
              <ListItemIcon>
                <AssignmentTurnedInIcon />
              </ListItemIcon>
              <ListItemText primary="Invoice Matching" />
            </ListItem>{" "}
            <ListItem
              onClick={toggleDrawer(false)}
              Button
              component={Link}
              to="/dmta/ebillinsight"
              className={
                location.pathname === "/dmta/ebillinsight"
                  ? "activeListItem"
                  : ""
              }
            >
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary="Electricity Bill Insights" />
            </ListItem>{" "}
            <ListItem
              onClick={toggleDrawer(false)}
              Button
              component={Link}
              to="/dmta/cvextraction"
              className={
                location.pathname === "/dmta/cvextraction"
                  ? "activeListItem"
                  : ""
              }
            >
              <ListItemIcon>
                <PersonSearchIcon />
              </ListItemIcon>
              <ListItemText primary="Application Tracking System" />
            </ListItem>
            <ListItem
              onClick={handleLogout}
              Button
              className={
                location.pathname === "/logout" ? "activeListItem" : ""
              }
              style={{ cursor: "pointer", marginBottom: "30px" }}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={faSignOut} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </div>
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
      {renderTopBarMES()}
      <div className="seticon">
        <FontAwesomeIcon
          style={{ fontSize: "25px", padding: "0px 40px", cursor: "pointer" }}
          icon={faBars}
          // onClick={toggleSidebar}
          onClick={toggleDrawer(true)}
        />
        {renderSideBarMES()}
      </div>
    </nav>
  );
}

export default NavBar;
