const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// GET ALL PRODUCTS WITH SEARCH + FILTERS + SORT
router.get("/", async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      featured,
      onSale,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const filters = {};

    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filters.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (brand) {
      filters.brand = { $regex: `^${brand}$`, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    if (inStock === "true") {
      filters.stockCount = { $gt: 0 };
    }

    if (featured === "true") {
      filters.isFeatured = true;
    }

    if (onSale === "true") {
      filters.isOnSale = true;
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price_asc") {
      sortOption = { price: 1 };
    } else if (sort === "price_desc") {
      sortOption = { price: -1 };
    } else if (sort === "name_asc") {
      sortOption = { name: 1 };
    } else if (sort === "name_desc") {
      sortOption = { name: -1 };
    } else if (sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Product.countDocuments(filters);

    const products = await Product.find(filters)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    res.json({
      data: products,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
});

// GET SINGLE PRODUCT BY SLUG
router.get("/slug/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
});

// CREATE PRODUCT
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    console.log("CREATE PRODUCT BODY:", req.body);

    const product = new Product(req.body);
    const savedProduct = await product.save();

    console.log("PRODUCT CREATED:", savedProduct._id, savedProduct.name);

    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
});

// UPDATE PRODUCT
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
});

// DELETE PRODUCT
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
});

module.exports = router;