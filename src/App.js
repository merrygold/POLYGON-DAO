import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Proposal from "./pages/Proposal";

import Navigation from "./Navigation";
import Home2 from "./pages/Home2";
import QR from "./pages/QrVerification";
const Moralis = require("moralis").default;


const App = () => {

  return (
    <>
   
      <Navigation></Navigation>
      <Routes>
        <Route path="/" element={<Home2 />} />
        <Route path="/proposal" element={<Proposal/>} />
        <Route path="/qr" element={<QR/>} />
      </Routes>
    </>
  );
};

export default App;
