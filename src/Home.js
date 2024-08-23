import React, { useEffect, useState } from 'react';
import './Home.css'; // File CSS untuk gaya tambahan
import { axiosGetListUniqueAddress, axiosRetrieveBalance } from './Axios';
import {
  ethersGetBalance,
  ethersGetBalanceUSDT,
  ethersGetBalanceUSDC,
} from './Ethers';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Checkbox,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

function Home() {
  const [uniqueAddresses, setUniqueAddresses] = useState([]);
  const [checkedAddresses, setCheckedAddresses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // State untuk status loading
  const [openDialog, setOpenDialog] = useState(false); // State untuk dialog

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosGetListUniqueAddress();
        for (let i = 0; i < response.data.uniqueAddresses.length; i++) {
          const address = response.data.uniqueAddresses[i].address;
          const balance = await ethersGetBalance(address);
          const usdtAddress = response.data.token.USDT;
          const usdcAddress = response.data.token.USDC;
          const balanceUSDT = await ethersGetBalanceUSDT(usdtAddress, address);
          const balanceUSDC = await ethersGetBalanceUSDC(usdcAddress, address);

          response.data.uniqueAddresses[i].balance = balance;
          response.data.uniqueAddresses[i].balanceUSDT = balanceUSDT;
          response.data.uniqueAddresses[i].balanceUSDC = balanceUSDC;
        }

        console.log('response: ', response.data);
        setUniqueAddresses(response.data.uniqueAddresses);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to fetch unique addresses.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (address) => {
    setCheckedAddresses((prev) => {
      if (prev.includes(address)) {
        return prev.filter((item) => item !== address);
      } else {
        return [...prev, address];
      }
    });
  };

  const handleCheckAll = () => {
    if (checkedAddresses.length === uniqueAddresses.length) {
      setCheckedAddresses([]); // Uncheck all
    } else {
      const allAddresses = uniqueAddresses.map((addr) => addr.address);
      setCheckedAddresses(allAddresses); // Check all
      console.log('checkedAddresses: ', checkedAddresses);
    }
  };

  const handleRetrieveBalance = () => {
    if (checkedAddresses.length === 0) {
      toast.error('No addresses selected. Please select at least one address.');
    } else {
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirm = async () => {
    const loadingToastId = toast.loading('Retrieving balance...');
    try {
      console.log('Checked Addresses:', checkedAddresses);
      setOpenDialog(false);
      const res = await axiosRetrieveBalance(checkedAddresses);
      console.log('Retrieve balance response:', res);
      toast.update(loadingToastId, {
        render: res.message,
        type: 'success',
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error) {
      console.log('error Retrieve balance response:', error);
      toast.update(loadingToastId, {
        render: 'Retrieve balance error: ' + error.message,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="home-container">
      <div className="content-container">
        <h1>Unique Address Management</h1>
        {loading && <p>Loading...</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}

        <div className="table-header">
          <Button
            variant="contained"
            color="primary"
            onClick={handleRetrieveBalance}
            style={{ float: 'right', marginBottom: '10px' }}
          >
            Retrieve Balance
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCheckAll}
            style={{ float: 'left', marginBottom: '10px' }}
          >
            {checkedAddresses.length === uniqueAddresses.length
              ? 'Uncheck All'
              : 'Check All'}
          </Button>
        </div>

        {!loading && uniqueAddresses.length > 0 && (
          <table className="unique-addresses-table">
            <thead style={{ backgroundColor: '#f2f2f2', color: 'black' }}>
              <tr>
                <th>No</th>
                <th>Address</th>
                <th>Balance</th>
                <th>Balance USDT</th>
                <th>Balance USDC</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#f2f2f2', color: 'black' }}>
              {uniqueAddresses.map((address, index) => (
                <tr key={address.address}>
                  <td>{index + 1}</td>
                  <td>{address.address}</td>
                  <td>{address.balance}</td>
                  <td>{address.balanceUSDT}</td>
                  <td>{address.balanceUSDC}</td>
                  <td>
                    <Checkbox
                      checked={checkedAddresses.includes(address.address)}
                      onChange={() => handleCheckboxChange(address.address)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && uniqueAddresses.length === 0 && (
          <p>No unique addresses found.</p>
        )}
      </div>

      {/* Dialog Konfirmasi */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you really want to retrieve balance from these addresses?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Sure
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </div>
  );
}

export default Home;
