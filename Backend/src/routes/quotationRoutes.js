import express from 'express';
import {
  createQuotation,
  listQuotations,
  getQuotation,
  updateQuotationStatus,
  deleteQuotation,
} from '../controllers/quotationController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createQuotation);

// Admin routes
router.get('/', protect, adminOnly, listQuotations);
router.get('/:id', protect, adminOnly, getQuotation);
router.patch('/:id/status', protect, adminOnly, updateQuotationStatus);
router.delete('/:id', protect, adminOnly, deleteQuotation);

export default router;
