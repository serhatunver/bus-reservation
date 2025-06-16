import express from 'express';
import reservationController from '../controllers/reservation.controller.js';
const router = express.Router();
import {
  protectRoute,
  optionalAuth,
  requireRole,
} from '../middleware/auth.middleware.js';

// Route to get all reservations for admin
router.get(
  '/all',
  protectRoute,
  requireRole('admin'),
  reservationController.getAllReservations
);
// Route to get a specific reservation by ID
router.get(
  '/:reservationId',
  protectRoute,
  requireRole('admin'),
  reservationController.getReservationById
);
// Route to create a new reservation
router.post('/', optionalAuth, reservationController.createReservation);
// Route to update a reservation by ID
router.put(
  '/:reservationId',
  protectRoute,
  requireRole('admin'),
  reservationController.updateReservation
);
// Route to delete a reservation by ID
router.delete(
  '/:reservationId',
  protectRoute,
  requireRole('admin'),
  reservationController.deleteReservation
);
// Route to cancel a reservation by ID
router.post('/cancel-reservation', reservationController.cancelReservation);
// Route to get a reservation by Pnr number
router.get('/pnr/:pnr', reservationController.getReservationByPnr);
// Route to get reservations by Pnr number and email
router.get(
  '/pnr/:pnr/email/:email',
  reservationController.getReservationByPnrAndEmail
);

export default router;
