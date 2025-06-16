import mongoose from 'mongoose';
const tripSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: String,
    route: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop' },
        to: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop' },
        price: Number,
        duration: Number,
      },
    ],
    departureTime: Date,
    arrivalTime: Date,
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
