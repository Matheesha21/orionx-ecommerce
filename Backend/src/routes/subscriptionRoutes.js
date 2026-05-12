import express from 'express';
import {
	subscribe,
	unsubscribe,
	listSubscribers,
	deleteSubscriber,
} from '../controllers/subscriptionController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public subscribe and unsubscribe
router.post('/', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin-only endpoints
router.get('/', protect, adminOnly, listSubscribers);
router.delete('/:id', protect, adminOnly, deleteSubscriber);

export default router;
