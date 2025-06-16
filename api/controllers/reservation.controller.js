import Reservation from '../models/reservation.model.js';
import User from '../models/user.model.js';

const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('trip fromStop toStop passenger')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ reservations });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching reservations', error: err.message });
  }
};

const getReservationById = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await Reservation.findById(reservationId)
      .populate('trip fromStop toStop passenger')
      .lean();

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json({ reservation });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching reservation', error: err.message });
  }
};

const createReservation = async (req, res) => {
  try {
    const {
      tripId,
      fromStopId,
      toStopId,
      seatNumber,
      price,
      passengerName,
      passengerSurname,
      email,
      phone,
    } = req.body;

    // Check if the seat is already reserved
    const existingReservation = await Reservation.findOne({
      trip: tripId,
      fromStop: fromStopId,
      toStop: toStopId,
      seatNumber,
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'Seat already reserved' });
    }

    const reservationData = {
      trip: tripId,
      fromStop: fromStopId,
      toStop: toStopId,
      seatNumber,
      price,
    };

    if (req.user) {
      // If user is logged in, add passenger details
      reservationData.passenger = req.user._id;
    } else {
      // If user is not logged in, add passenger details from request body
      reservationData.passengerName = passengerName;
      reservationData.passengerSurname = passengerSurname;
      reservationData.email = email;
      reservationData.phone = phone;
    }

    const newReservation = new Reservation(reservationData);
    await newReservation.save();

    // save the reservation ID to the passenger's reservations array if user is logged in
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.reservations.push(newReservation._id);
        await user.save();
      }
    }

    res.status(201).json({
      message: 'Reservation created successfully',
      reservation: newReservation,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error creating reservation',
      error: err.message,
    });
  }
};

const updateReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { tripId, fromStopId, toStopId, passengerId } = req.body;

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      {
        trip: tripId,
        fromStop: fromStopId,
        toStop: toStopId,
        passenger: passengerId,
      },
      { new: true }
    )
      .populate('trip fromStop toStop passenger')
      .lean();

    if (!updatedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json({
      message: 'Reservation updated successfully',
      reservation: updatedReservation,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error updating reservation', error: err.message });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const deletedReservation = await Reservation.findByIdAndDelete(
      reservationId
    ).lean();

    if (!deletedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting reservation', error: err.message });
  }
};

const getReservationByPnrAndEmail = async (req, res) => {
  try {
    const { pnr, email } = req.params;

    // First try to find the reservation by PNR and email
    let reservation = await Reservation.findOne({ pnr, email })
      .populate('trip fromStop toStop')
      .lean();

    // If not found, try to find by PNR and passenger email
    if (!reservation) {
      // Find the passenger by email
      const passenger = await User.findOne({ email }).lean();

      if (passenger) {
        reservation = await Reservation.findOne({
          pnr,
          passenger: passenger._id,
        })
          .populate('trip fromStop toStop passenger')
          .lean();
      }
    }

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json({ reservation });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching reservation by PNR and email',
      error: err.message,
    });
  }
};

const getMyReservations = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user._id;

    const reservations = await Reservation.find({ passenger: userId })
      .populate('trip fromStop toStop')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ reservations });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching user reservations',
      error: err.message,
    });
  }
};

const cancelReservation = async (req, res) => {
  try {
    const { pnr, email } = req.body;

    const reservation = await Reservation.findOneAndUpdate(
      { pnr, email, status: 'booked' },
      { status: 'cancelled' },
      { new: true }
    ).lean();
    if (!reservation) {
      return res
        .status(404)
        .json({ message: 'Reservation not found or already cancelled' });
    }
    res.json({
      message: 'Reservation cancelled successfully',
      reservation,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error cancelling reservation',
      error: err.message,
    });
  }
};

const getReservationByPnr = async (req, res) => {
  try {
    const { pnr } = req.params;

    const reservation = await Reservation.findOne({
      pnr,
    })
      .populate('trip fromStop toStop passenger')
      .lean();
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json({ reservation });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching reservation by PNR',
      error: err.message,
    });
  }
};

export default {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
  getReservationByPnrAndEmail,
  getMyReservations,
  cancelReservation,
  getReservationByPnr,
};
