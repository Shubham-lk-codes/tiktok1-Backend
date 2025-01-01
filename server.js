import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import postRoutes from './routes/post.routes.js';
import messageRoutes from './routes/messageRoutes.js'; // Import new routes
import conversationRoutes from './routes/conversationRoutes.js'; // Import conversation routes
import cors from 'cors';
import { Server } from 'socket.io'; // Import socket.io
import http from 'http';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Use http server for socket.io

const allowedOrigins = [
  'http://localhost:5173',
  'https://guileless-snickerdoodle-6ef550.netlify.app',
  'https://tiktok1-frontend.vercel.app',
];

app.use(express.json());

// CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.options('*', cors()); // Handles preflight

// Routes
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes); // Add message routes
app.use('/api/conversations', conversationRoutes); // Add conversation routes

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust this for frontend URL
    methods: ['GET', 'POST'],
  },
});

// Handle Socket.IO connections for real-time messaging
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation: ${conversationId}`);
  });

  socket.on('sendMessage', (message) => {
    const { conversationId, senderId, text } = message;
    io.to(conversationId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
