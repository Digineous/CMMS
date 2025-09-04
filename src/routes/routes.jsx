import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Welcome from "../components/welcome";

export default function MyRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="" element={<Login />} />
      <Route path="/welcome" element={<Welcome />} />
    </Routes>
  );
}
