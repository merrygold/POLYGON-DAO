import React from 'react'
import { Outlet, Link } from "react-router-dom";
import polygonLogo from "./images/polygon-id.png";

function Navigation() {
  return (
    <div className="header">
    <Link to="/" ><img width="260px" src={polygonLogo} alt="logo" /></Link>
    <Link to="/qr-scan"><button className="connect-button">Connect Button</button></Link>
    <Outlet></Outlet>
    </div>
  )
}

export default Navigation