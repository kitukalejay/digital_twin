// const express = require('express');
// const http = require('http');
// const WebSocket = require('ws');
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// const PORT = process.env.PORT || 3000;
// const publicPath = path.join(__dirname, 'public');

// // Ensure public directory exists
// const fs = require('fs');
// if (!fs.existsSync(publicPath)) {
//   fs.mkdirSync(publicPath, { recursive: true });
//   console.log('Created public directory');
// }

// // WebSocket and routes would remain the same as before
// // ... [rest of your existing websocket code]

// // Serve static files
// app.use(express.static(publicPath));

// // Root route
// app.get('/', (req, res) => {
//   res.sendFile(path.join(publicPath, 'index.html'));
// });

// // Health check
// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'healthy' });
// });

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Serving from: ${publicPath}`);
// });









// const WebSocket = require('ws');
// const http = require('http');

// const port = process.env.PORT || 10000;

// // Create an HTTP server (optional response to HTTP requests)
// const server = http.createServer((req, res) => {
//   res.writeHead(200);
//   res.end("WebSocket Server is running");
// });

// // Attach WebSocket server to the HTTP server
// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws) => {
//   console.log('Client connected');

//   ws.on('message', (message) => {
//     const text = message.toString();  // convert Buffer to string
//     console.log('Received:', text);
//     ws.send(text);  // echo as string
//   });
  

//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });

// server.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });







// const WebSocket = require('ws');
// const http = require('http');

// const port = process.env.PORT || 10000;

// const server = http.createServer((req, res) => {
//   res.writeHead(200);
//   res.end("WebSocket Server is running");
// });

// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws) => {
//   console.log('🔌 Client connected');

//   ws.on('message', (message) => {
//     const text = message.toString().trim();
//     console.log('📩 Received:', text);

//     // 🔁 Broadcast the message to ALL connected clients (including ESP32)
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(text);
//       }
//     });
//   });

//   ws.on('close', () => {
//     console.log('❌ Client disconnected');
//   });
// });

// server.listen(port, () => {
//   console.log(`🚀 Server running on port ${port}`);
// });





const WebSocket = require("ws");
const express = require("express");

const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  console.log("Client connected");

  clients.push(ws);

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "position_update") {
        console.log("Position update received:", data.payload);

        // Broadcast to all clients except sender
        clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: "position_update",
              payload: data.payload
            }));
          }
        });
      } else if (data.type === "command") {
        // Handle other command types if needed
      }
    } catch (e) {
      console.error("Invalid JSON:", e);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients = clients.filter((c) => c !== ws);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});
