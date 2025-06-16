import express from 'express';
import busController from '../controllers/bus.controller.js';
import { protectRoute, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get(
  '/all',
  protectRoute,
  requireRole('admin'),
  busController.getAllBuses
);
router.get(
  '/:busId',
  protectRoute,
  requireRole('admin'),
  busController.getBusById
);
router.post('/', protectRoute, requireRole('admin'), busController.createBus);
router.put(
  '/:busId',
  protectRoute,
  requireRole('admin'),
  busController.updateBus
);
router.delete(
  '/:busId',
  protectRoute,
  requireRole('admin'),
  busController.deleteBus
);

export default router;
