import React from 'react'
import { QRCode } from 'react-qr-svg';
// import { useNavigate } from "react-router-dom";

export const QR = () => {
    // const navigate = useNavigate();
    //  navigate("/home")
    const styles = {
        root: {
          fontFamily: 'sans-serif',
        },
        h1: {
          textAlign: 'center',
        },
        qrcode: {
          textAlign: 'center',
        },
      };
      


  return (
    <div style={styles.root}>
    <h1 style={styles.h1}>QRCode with JSON</h1>
    <div style={styles.qrcode}>
      <QRCode
        level="Q"
        style={{ width: 256 }}
        value={JSON.stringify({
          id: 928328,
          name: 'Janesaa Doe',
          insider: true,
        })}
      />
    </div>
  </div>
  )
}

