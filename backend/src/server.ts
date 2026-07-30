import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { connectDatabase } from './config/db';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`🔌 WebSocket client connected: ${socket.id}`);

  socket.on('join_room', (room: string) => {
    socket.join(room);
    console.log(`📡 Socket ${socket.id} joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 WebSocket client disconnected: ${socket.id}`);
  });
});

async function bootstrap() {
  await connectDatabase();

  server.listen(PORT, () => {
    console.log(`🚀 Blood Donation Network API Server running on http://localhost:${PORT}`);
    console.log(`🏥 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

bootstrap();
