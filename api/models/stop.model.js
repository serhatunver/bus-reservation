import mongoose from 'mongoose';
const stopSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Stop = mongoose.model('Stop', stopSchema);
export default Stop;
