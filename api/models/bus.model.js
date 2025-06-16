import mongoose from 'mongoose';
const busSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    capacity: { type: Number, required: true },
    model: { type: String, required: true },
    modelYear: { type: Number, required: true },
    plateNumber: { type: String, required: true, unique: true },
    trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
    isActive: { type: Boolean, default: true },
    seats: [
      {
        seatNumber: { type: Number, required: true },
        row: { type: Number, required: true },
        column: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Bus = mongoose.model('Bus', busSchema);
export default Bus;
