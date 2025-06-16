import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    phone: { type: String, required: true },
    reservations: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
