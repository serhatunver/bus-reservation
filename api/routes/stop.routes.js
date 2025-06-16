import express from 'express';
import stopController from '../controllers/stop.controller.js';
import { protectRoute, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get(
  '/all',
  protectRoute,
  requireRole('admin'),
  stopController.getAllStops
);
router.get('/search', stopController.searchStops);
router.get('/:stopId', stopController.getStopById);
router.post('/', protectRoute, requireRole('admin'), stopController.createStop);
router.put(
  '/:stopId',
  protectRoute,
  requireRole('admin'),
  stopController.updateStop
);
router.delete(
  '/:stopId',
  protectRoute,
  requireRole('admin'),
  stopController.deleteStop
);

export default router;
