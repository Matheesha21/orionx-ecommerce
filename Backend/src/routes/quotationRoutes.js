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

// Serve generated PDF for a quotation (public)
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    const { getQuotationPdfPath } = await import('../utils/pdfGenerator.js');
    const filePath = getQuotationPdfPath(id);
    if (!filePath) return res.status(404).json({ message: 'PDF not found' });
    res.sendFile(filePath);
  } catch (err) {
    console.error('Serve PDF error:', err);
    res.status(500).json({ message: 'Failed to serve PDF' });
  }
});

// Admin routes
router.get('/', protect, adminOnly, listQuotations);
router.get('/:id', protect, adminOnly, getQuotation);
router.patch('/:id/status', protect, adminOnly, updateQuotationStatus);
router.delete('/:id', protect, adminOnly, deleteQuotation);

export default router;
