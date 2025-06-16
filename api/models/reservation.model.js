import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
const reservationSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    pnr: {
      type: String,
      default: () => customAlphabet('0123456789', 8)(),
    },
    seatNumber: Number,
    fromStop: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop' },
    toStop: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop' },
    passengerName: String,
    passengerSurname: String,
    email: String,
    phone: String,
    price: Number,
    status: {
      type: String,
      enum: ['booked', 'cancelled', 'completed'],
      default: 'booked',
    },
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
