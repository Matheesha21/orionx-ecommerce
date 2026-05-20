import ContactMessage from "../models/ContactMessage.js";
import { sendContactNotification, sendContactReply } from "../config/mailer.js";

const serializeContactMessage = (message) => ({
  id: message._id.toString(),
  name: message.name,
  email: message.email,
  subject: message.subject,
  message: message.message,
  status: message.status,
  adminNotes: message.adminNotes,
  repliedAt: message.repliedAt,
  createdAt: message.createdAt,
  updatedAt: message.updatedAt,
});

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    try {
      await sendContactNotification(contactMessage);
    } catch (mailError) {
      console.warn("Contact notification email skipped:", mailError.message);
    }

    res.status(201).json({
      message: "Message sent successfully",
      data: serializeContactMessage(contactMessage),
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to submit message" });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const { status } = req.query;
    const filters = {};

    if (status && status !== "all") {
      filters.status = status;
    }

    const messages = await ContactMessage.find(filters).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: messages.map(serializeContactMessage),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to load messages" });
  }
};

export const updateContactMessage = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const updates = {};

    if (status) {
      updates.status = status;
      if (status === "replied") {
        updates.repliedAt = new Date();
      }
    }

    if (typeof adminNotes === "string") {
      updates.adminNotes = adminNotes;
    }

    const updated = await ContactMessage.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({
      success: true,
      data: serializeContactMessage(updated),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update message" });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete message" });
  }
};

export const replyToContactMessage = async (req, res) => {
  try {
    const { replyMessage, adminNotes } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const contactMessage = await ContactMessage.findById(req.params.id);

    if (!contactMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    await sendContactReply(contactMessage, replyMessage.trim());

    contactMessage.status = "replied";
    contactMessage.repliedAt = new Date();
    if (typeof adminNotes === "string") {
      contactMessage.adminNotes = adminNotes;
    }

    await contactMessage.save();

    res.json({
      success: true,
      message: "Reply sent successfully",
      data: serializeContactMessage(contactMessage),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to send reply" });
  }
};