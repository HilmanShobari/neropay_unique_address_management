import axios from 'axios';

// Buat instance Axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Ganti dengan URL API Anda
  headers: {
    'Content-Type': 'application/json',
    'API-KEY' : process.env.REACT_APP_API_KEY
  },
});

// Fungsi untuk mengirim data ke endpoint login
export const login = async (email, password) => {
  try {
    const response = await api.post('/merchant/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Fungsi untuk memanggil API generate QR code
export const generateLoginQr = async () => {
    try {
      const response = await api.get('/pgqr/loginQr/generate');
      return response.data;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  };

export default api;
