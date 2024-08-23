import axios from 'axios';

// Buat instance Axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Ganti dengan URL API Anda
  headers: {
    'Content-Type': 'application/json',
    'API-KEY': process.env.REACT_APP_API_KEY,
  },
});

export const axiosRetrieveBalance = async (addresses) => {
  try {
    const response = await api.post('/testnet/retrieveBalance', {
      network: 'AMOY',
      addresses
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const axiosGetListUniqueAddress = async () => {
  try {
    const response = await api.get('/testnet/getUniqueAddress', {
      params: {
        network: 'AMOY',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error get list unique address:', error);
    throw error;
  }
};

export default api;
