import prisma from "../lib/prisma.js";

// @desc    Get all products with filters, search, and pagination
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      featured,
      preOrder,
      onSale,
      hotDeal,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const where = {};

    if (search) where.name = { contains: search, mode: "insensitive" };
    if (category) where.category = { equals: category, mode: "insensitive" };
    if (brand) where.brand = { equals: brand, mode: "insensitive" };

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (inStock === "true") where.stockCount = { gt: 0 };
    if (featured === "true") where.isFeatured = true;
    if (onSale === "true") where.isOnSale = true;

    // Preserve API compatibility for existing query params even if not modeled yet.
    void preOrder;
    void hotDeal;

    let orderBy = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    else if (sort === "price_desc") orderBy = { price: "desc" };
    else if (sort === "name_asc") orderBy = { name: "asc" };
    else if (sort === "name_desc") orderBy = { name: "desc" };
    else if (sort === "newest") orderBy = { createdAt: "desc" };

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNumber,
      }),
    ]);

    res.json({
      data: products,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Get single product by slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
    });

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
      message: error.message,
    });
  }
};

// @desc    Create product (Admin)
export const createProduct = async (req, res) => {
  try {
    const savedProduct = await prisma.product.create({
      data: req.body,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// @desc    Update product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: req.body,
    });

    res.json(updatedProduct);
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    await prisma.product.delete({ where: { id } });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = Number.parseInt(req.params.id, 10);
    const userIdRaw = req.user?.id ?? req.user?._id;
    const userId = Number.parseInt(String(userIdRaw), 10);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    if (!Number.isInteger(userId)) {
      return res.status(401).json({ message: "Invalid user context" });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = await prisma.review.findFirst({
      where: {
        productId,
        userId,
      },
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    await prisma.review.create({
      data: {
        productId,
        userId,
        rating: Number(rating),
        comment,
      },
    });

    const reviewStats = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { id: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: reviewStats._avg.rating ?? 0,
        reviewCount: reviewStats._count.id,
      },
    });

    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};