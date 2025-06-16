import Bus from '../models/bus.model.js';

const getAllBuses = async (req, res, next) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 }).lean();
    res.json({ buses });
  } catch (error) {
    next(error);
  }
};

const getBusById = async (req, res, next) => {
  try {
    const { busId } = req.params;
    const bus = await Bus.findById(busId).populate('trips').lean();
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(bus);
  } catch (error) {
    next(error);
  }
};
const createBus = async (req, res, next) => {
  try {
    const { model, plateNumber, capacity } = req.body;
    const newBus = new Bus({ model, plateNumber, capacity });
    await newBus.save();
    res.status(201).json(newBus);
  } catch (error) {
    next(error);
  }
};

const updateBus = async (req, res, next) => {
  try {
    const { busId } = req.params;
    const { model, plateNumber, capacity } = req.body;

    const updatedBus = await Bus.findByIdAndUpdate(
      busId,
      { model, plateNumber, capacity },
      { new: true }
    ).lean();

    if (!updatedBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json(updatedBus);
  } catch (error) {
    next(error);
  }
};

const deleteBus = async (req, res, next) => {
  try {
    const { busId } = req.params;
    const deletedBus = await Bus.findByIdAndDelete(busId).lean();
    if (!deletedBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
};
