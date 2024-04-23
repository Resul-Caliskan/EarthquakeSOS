import io from 'socket.io-client';

const apiUrl = 'your_server_url';

export const establishWebSocketConnection = () => {
  const socket = io(apiUrl);

  socket.on('connect', () => {
    console.log('WebSocket connection established');
  });

  socket.on('disconnect', () => {
    console.log('WebSocket connection disconnected');
  });

  // You can add more event listeners as needed
  
  return socket;
};
