import express from 'express';
import tripController from '../controllers/trip.controller.js';
import { protectRoute, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get(
  '/all',
  protectRoute,
  requireRole('admin'),
  tripController.getAllTrips
);
router.get('/search', tripController.searchTrips);
router.get('/available-seats/:tripId', tripController.getAvailableSeatsByTrip);
router.get('/trip-details/:tripId', tripController.getTripDetails);
router.get('/:tripId', tripController.getTripById);
router.post('/', protectRoute, requireRole('admin'), tripController.createTrip);
router.put(
  '/:tripId',
  protectRoute,
  requireRole('admin'),
  tripController.updateTrip
);
router.delete(
  '/:tripId',
  protectRoute,
  requireRole('admin'),
  tripController.deleteTrip
);

export default router;
