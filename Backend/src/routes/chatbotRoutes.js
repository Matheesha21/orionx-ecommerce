import express from "express";
import { getChatbotProducts, getBusinessInfo } from "../controllers/chatbotController.js";

const router = express.Router();

router.get("/products", getChatbotProducts);
router.get("/info", getBusinessInfo);

export default router;