import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Allowed origins (include your frontend URL on Netlify)
const allowedOrigins = [
    'http://localhost:5173', // Local development
    'https://celadon-pika-488d85.netlify.app' // Deployed Netlify frontend
];

// CORS setup
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or Postman)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight
        allowedHeaders: ['Content-Type', 'Authorization'], // Allow Authorization header
        credentials: true // Enable cookies/credentials if necessary
    })
);

// Handle preflight requests explicitly (ensure OPTIONS requests are handled)
app.options('*', cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
