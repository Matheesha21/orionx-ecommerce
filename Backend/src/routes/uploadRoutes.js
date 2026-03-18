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
    file.mimetype && file.mimetype.startsWith("image/");

  if (isValidMimeType || isValidExtension) {
    cb(null, true);
  } else {
    cb(new Error("Invalid image file"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

router.post("/", protect, adminOnly, (req, res) => {
  upload.single("image")(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ message: "File too large. Max size is 5MB" });
        }

        return res.status(400).json({ message: err.message });
      }

      if (err) {
        return res.status(400).json({
          message: err.message || "Upload failed",
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }

      const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(fileBase64, {
        folder: "orionx_products",
      });

      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: result.secure_url,
        public_id: result.public_id,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Image upload failed",
      });
    }
  });
});

module.exports = router;