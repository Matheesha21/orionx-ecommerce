import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";
import { googleLogin } from "../controllers/userController.js";
import { requestEmailOtp, verifyEmailOtp } from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.post("/request-otp", requestEmailOtp);
router.post("/verify-otp", verifyEmailOtp);
router.get("/me", protect, getMe);

export default router;