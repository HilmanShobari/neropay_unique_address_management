import React, { useEffect, useState } from 'react';
import { generateLoginQr } from './Axios';
import QRCode from 'qrcode.react'; // Library untuk generate QR code
import { useNavigate } from 'react-router-dom';
import './Home.css'; // File CSS untuk gaya tambahan

function Home() {
  const [qrData, setQrData] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // State untuk status loading
  const navigate = useNavigate();

  useEffect(() => {
    const merchantID = localStorage.getItem('merchantID');
    if (!merchantID) {
      navigate('/login');
      return;
    }

    const fetchQrData = async () => {
      setLoading(true); // Mengatur loading menjadi true saat mulai fetch data
      try {
        const response = await generateLoginQr(merchantID);
        const qrData = {
          merchantID: response.data.merchantID,
          token: response.data.token
        }
        setQrData(JSON.stringify(qrData)); // Sesuaikan dengan struktur response API Anda
      } catch (error) {
        setErrorMessage('Failed to generate QR code. Please try again later.');
      } finally {
        setLoading(false); // Mengatur loading kembali menjadi false setelah selesai fetch data
      }
    };

    fetchQrData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <h1>Welcome to Home Page</h1>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      {loading && <p>Loading...</p>} {/* Tampilkan pesan loading jika loading === true */}
      {errorMessage && <p className="error">{errorMessage}</p>}
      {qrData && <QRCode value={qrData} size={300} />}
    </div>
  );
}

export default Home;
