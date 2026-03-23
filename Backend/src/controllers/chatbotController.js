const Product = require("../models/Product");

// @desc    Get simplified product list for Chatbot context
// @route   GET /api/chatbot/products
exports.getChatbotProducts = async (req, res) => {
  try {
    const products = await Product.find({ inStock: true });
    
    // Mapping to the specific format requested by your contributor
    const formattedProducts = products.map(p => ({
      name: p.name,
      category: p.category,
      subcategory: p.subcategory || "N/A",
      price: p.price,
      discount: p.discountPercentage || 0,
      description: p.description,
      short_description: p.shortDescription,
      stock: p.stockCount
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: "Chatbot data error", error: error.message });
  }
};

// @desc    Static business info for Chatbot FAQ
// @route   GET /api/chatbot/business-info
exports.getBusinessInfo = (req, res) => {
  res.json({
    company_name: "ORIONX (PVT) LTD",
    contacts: "support@orionx.com",
    payment_options: ["Card", "Bank Transfer", "Cash on Delivery"],
    faq: [
      { q: "Delivery time?", a: "3-5 business days." },
      { q: "Warranty?", a: "Standard 1-year warranty on electronics." }
    ],
    policy: "Returns accepted within 7 days of delivery."
  });
};