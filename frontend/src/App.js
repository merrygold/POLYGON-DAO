import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Proposal from "./pages/Proposal";
import polygonLogo from "./images/polygon-id.png";
import { QR } from "./pages/Qr";
import { Outlet, Link } from "react-router-dom";


const App = () => {
  return (
    <>
      <div className="header">
      <a onClick={() => {window.location.href="/"}}><img width="260px" src={polygonLogo} alt="logo" /></a>
      <a onClick={() => {window.location.href="/qr-scan"}}><button className="connect-button">Connect Button</button></a>
      </div>
     
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