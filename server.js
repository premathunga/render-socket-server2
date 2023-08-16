import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const connectedClients = new Set();

io.on('connection', (socket) => {
  connectedClients.add(socket);

  socket.on('location', (locationData) => {
    console.log('Received location data:', locationData);

    // Broadcast the location data to all connected clients except the sender
    for (const client of connectedClients) {
      if (client !== socket) {
        client.emit('location', locationData);
      }
    }
  });

  socket.on('disconnect', () => {
    connectedClients.delete(socket);
    console.log('A client disconnected');
  });
});

server.listen(8080, () => {
  console.log('WebSocket server listening on port 8080');
});
