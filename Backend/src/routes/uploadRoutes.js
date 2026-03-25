import express from "express";
import multer from "multer";
import path from "path";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  const isValidExtension = allowedExtensions.includes(ext);
  const isValidMimeType = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ].includes(file.mimetype);

  if (isValidExtension || isValidMimeType) {
    cb(null, true);
  } else {
    cb(new Error("Invalid image file format"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

router.post("/", protect, adminOnly, (req, res) => {
  upload.single("image")(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "File too large. Max size is 5MB" });
        }
        return res.status(400).json({ message: err.message });
      }

      if (err) {
        return res.status(400).json({ message: err.message || "Upload failed" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }

      const mimeType = req.file.mimetype || "image/jpeg";
      const fileBase64 = `data:${mimeType};base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(fileBase64, {
        folder: "orionx_products",
      });

      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: result.secure_url,
        public_id: result.public_id,
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      res.status(500).json({
        message: error.message || "Image upload failed",
      });
    }
  });
});

export default router;