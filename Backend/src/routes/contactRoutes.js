import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  createContactMessage,
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
  replyToContactMessage,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContactMessage);
router.get("/", protect, adminOnly, getContactMessages);
router.patch("/:id", protect, adminOnly, updateContactMessage);
router.post("/:id/reply", protect, adminOnly, replyToContactMessage);
router.delete("/:id", protect, adminOnly, deleteContactMessage);

export default router;