import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ListCashierClass() {
  const navigate = useNavigate();

  useEffect(() => {
    const merchantID = localStorage.getItem('merchantID');
    if (!merchantID) {
      navigate('/login');
      return;
    }
  });

  return (
    <div>
      <h1>List Cashier</h1>
    </div>
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
