import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: String,
      default: "",
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    images: {
      type: [String],
      default: [],
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    discountPercentage: {
      type: Number,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;