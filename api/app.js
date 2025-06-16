import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
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
app.use(cors());

app.use(express.json());
app.use('/api/reservation', reservationRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/stop', stopRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/bus-reservation';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () =>
      console.log('Server running on http://localhost:3000')
    );
  })
  .catch((err) => console.error('MongoDB connection error:', err));
