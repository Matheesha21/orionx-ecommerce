import Quotation from '../models/Quotation.js';
import { sendQuotationConfirmation } from '../config/mailer.js';

export const createQuotation = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, productsOfInterest, quantity, additionalDetails } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !productsOfInterest || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create quotation
    const quotation = new Quotation({
      firstName,
      lastName,
      email,
      phone,
      company,
      productsOfInterest,
      quantity,
      additionalDetails,
    });

    await quotation.save();

    // Send confirmation email to customer
    try {
      await sendQuotationConfirmation(email, firstName, productsOfInterest, quantity);
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
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    console.error('List quotations error:', error);
    res.status(500).json({ message: 'Failed to fetch quotations' });
  }
};

export const getQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findById(id);

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

    const quotation = await Quotation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

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
    const quotation = await Quotation.findByIdAndDelete(id);

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    res.json({ message: 'Quotation deleted successfully' });
  } catch (error) {
    console.error('Delete quotation error:', error);
    res.status(500).json({ message: 'Failed to delete quotation' });
  }
};
