import axios from 'axios';

// Buat instance Axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Ganti dengan URL API Anda
  headers: {
    'Content-Type': 'application/json',
    'API-KEY': process.env.REACT_APP_API_KEY,
  },
});

// Fungsi untuk mengirim data ke endpoint login
export const axiosLogin = async (email, password) => {
  try {
    const response = await api.post('/merchant/login', { email, password });
    // Simpan data ke localStorage
    localStorage.setItem('accessToken', response.data.data.accessToken);
    localStorage.setItem('merchantID', response.data.data.merchantID);
    localStorage.setItem('merchantAddress', response.data.data.merchantAddress);
    localStorage.setItem('merchantApiKey', response.data.data.merchantApiKey);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Fungsi untuk memanggil API generate QR code dengan merchantID
export const axiosGenerateLoginQr = async (
  merchantID,
  cashierName,
  expirationTime
) => {
  try {
    const response = await api.post('/loginQr/generate', {
      merchantID,
      cashierName,
      expirationTime,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const axiosCheckLoginQr = async (merchantID, cashierID, qrToken) => {
  try {
    const response = await api.post('/loginQr/check', {
      merchantID,
      cashierID,
      qrToken,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const axiosLogoutQr = async (merchantID, cashierID, cashierToken) => {
  try {
    const response = await api.post('/cashier/logout', {
      merchantID,
      cashierID,
      cashierToken,
    });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const axiosEditCashier = async (merchantID, cashierID, cashierName, expirationTime) => {
  try {
    const response = await api.post('/cashier/edit', {
      merchantID,
      cashierID,
      cashierName,
      expirationTime
    });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const axiosDeleteCashier = async (merchantID, cashierID) => {
  try {
    const response = await api.post('/cashier/delete', {
      merchantID,
      cashierID,
    });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const axiosGetListCashier = async (merchantID) => {
  try {
    const response = await api.post('/cashier/list', { merchantID });
    return response.data;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export default api;
