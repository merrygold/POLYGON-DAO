import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Proposal from "./pages/Proposal";

import { QR } from "./pages/Qr";
import { Outlet, Link } from "react-router-dom";
import Navigation from "./Navigation";


const App = () => {
  return (
    <>
   
      <Navigation></Navigation>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/qr-scan" element={<QR/>} />
        <Route path="/proposal" element={<Proposal/>} />
      </Routes>
      <Outlet />
    </>
  );
};

export default App;