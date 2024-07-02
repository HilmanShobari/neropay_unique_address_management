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
export const axiosGenerateLoginQr = async (merchantID) => {
  try {
    const response = await api.post('/pgqr/loginQr/generate', { merchantID });
    return response.data;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const axiosCheckLoginQr = async (merchantID, token) => {
  try {
    const response = await api.post('/pgqr/loginQr/check', { merchantID, token });
    return response.data;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export default api;
