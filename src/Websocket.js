import { getAccessToken } from './Axios';

// Import Socket.IO client library
const { io } = require('socket.io-client');

// Tentukan URL server WebSocket Anda. Misalnya server berjalan di localhost pada port 3351:
const socket = io(process.env.REACT_APP_API_BASE_URL);

// Ketika koneksi terbuka
socket.on('connect', () => {
  console.log(`Connected to WebSocket server with id: ${socket.id}`);
});

export const websocketCheckLoginQr = async (merchantID, cashierID) => {
  const websocketToken = `Bearer ${getAccessToken()}`;

  // Mengirim pesan ke server
  socket.emit('checkQr', {
    merchantID: merchantID,
    cashierID: cashierID,
    websocketToken: websocketToken,
  });

  // Menangani pesan dari event 'checkTransaction'
  socket.on('msgCheckQr', (res) => {
    console.log('Received data checkQr:', res);
    if (res?.loggedIn) {
      // Disconnect socket di sini
      socket.disconnect();
      console.log('Socket disconnected');
    }
  });

  // Ketika koneksi ditutup
  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
  });
};

export const websocketDisconnect = async () => {
  socket.disconnect();
};
