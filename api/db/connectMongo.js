import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

async function connectMongo() {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(MONGO_URI);

    console.log('MongoDB connection successful');

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB error:', err);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
}

export default connectMongo;
