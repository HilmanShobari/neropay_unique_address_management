import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { axiosGetListCashier } from './Axios';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 'bold',
  textAlign: 'center',
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  fontSize: '1.1rem',
  textAlign: 'center',
}));

function ListCashierClass() {
  const [listCashier, setListCashier] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListCashier = async () => {
      try {
        const merchantID = localStorage.getItem('merchantID');
        if (!merchantID) {
          navigate('/login');
          return;
        }

        const response = await axiosGetListCashier(merchantID);
        console.log('response: ', response.data);
        setListCashier(response.data);
      } catch (error) {
        console.error('Error fetching list of cashiers:', error);
      }
    };

    fetchListCashier(); // Call the async function directly inside useEffect
  }, [navigate]); // Only navigate is a dependency here, listCashier is not needed

  const handleHome = () => {
    navigate('/');
  };

  return (
    <Paper>
      <Typography variant="h4" align="center" gutterBottom>
        List Cashier Logged In
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleHome}
        style={{ position: 'absolute', top: 10, left: 10, width: '10%' }}
      >
        Home
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Cashier ID</StyledTableCell>
            <StyledTableCell>Cashier Token</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listCashier.map(cashier => (
            <TableRow key={cashier.id}>
              <StyledTableCellBody>{cashier.cashierID}</StyledTableCellBody>
              <StyledTableCellBody>{cashier.cashierToken}</StyledTableCellBody>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

function ListCashier() {
  return (
    <div className="Login">
      <ListCashierClass />
    </div>
  );
}

export default ListCashier;
