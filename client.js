const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:10000');

socket.on('open', () => {
  console.log('Connected to server');
  socket.send('Hello from client!');
});

socket.on('message', (message) => {
  console.log('Received:', message.toString());
});

socket.on('close', () => {
  console.log('Connection closed');
});
