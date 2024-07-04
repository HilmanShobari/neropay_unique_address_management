import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react'; // Library untuk generate QR code
import { useNavigate } from 'react-router-dom';
import './Home.css'; // File CSS untuk gaya tambahan
import { axiosCheckLoginQr, axiosGenerateLoginQr } from './Axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button'; // Import Button component from Material UI

function Home() {
  const [qrData, setQrData] = useState('');
  const [merchantID, setMerchantID] = useState('');
  const [qrToken, setQrToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // State untuk status loading
  const navigate = useNavigate();

  useEffect(() => {
    const storedMerchantID = localStorage.getItem('merchantID');
    if (!storedMerchantID) {
      navigate('/login');
      return;
    }

    setMerchantID(storedMerchantID);
    fetchQrData(storedMerchantID); // Initial fetch

    const fetchQrDataInterval = setInterval(() => {
      fetchQrData(storedMerchantID);
    }, 30000); // Fetch data every 30 seconds

    return () => clearInterval(fetchQrDataInterval); // Cleanup interval on component unmount
  }, [navigate]);

  const fetchQrData = async (merchantID) => {
    setLoading(true); // Mengatur loading menjadi true saat mulai fetch data
    try {
      const response = await axiosGenerateLoginQr(merchantID);
      setQrToken(response.data.token); // Set token state
      const qrData = {
        merchantID: response.data.merchantID,
        token: response.data.token
      }
      console.log('response.data.token: ', response.data.token);
      setQrData(JSON.stringify(qrData)); // Sesuaikan dengan struktur response API Anda
    } catch (error) {
      setErrorMessage('Failed to generate QR code. Please try again later.');
    } finally {
      setLoading(false); // Mengatur loading kembali menjadi false setelah selesai fetch data
    }
  };

  useEffect(() => {
    if (!merchantID || !qrToken) return;

    const checkLoginQr = async () => {
      try {
        console.log('token: ', qrToken);
        const response = await axiosCheckLoginQr(merchantID, qrToken);
        console.log('Check Login QR Response:', response.loggedIn);
        if (!!response.loggedIn) {
          toast.success('Login QR Success!');
          fetchQrData(merchantID); // Generate QR baru setelah login sukses
        }
      } catch (error) {
        console.error('Error checking login QR:', error);
      }
    };

    const checkLoginQrInterval = setInterval(() => {
      checkLoginQr();
    }, 5000); // Post data every 5 seconds

    return () => clearInterval(checkLoginQrInterval); // Cleanup interval on component unmount
  }, [merchantID, qrToken, navigate]); // Add qrToken as dependency

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleListCashier = () => {
    navigate('/list-cashier');
  };

  return (
    <div className="home-container">
      <h1>Scan This QR To Login</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={handleListCashier}
        style={{ position: 'absolute', top: 10, left: 10, width: '10%' }}
      >
        List Cashier
      </Button>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      {loading && <p>Loading...</p>} {/* Tampilkan pesan loading jika loading === true */}
      {errorMessage && <p className="error">{errorMessage}</p>}
      {qrData && <QRCode value={qrData} size={300} />}
      <ToastContainer />
    </div>
  );
}

export default Home;