import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import cors  from 'cors';


dotenv.config();
connectDB();


const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests only from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // Include cookies or authorization headers if needed
}));

app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
