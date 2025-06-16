import Stop from '../models/stop.model.js';
import fuzzysort from 'fuzzysort';

const getAllStops = async (req, res, next) => {
  try {
    const stops = await Stop.find().sort({ createdAt: -1 }).lean();
    res.json({ stops });
  } catch (error) {
    next(error);
  }
};

const searchStops = async (req, res, next) => {
  try {
    let { q } = req.query;
    if (!q || q.length < 1) return res.json({ stops: [] });

    // Fetch all stops from the database
    const stops = await Stop.find({}).lean();

    // Use fuzzysort to search through the stops
    const results = fuzzysort.go(q, stops, { key: 'name', limit: 5 });

    const suggestions = results.map((r) => ({
      id: r.obj._id,
      name: r.obj.name,
    }));
    // .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name

    res.json({
      stops: suggestions,
    });
  } catch (err) {
    next(err);
  }
};

const getStopById = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    const stop = await Stop.findById(stopId).lean();
    if (!stop) {
      return res.status(404).json({ message: 'Stop not found' });
    }
    res.json({ stop });
  } catch (error) {
    next(error);
  }
};
const createStop = async (req, res, next) => {
  try {
    const { newStopName } = req.body;
    if (!newStopName) {
      return res.status(400).json({ message: 'Stop name is required' });
    }
    // Using collation for case-insensitive search
    const existingStop = await Stop.find({ name: newStopName })
      .collation({ locale: 'en', strength: 2 })
      .lean();

    if (existingStop.length > 0) {
      return res.status(400).json({ message: 'Stop already exists' });
    }

    const newStop = await Stop.create({ name: newStopName });

    res.status(201).json({ newStop });
  } catch (error) {
    next(error);
  }
};

const updateStop = async (req, res, next) => {
  try {
    const { updatedStopName } = req.body;
    const { stopId } = req.params;

    if (!updatedStopName) {
      return res.status(400).json({ message: 'Updated stop name is required' });
    }

    const updatedStop = await Stop.findByIdAndUpdate(
      stopId,
      { name: updatedStopName },
      { new: true }
    ).lean();

    if (!updatedStop) {
      return res.status(404).json({ message: 'Stop not found' });
    }

    res.json(updatedStop);
  } catch (error) {
    next(error);
  }
};

const deleteStop = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    const deletedStop = await Stop.findByIdAndDelete(stopId).lean();
    if (!deletedStop) {
      return res.status(404).json({ message: 'Stop not found' });
    }
    res.json({ message: 'Stop deleted successfully', deletedStop });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllStops,
  searchStops,
  getStopById,
  createStop,
  updateStop,
  deleteStop,
};
