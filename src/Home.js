import React, { useEffect, useState } from 'react';
import { generateLoginQr } from './Axios';
import QRCode from 'qrcode.react'; // Library untuk generate QR code

function Home() {
  const [qrData, setQrData] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const merchantID = localStorage.getItem('merchantID');
    const fetchQrData = async () => {
      try {
        const response = await generateLoginQr(merchantID);
        setQrData(response.qrCodeData); // Sesuaikan dengan struktur response API Anda
      } catch (error) {
        setErrorMessage('Failed to generate QR code. Please try again later.');
      }
    };

    fetchQrData();
  }, []);

  return (
    <div>
      <h1>Welcome to Home Page</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {qrData && <QRCode value={qrData} />}
    </div>
  );
}

export default Home;
