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
import AssignmentCalendar from "../components/Maintenance/AssignmentCalendar";
import PlanList from "../components/Maintenance/PlanList";
import MainPointPage from "../components/Maintenance/MainPoint";

import CheckList from "../components/Maintenance/CheckList";
import MttrMtbfReportByMachine from "../components/Reports/MttrMtbfByMachine";
import MTTRMTBFSummaryReport from "../components/Reports/mttrmtdfDetails";


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


      <Route path="/maintenance/calendar" element={<AssignmentCalendar />} />
      <Route path="/maintenance/plan" element={<PlanList />} />
      <Route path="/maintenance/mainpoint" element={<MainPointPage />} />
      <Route path="/maintenance/checklist" element={<CheckList />} />
      <Route path="/reports/mttrmtbfdetails" element={<MttrMtbfReportByMachine />} />
      <Route path="/reports/mttrmtbfbymachine" element={<MTTRMTBFSummaryReport />} />
    </Routes>
  );
}
