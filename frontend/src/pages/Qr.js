import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react';
// import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Qr.css';

export const QR = () => {
 
    const [qr , setQr] = useState('');
    const [showQR, setShowQR] = useState(false)
 
const main = async () => {
  const response = await axios.get('https://deda-119-152-51-27.in.ngrok.io/api/sign-in', {
    headers: {
        "ngrok-skip-browser-warning": true
    }
  })
  console.log(response.data)
  setQr(response.data)
  setShowQR(true)
}
 
  return (
        <main className="main-content">
            { showQR === false ? ( <button onClick={main} className="btn-qr"> Sign Up </button>) : (<QRCodeSVG value={JSON.stringify(qr)}/>) 
        }     
        </main>
  )
}

