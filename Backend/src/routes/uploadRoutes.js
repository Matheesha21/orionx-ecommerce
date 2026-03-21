const express = require("express");
const multer = require("multer");
const path = require("path");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log("Uploaded file name:", file.originalname);
  console.log("Uploaded file mimetype:", file.mimetype);

  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  const isValidExtension = allowedExtensions.includes(ext);
  const isValidMimeType =
    file.mimetype &&
    ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.mimetype);

  console.log("Extension valid:", isValidExtension);
  console.log("Mime valid:", isValidMimeType);

  if (isValidExtension || isValidMimeType) {
    cb(null, true);
  } else {
    cb(new Error("Invalid image file"), false);
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
      console.log("Multer error object:", err);

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

      const ext = path.extname(req.file.originalname).toLowerCase();
      let mimeType = "image/jpeg";

      if (ext === ".png") mimeType = "image/png";
      if (ext === ".webp") mimeType = "image/webp";

      const fileBase64 = `data:${mimeType};base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(fileBase64, {
        folder: "orionx_products",
      });

      // save imageUrl and public_id inside mongoDB

      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: result.secure_url,
        public_id: result.public_id,
      });
    } catch (error) {
      console.log("Cloudinary/server error:", error);
      res.status(500).json({
        message: error.message || "Image upload failed",
      });
    }
  });
});

module.exports = router;