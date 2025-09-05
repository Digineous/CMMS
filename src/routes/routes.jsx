import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Welcome from "../components/welcome";
import DeviceMaster from "../components/Administrative/DeviceMaster";
import LineMaster from "../components/Administrative/LineMaster";
import MachineMaster from "../components/Administrative/MachineMaster";
import PlantMaster from "../components/Administrative/Plantmaster";



export default function MyRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="" element={<Login />} />
      <Route path="/welcome" element={<Welcome />} />


   
<Route path="/administrative/plantmaster" element={<PlantMaster/>}/>
<Route path="/administrative/linemaster" element={<LineMaster/>}/>
<Route path="/administrative/machinemaster" element={<MachineMaster/>}/>
<Route path="/administrative/devicemaster" element={<DeviceMaster/>}/>

     
   
  

    </Routes>
  );
}
