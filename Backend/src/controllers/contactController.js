import prisma from "../lib/prisma.js";
import { sendContactNotification, sendContactReply } from "../config/mailer.js";

const serializeContactMessage = (message) => ({
  id: String(message.id),
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

    const contactMessage = await prisma.contactMessage.create({
      data: {
      name,
      email,
      subject,
      message,
      },
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
    const messages = await prisma.contactMessage.findMany({
      where: status && status !== "all" ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

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
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid message id" });
    }

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

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: updates,
    });

    res.json({
      success: true,
      data: serializeContactMessage(updated),
    });
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(500).json({ message: error.message || "Failed to update message" });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid message id" });
    }

    await prisma.contactMessage.delete({ where: { id } });

    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(500).json({ message: error.message || "Failed to delete message" });
  }
};

export const replyToContactMessage = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid message id" });
    }

    const { replyMessage, adminNotes } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const contactMessage = await prisma.contactMessage.findUnique({ where: { id } });

    if (!contactMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    await sendContactReply(contactMessage, replyMessage.trim());

    const updatedContactMessage = await prisma.contactMessage.update({
      where: { id },
      data: {
        status: "replied",
        repliedAt: new Date(),
        ...(typeof adminNotes === "string" ? { adminNotes } : {}),
      },
    });

    res.json({
      success: true,
      message: "Reply sent successfully",
      data: serializeContactMessage(updatedContactMessage),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to send reply" });
  }
};