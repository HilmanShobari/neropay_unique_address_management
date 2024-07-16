import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react'; // Library untuk generate QR code
import { useNavigate } from 'react-router-dom';
import './Home.css'; // File CSS untuk gaya tambahan
import {
  axiosCheckLoginQr,
  axiosGenerateLoginQr,
  axiosGetListCashier,
  axiosLogoutQr,
  axiosEditCashier,
  axiosDeleteCashier,
} from './Axios';
// import { websocketCheckLoginQr } from './Websocket';
import moment from 'moment-timezone';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

function Home() {
  const [listCashier, setListCashier] = useState([]);
  const [qrData, setQrData] = useState('');
  const [merchantID, setMerchantID] = useState('');
  const [cashierID, setCashierID] = useState('');
  const [qrToken, setQrToken] = useState('');
  const [cashierToken, setCashierToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // State untuk status loading
  const [open, setOpen] = useState(false); // State for dialog open
  const [openQrModal, setOpenQrModal] = useState(false); // State for QR modal open
  const [openEditModal, setOpenEditModal] = useState(false); // State for Edit dialog open
  const [qrCards, setQrCards] = useState([]); // State for storing multiple QR code cards
  const [cashierName, setCashierName] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [expirationTime, setExpirationTime] = useState('');
  const [selectedCashier, setSelectedCashier] = useState(null); // State for selected cashier
  const [modalQrData, setModalQrData] = useState(''); // State for QR code data in modal
  const navigate = useNavigate();

  useEffect(() => {
    const storedMerchantID = localStorage.getItem('merchantID');
    if (!storedMerchantID) {
      navigate('/login');
      return;
    }

    setMerchantID(storedMerchantID);

    const fetchListCashier = async () => {
      try {
        const merchantID = localStorage.getItem('merchantID');
        if (!merchantID) {
          navigate('/login');
          return;
        }

        const response = await axiosGetListCashier(merchantID);
        console.log('response list cashier: ', response.data);
        setListCashier(response.data);
      } catch (error) {
        handleLogout();
        console.error('Error fetching list of cashiers:', error);
      }
    };

    fetchListCashier(); // Fetch list cashiers
  }, [navigate, qrCards, openQrModal]);

  const fetchQrData = async (merchantID, cashierName, expirationTime) => {
    setLoading(true); // Mengatur loading menjadi true saat mulai fetch data
    try {
      const response = await axiosGenerateLoginQr(
        merchantID,
        cashierName,
        expirationTime
      );

      console.log('qrData: ', response.data);
      return response.data;
    } catch (error) {
      setErrorMessage('Failed to generate QR code. Please try again later.');
    } finally {
      setLoading(false); // Mengatur loading kembali menjadi false setelah selesai fetch data
    }
  };

  // useeffect check login qr
  useEffect(() => {
    if (!merchantID || !modalQrData || !openQrModal) return;

    const checkLoginQr = async () => {
      try {
        const response = await axiosCheckLoginQr(merchantID, cashierID);
        console.log('Check Login QR Response:', response.loggedIn);
        if (!!response.loggedIn) {
          toast.success(`Login QR Success!`);
          setOpenQrModal(false);
        }
      } catch (error) {
        console.error('Error checking login QR:', error);
      }
    };

    checkLoginQr();

    const checkLoginQrInterval = setInterval(() => {
      checkLoginQr();
    }, 3000); // Post data every 3 seconds

    return () => clearInterval(checkLoginQrInterval); // Cleanup interval on component unmount
  }, [merchantID, modalQrData, openQrModal, navigate]); // Add qrToken as dependency

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleQrModalClose = () => {
    setOpenQrModal(false);
    setSelectedCashier(null);
  };

  const handleDisconnect = async () => {
    const response = await axiosLogoutQr(merchantID, cashierID, cashierToken);
    console.log('response: ', response);
    toast.success(`Logout Success!`);
    setSelectedCashier(null);
    setOpenQrModal(false);
  };

  const handleDeleteCashier = async () => {
    const response = await axiosDeleteCashier(merchantID, cashierID);
    console.log('response: ', response);
    toast.success(`Delete Cashier Success!`);
    setSelectedCashier(null);
    setOpenQrModal(false);
  };

  const handleEditCashier = () => {
    setOpenEditModal(true);
    setCashierName(selectedCashier.cashierName);
    const expiration = selectedCashier.expirationTime;
    setHours(Math.floor(expiration / 3600));
    setMinutes(Math.floor((expiration % 3600) / 60));
  };

  const handleSubmitEdit = async () => {
    const newExpirationTime = parseInt(hours) * 3600 + parseInt(minutes) * 60;
    setExpirationTime(newExpirationTime);
    const response = await axiosEditCashier(
      merchantID,
      cashierID,
      cashierName,
      newExpirationTime
    );
    console.log('response: ', response);
    toast.success(`Edit Cashier Success!`);

    fetchQrData(merchantID, cashierName, newExpirationTime);
    setSelectedCashier(null);
    setOpenEditModal(false);
    setOpenQrModal(false);
  };

  const handleCardClick = async (cashier) => {
    setSelectedCashier(cashier);
    try {
      console.log('selected cashier: ', cashier);
      const fetchedQrData = await fetchQrData(
        merchantID,
        cashier.cashierName,
        cashier.expirationTime
      );

      console.log('fetchedQrData: ', fetchedQrData);

      const newQrData = {
        cashierName: fetchedQrData.cashierName,
        expirationTime: fetchedQrData.expirationTime,
        qrString: JSON.stringify({
          merchantID,
          cashierID: fetchedQrData.cashierID,
          qrToken: fetchedQrData.qrToken,
        }),
      };

      setCashierID(fetchedQrData.cashierID);
      if (!fetchedQrData.loggedIn) {
        setQrToken(fetchedQrData.qrToken);
        setModalQrData(newQrData.qrString);
      } else {
        setCashierToken(fetchedQrData.cashierToken);
        setModalQrData(null);
      }
      setOpenQrModal(true);
    } catch (error) {
      setErrorMessage('Failed to generate QR code. Please try again later.');
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('cashierName: ', cashierName);
      console.log('hours: ', hours);
      console.log('minutes: ', minutes);

      const newExpirationTime = parseInt(hours) * 3600 + parseInt(minutes) * 60;
      setExpirationTime(newExpirationTime);

      const fetchedQrData = await fetchQrData(
        merchantID,
        cashierName,
        newExpirationTime
      );

      const newQrData = {
        cashierName: fetchedQrData.cashierName,
        expirationTime: fetchedQrData.expirationTime,
        qrString: JSON.stringify({
          merchantID,
          qrToken: fetchedQrData.qrToken,
        }),
      };

      // Add the new QR code data to the qrCards array
      setQrCards((prevQrCards) => [...prevQrCards, newQrData]);

      // Clear form inputs
      setCashierName('');
      setHours('');
      setMinutes('');
      setOpen(false);
    } catch (error) {
      setOpen(false);
      setErrorMessage('Failed to generate QR code. Please try again later.');
    }
  };

  const secondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${
      minutes !== 1 ? 's' : ''
    }`;
  };

  return (
    <div className="home-container">
      <div className="content-container">
        <h1>Point Of Sale Management</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClickOpen}
          style={{ marginBottom: '20px' }}
        >
          Create New Point of Sale
        </Button>
        {loading && <p>Loading...</p>}{' '}
        {/* Tampilkan pesan loading jika loading === true */}
        {errorMessage && <p className="error">{errorMessage}</p>}
        {listCashier.map((card, index) => (
          <Card
            key={index}
            style={{ marginTop: '20px', cursor: 'pointer' }}
            onClick={() => handleCardClick(card)}
          >
            <CardContent>
              <Typography variant="h5" component="div">
                {card.cashierName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Qr Expired At:{' '}
                {moment.unix(card.qrExpiredAt).format('DD-MM-YYYY HH:mm:ss')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Logged In Expiration Time: {secondsToTime(card.expirationTime)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Logged In Expired At:{' '}
                {moment.unix(card.expiredAt).format('DD-MM-YYYY HH:mm:ss')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Is Login: {card.loggedIn ? 'Yes' : 'No'}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Point of Sale</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name and expiration time for the new point of sale.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={cashierName}
            onChange={(e) => setCashierName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Hours"
            type="number"
            fullWidth
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Minutes"
            type="number"
            fullWidth
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {modalQrData ? (
        <Dialog
          open={openQrModal}
          onClose={handleQrModalClose}
          className="cashier-qr-modal"
        >
          <DialogTitle>Generated QR Code</DialogTitle>
          <DialogContent>
            <QRCode value={modalQrData} size={200} />
            <DialogContentText style={{ marginTop: '20px' }}>
              Scan this QR code to login as{' '}
              {selectedCashier && selectedCashier.cashierName}
            </DialogContentText>
            <DialogContentText>
              Qr Expired At:{' '}
              {selectedCashier &&
                moment
                  .unix(Number(selectedCashier.qrExpiredAt))
                  .format('DD-MM-YYYY HH:mm:ss')}
            </DialogContentText>
            <DialogContentText style={{ marginTop: '20px' }}>
              Or Input This Code {selectedCashier && selectedCashier.qrCode}
            </DialogContentText>
            <DialogContentText>
              Logged In Expiration Time:{' '}
              {selectedCashier && secondsToTime(selectedCashier.expirationTime)}
            </DialogContentText>
            <DialogContentText>
              Logged In Expired At:{' '}
              {selectedCashier &&
                moment
                  .unix(
                    Math.floor(Date.now() / 1000) +
                      Number(selectedCashier.expirationTime)
                  )
                  .format('DD-MM-YYYY HH:mm:ss')}
            </DialogContentText>
          </DialogContent>

          <DialogActions style={{ justifyContent: 'center' }}>
            <Button
              variant="contained"
              style={{
                height: '100%',
                paddingLeft: '0',
                paddingRight: '0',
              }}
              onClick={handleQrModalClose}
              color="primary"
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleEditCashier}
              style={{
                backgroundColor: 'green',
                height: '100%',
                paddingLeft: '0',
                paddingRight: '0',
              }}
            >
              Edit Cashier
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteCashier}
              style={{
                backgroundColor: 'red',
                width: '400px',
                height: '100%',
              }}
            >
              Delete Cashier
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog
          open={openQrModal}
          onClose={handleQrModalClose}
          className="cashier-qr-modal"
        >
          <DialogTitle>
            {selectedCashier && selectedCashier.cashierName}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Expiration Time:{' '}
              {selectedCashier && secondsToTime(selectedCashier.expirationTime)}
            </DialogContentText>
            <DialogContentText>
              Expired At:{' '}
              {selectedCashier &&
                moment
                  .unix(selectedCashier.expiredAt)
                  .format('DD-MM-YYYY HH:mm:ss')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                width: '50%',
                height: '100%',
              }}
              onClick={handleQrModalClose}
              color="primary"
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleEditCashier}
              style={{
                backgroundColor: 'green',
                height: '100%',
                paddingLeft: '0',
                paddingRight: '0',
              }}
            >
              Edit Cashier
            </Button>
            <Button
              variant="contained"
              style={{ textAlign: 'left', backgroundColor: 'red' }}
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {/* Edit Cashier Dialog */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Cashier</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please edit the name and expiration time for the cashier.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={cashierName}
            onChange={(e) => setCashierName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Hours"
            type="number"
            fullWidth
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Minutes"
            type="number"
            fullWidth
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitEdit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </div>
  );
}

export default Home;
