const express = require("express");
const router = express.Router();
const { getBusinessInfo } = require("../controllers/infoController");

router.get("/", getBusinessInfo);

module.exports = router;