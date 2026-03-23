const express = require("express");
const router = express.Router();
const { getChatbotProducts, getBusinessInfo } = require("../controllers/chatbotController");

router.get("/products", getChatbotProducts);
router.get("/info", getBusinessInfo);

module.exports = router;