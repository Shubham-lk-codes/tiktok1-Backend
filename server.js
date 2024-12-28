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

// Allow all origins (for testing) or specify your allowed origins
const allowedOrigins = [
    'http://localhost:5173', // Local development
    'https://celadon-pika-488d85.netlify.app' // Deployed Netlify frontend
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight requests
        credentials: true // Support cookies/headers
    })
);

// Handle preflight requests explicitly (optional)
app.options('*', cors());

app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
