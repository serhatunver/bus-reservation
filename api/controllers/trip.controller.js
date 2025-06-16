import Trip from '../models/trip.model.js';
import Stop from '../models/stop.model.js';
import { getAvailableSeatsOrdered } from '../services/seatAvailabilityService.js';
import { enrichTripDetails } from '../helpers/tripHelpers.js';

const getAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find()
      .populate({
        path: 'route',
        populate: {
          path: 'from to',
          select: 'name',
        },
      })
      .populate('bus', 'model plateNumber capacity')
      .sort({ createdAt: -1 })
      .lean();

    res.json(trips);
  } catch (error) {
    next(error);
  }
};

const searchTrips = async (req, res, next) => {
  try {
    const { fromStopId, toStopId, outboundDate } = req.query;

    // Validate mandatory params
    if (!fromStopId || !toStopId || !outboundDate) {
      return res.status(400).json({ message: 'Missing required parameters.' });
    }

    const [fromStop, toStop] = await Promise.all([
      Stop.findById(fromStopId).select('name').lean(),
      Stop.findById(toStopId).select('name').lean(),
    ]);

    if (!fromStop || !toStop) {
      return res.status(404).json({ message: 'One or both stops not found.' });
    }

    // Parse outboundDate to the day range: 00:00 - 23:59
    const date = new Date(outboundDate);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    // Find trips on that date which include the correct stop range
    const trips = await Trip.find({
      'route.from': fromStopId,
      'route.to': toStopId,
      departureTime: {
        $gte: date,
        $lt: nextDate,
      },
    })
      .populate('route.from route.to')
      .populate('bus')
      .lean();

    const validTrips = trips
      .map((trip) => {
        const fromIndex = trip.route.findIndex((r) =>
          r.from._id.equals(fromStopId)
        );
        const toIndex = trip.route.findIndex((r) => r.to._id.equals(toStopId));

        if (fromIndex !== -1 && toIndex !== -1 && fromIndex <= toIndex) {
          return { ...trip, fromIndex, toIndex };
        }
        return null;
      })
      .filter(Boolean);

    const enrichedTrips = await Promise.all(
      validTrips.map((trip) =>
        enrichTripDetails(trip, fromStopId, toStopId, fromStop, toStop)
      )
    );

    res.json({
      trips: enrichedTrips,
      fromStop,
      toStop,
    });
  } catch (err) {
    next(err);
  }
};

const getAvailableSeatsByTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { fromStopId, toStopId } = req.query;
    const seats = await getAvailableSeatsOrdered(tripId, fromStopId, toStopId);
    res.json({ seats });
  } catch (err) {
    next(err);
  }
};

const getTripDetails = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { fromStopId, toStopId } = req.query;

    // 1. Find the trip and populate bus details
    const trip = await Trip.findById(tripId).populate('bus').lean();

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    // Check if fromStopId and toStopId query parameters are provided
    if (!fromStopId || !toStopId) {
      return res.status(400).json({
        message: 'fromStopId and toStopId query parameters are required.',
      });
    }

    // 2. Fetch both stops in parallel
    const [fromStop, toStop] = await Promise.all([
      Stop.findById(fromStopId).select('name').lean(),
      Stop.findById(toStopId).select('name').lean(),
    ]);

    if (!fromStop || !toStop) {
      return res
        .status(404)
        .json({ message: 'Origin or destination stop not found.' });
    }

    // 3. Find the indices of the stops within the trip's route
    const fromIndex = trip.route.findIndex((r) =>
      r.from._id.equals(fromStopId)
    );
    const toIndex = trip.route.findIndex((r) => r.to._id.equals(toStopId));

    if (fromIndex === -1 || toIndex === -1 || fromIndex > toIndex) {
      return res.status(400).json({
        message:
          'Selected stops are invalid for this trip route or their order is incorrect.',
      });
    }

    // 4. Enrich trip details using the helper function
    const enrichedTrip = await enrichTripDetails(
      trip,
      fromStopId,
      toStopId,
      fromStop,
      toStop
    );

    return res.json({
      trip: enrichedTrip,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching trip details:', error);
    // Pass the error to the next error-handling middleware
    next(error);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    // Find the trip by ID and populate bus details
    const trip = await Trip.findById(tripId)
      .populate({
        path: 'route',
        populate: {
          path: 'from to',
          select: 'name',
        },
      })
      .populate('bus', 'model plateNumber capacity')
      .lean();
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }
    res.json(trip);
  } catch (error) {
    next(error);
  }
};

const createTrip = async (req, res, next) => {
  try {
    const tripData = req.body;

    // Validate required fields
    if (!tripData.route || !tripData.bus) {
      return res.status(400).json({ message: 'Route and bus are required.' });
    }

    // Create the trip
    const newTrip = new Trip(tripData);
    await newTrip.save();

    res.status(201).json(newTrip);
  } catch (error) {
    next(error);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const tripData = req.body;

    // Validate required fields
    if (!tripData.route || !tripData.bus) {
      return res.status(400).json({ message: 'Route and bus are required.' });
    }

    // Update the trip
    const updatedTrip = await Trip.findByIdAndUpdate(tripId, tripData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    res.json(updatedTrip);
  } catch (error) {
    next(error);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    // Delete the trip
    const deletedTrip = await Trip.findByIdAndDelete(tripId);

    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    res.json({ message: 'Trip deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllTrips,
  searchTrips,
  getAvailableSeatsByTrip,
  getTripDetails,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
};
