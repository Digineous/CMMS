import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Welcome from "../components/welcome";
import DeviceMaster from "../components/Administrative/DeviceMaster";
import LineMaster from "../components/Administrative/LineMaster";
import MachineMaster from "../components/Administrative/MachineMaster";
import PlantMaster from "../components/Administrative/Plantmaster";
import BreakDown from "../components/Administrative/BreakDown";
import ComplaintsPage from "../components/Complaints/complaints";
import MyComplaintsPage from "../components/Complaints/MyComplaints";
import PendingComplaintsPage from "../components/Complaints/PendingComplaints";
import AssginWorkOrderPage from "../components/WorkOrders/AssignWorkOrder";
import MyWorkOrderPage from "../components/WorkOrders/MyWorkOrder";
import InventoryMaster from "../components/Administrative/InventoryMaster";
import Profile from "../components/Profile";
import UserMaster from "../components/Administrative/userMaster";
import WorkOrderValidation from "../components/WorkOrders/WorkOrderValidation";

export default function MyRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="" element={<Login />} />
      <Route path="/welcome" element={<Welcome />} />

      <Route path="/administrative/plantmaster" element={<PlantMaster />} />
      <Route path="/administrative/linemaster" element={<LineMaster />} />
      <Route path="/administrative/machinemaster" element={<MachineMaster />} />
      <Route path="/administrative/devicemaster" element={<DeviceMaster />} />
      <Route path="/administrative/breakdownmaster" element={<BreakDown />} />
      <Route path="/administrative/inventorymaster" element={<InventoryMaster />} />
      <Route path="/complaint/all" element={<ComplaintsPage />} />
      <Route path="/complaint/my" element={<MyComplaintsPage />} />
      <Route path="/complaint/pending" element={<PendingComplaintsPage />} />
      <Route path="/workorder/assign" element={<AssginWorkOrderPage />} />
      <Route path="/workorder/my" element={<MyWorkOrderPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/administrative/usermaster" element={<UserMaster />} />
      <Route path="/complaint/validation" element={<WorkOrderValidation />} />
    </Routes>
  );
}
