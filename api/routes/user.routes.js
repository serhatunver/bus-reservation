import express from 'express';
import userController from '../controllers/user.controller.js';
import reservationController from '../controllers/reservation.controller.js';
import { protectRoute, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get(
  '/all',
  protectRoute,
  requireRole('admin'),
  userController.getAllUsers
);

router.get(
  '/my-reservations',
  protectRoute,
  reservationController.getMyReservations
);

router.put('/cancel-reservation', reservationController.cancelReservation);

router.get(
  '/:userId',
  protectRoute,
  requireRole('admin'),
  userController.getUserById
);
router.post('/', protectRoute, requireRole('admin'), userController.createUser);
router.put(
  '/:userId',
  protectRoute,
  requireRole('admin'),
  userController.updateUser
);
router.delete(
  '/:userId',
  protectRoute,
  requireRole('admin'),
  userController.deleteUser
);

export default router;
