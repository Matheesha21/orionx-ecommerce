import express from "express";
import { getBusinessInfo } from "../controllers/infoController.js";

const router = express.Router();

router.get("/", getBusinessInfo);

export default router;