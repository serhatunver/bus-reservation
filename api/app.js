import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import connectMongo from './db/connectMongo.js';
import cors from 'cors';

import reservationRoutes from './routes/reservation.routes.js';
import tripRoutes from './routes/trip.routes.js';
import stopRoutes from './routes/stop.routes.js';
import busRoutes from './routes/bus.routes.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';

import './models/reservation.model.js';
import './models/trip.model.js';
import './models/stop.model.js';
import './models/bus.model.js';
import './models/user.model.js';

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use('/api/reservation', reservationRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/stop', stopRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    db: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  try {
    await connectMongo();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
