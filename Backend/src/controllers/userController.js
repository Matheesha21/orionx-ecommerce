import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import EmailOtp from "../models/EmailOtp.js";
import { sendOtpEmail } from "../config/mailer.js";

const OTP_TTL_MINUTES = 10;

// @desc    Register user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [emailExists, usernameExists] = await Promise.all([
      User.findOne({ email: normalizedEmail }),
      User.findOne({ username: username?.trim() }),
    ]);

    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    if (usernameExists) {
      return res.status(400).json({ message: "Username already in use" });
    }

    const now = new Date();
    const verifiedOtp = await EmailOtp.findOne({
      email: normalizedEmail,
      verifiedAt: { $ne: null },
      expiresAt: { $gt: now },
    }).sort({ verifiedAt: -1 });

    if (!verifiedOtp) {
      return res.status(400).json({ message: "Email is not verified" });
    }

    const user = await User.create({
      username,
      email: normalizedEmail,
      password,
      isEmailVerified: true,
    });

    await EmailOtp.deleteMany({ email: normalizedEmail });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];
      const fieldName = field === "email" ? "Email" : "Username";
      return res.status(400).json({ message: `${fieldName} already in use` });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request email OTP
export const requestEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await EmailOtp.create({
      email: normalizedEmail,
      otpHash,
      expiresAt,
    });

    await sendOtpEmail(normalizedEmail, otp);

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify email OTP
export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const now = new Date();
    const otpRecords = await EmailOtp.find({
      email: normalizedEmail,
      expiresAt: { $gt: now },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    if (otpRecords.length === 0) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    let matchedRecord = null;
    for (const record of otpRecords) {
      const isMatch = await bcrypt.compare(otp, record.otpHash);
      if (isMatch) {
        matchedRecord = record;
        break;
      }
    }

    if (!matchedRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    matchedRecord.verifiedAt = new Date();
    await matchedRecord.save();

    res.status(200).json({ message: "Email verified" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += qty || 1;
    } else {
      user.cart.push({ product: productId, quantity: qty || 1 });
    }

    await user.save();
    const populatedUser = await User.findById(req.user._id).populate("cart.product");

    res.status(200).json({
      message: "Cart updated",
      cart: populatedUser.cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (qty <= 0) {
      user.cart.splice(itemIndex, 1);
    } else {
      user.cart[itemIndex].quantity = qty;
    }

    await user.save();
    const populatedUser = await User.findById(req.user._id).populate("cart.product");

    res.status(200).json({ cart: populatedUser.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();
    const populatedUser = await User.findById(req.user._id).populate("cart.product");

    res.status(200).json({ cart: populatedUser.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyExists = user.wishlist.some(
      (item) => item.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    const populatedUser = await User.findById(req.user._id).populate("wishlist");

    res.status(200).json({
      message: "Added to wishlist",
      wishlist: populatedUser.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    const populatedUser = await User.findById(req.user._id).populate("wishlist");

    res.status(200).json({
      message: "Removed from wishlist",
      wishlist: populatedUser.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};