import Quotation from '../models/Quotation.js';
import { sendQuotationConfirmation } from '../config/mailer.js';
import { generateQuotationPdf } from '../utils/pdfGenerator.js';
import {
  createLocalQuotation,
  listLocalQuotations,
  getLocalQuotationById,
  updateLocalQuotationStatus,
  deleteLocalQuotation,
} from '../utils/localQuotationStore.js';
import mongoose from 'mongoose';

const useMongo = () => mongoose.connection.readyState === 1;

export const createQuotation = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, productsOfInterest, quantity, additionalDetails } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !productsOfInterest || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create quotation
    const quotationPayload = {
      firstName,
      lastName,
      email,
      phone,
      company,
      productsOfInterest,
      quantity,
      additionalDetails,
    };

    const quotation = useMongo()
      ? await new Quotation(quotationPayload).save()
      : await createLocalQuotation(quotationPayload);

    // Send confirmation email to customer
    try {
      // generate server-side PDF and attach
      let pdfPath;
      try {
        pdfPath = await generateQuotationPdf(quotation);
      } catch (genErr) {
        console.error('PDF generation error:', genErr);
      }

      await sendQuotationConfirmation(email, firstName, productsOfInterest, quantity, pdfPath);
    } catch (emailError) {
      console.error('Failed to send quotation confirmation email:', emailError);
      // Don't fail the API call if email fails
    }

    res.status(201).json({
      message: 'Quotation request submitted successfully',
      quotationId: quotation._id,
    });
  } catch (error) {
    console.error('Create quotation error:', error);
    res.status(500).json({ message: 'Failed to submit quotation request' });
  }
};

export const listQuotations = async (req, res) => {
  try {
    const quotations = useMongo()
      ? await Quotation.find().sort({ createdAt: -1 })
      : await listLocalQuotations();
    res.json(quotations);
  } catch (error) {
    console.error('List quotations error:', error);
    const quotations = await listLocalQuotations();
    res.json(quotations);
  }
};

export const getQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = useMongo()
      ? await Quotation.findById(id)
      : await getLocalQuotationById(id);

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    res.json(quotation);
  } catch (error) {
    console.error('Get quotation error:', error);
    res.status(500).json({ message: 'Failed to fetch quotation' });
  }
};

export const updateQuotationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'replied', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const quotation = useMongo()
      ? await Quotation.findByIdAndUpdate(id, { status }, { new: true })
      : await updateLocalQuotationStatus(id, status);

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    res.json(quotation);
  } catch (error) {
    console.error('Update quotation status error:', error);
    res.status(500).json({ message: 'Failed to update quotation status' });
  }
};

export const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = useMongo()
      ? await Quotation.findByIdAndDelete(id)
      : await deleteLocalQuotation(id);

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    res.json({ message: 'Quotation deleted successfully' });
  } catch (error) {
    console.error('Delete quotation error:', error);
    res.status(500).json({ message: 'Failed to delete quotation' });
  }
};
