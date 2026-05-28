import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import prisma from "../lib/prisma.js";
import { sendOtpEmail } from "../config/mailer.js";

const OTP_TTL_MINUTES = 10;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const buildNameFromEmail = (email) => {
  const localPart = (email || "").split("@")[0];
  const parts = localPart.split(/[._-]+/).filter(Boolean);

  if (parts.length === 0) {
    return localPart || "User";
  }

  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const createUniqueUsername = async (baseName) => {
  const trimmedBase = (baseName || "User").trim() || "User";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const suffix = attempt === 0 ? "" : ` ${Math.floor(1000 + Math.random() * 9000)}`;
    const candidate = `${trimmedBase}${suffix}`;
    const exists = await prisma.user.findUnique({ where: { username: candidate } });

    if (!exists) {
      return candidate;
    }
  }

  return `${trimmedBase} ${crypto.randomBytes(2).toString("hex")}`;
};

// @desc    Register user
export const registerUser = async (req, res) => {
  try {
    console.log('[registerUser] payload:', JSON.stringify(req.body));
    const { username, email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [emailExists] = await Promise.all([
      prisma.user.findUnique({ where: { email: normalizedEmail } }),
    ]);

    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const now = new Date();
    const verifiedOtp = await prisma.emailOtp.findFirst({
      where: {
        email: normalizedEmail,
        verifiedAt: { not: null },
        expiresAt: { gt: now },
      },
      orderBy: { verifiedAt: 'desc' },
    });

    if (!verifiedOtp) {
      return res.status(400).json({ message: "Email is not verified" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const baseName = (username || buildNameFromEmail(normalizedEmail)).trim() || buildNameFromEmail(normalizedEmail);
    const uniqueUsername = await createUniqueUsername(baseName);

    const createdUser = await prisma.user.create({
      data: {
        username: uniqueUsername,
        email: normalizedEmail,
        password: hashedPassword,
        authType: "EMAIL",
        isEmailVerified: true,
      },
    });

    await prisma.emailOtp.deleteMany({ where: { email: normalizedEmail } });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        authType: createdUser.authType,
        isEmailVerified: createdUser.isEmailVerified,
        isAdmin: createdUser.isAdmin,
      },
    });
  } catch (error) {
    console.error('[registerUser] error:', error);
    if (error?.code === 'P2002' || error?.code === 11000) {
      const fieldName = error?.meta?.target ? Array.isArray(error.meta.target) ? error.meta.target[0] : error.meta.target : 'Field';
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

    const userExists = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await prisma.emailOtp.create({
      data: {
        email: normalizedEmail,
        otpHash,
        expiresAt,
      },
    });

    try {
      await sendOtpEmail(normalizedEmail, otp);
      res.status(200).json({ message: "OTP sent" });
    } catch (err) {
      console.error("[requestEmailOtp] sendOtpEmail error:", err?.message || err);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }
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
    const otpRecords = await prisma.emailOtp.findMany({
      where: {
        email: normalizedEmail,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

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

    await prisma.emailOtp.update({
      where: { id: matchedRecord.id },
      data: { verifiedAt: new Date() },
    });

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

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        authType: user.authType || 'EMAIL',
        isEmailVerified: user.isEmailVerified || false,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { password: false, id: true, username: true, email: true, authType: true, isEmailVerified: true, isAdmin: true, cart: true, wishlist: true } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        authType: user.authType,
        isEmailVerified: user.isEmailVerified,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update current user profile
export const updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    const nextUsername = username?.trim();

    if (!nextUsername) {
      return res.status(400).json({ message: "Username is required" });
    }

    const existingUser = await prisma.user.findFirst({ where: { username: nextUsername, NOT: { id: req.user.id } } });

    if (existingUser) {
      return res.status(400).json({ message: "Username already in use" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updated = await prisma.user.update({ where: { id: req.user.id }, data: { username: nextUsername } });

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updated.id,
        username: updated.username,
        email: updated.email,
        authType: updated.authType,
        isEmailVerified: updated.isEmailVerified,
        isAdmin: updated.isAdmin,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ message: "Username already in use" });
    }

    res.status(500).json({ message: error.message });
  }
};

// @desc    Google login/signup
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    console.log("[googleLogin] Received request. hasCredential=", !!credential, "GOOGLE_CLIENT_ID=", !!process.env.GOOGLE_CLIENT_ID);

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google client ID is not configured" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ message: "Google account email not available" });
    }

    if (!payload.email_verified) {
      return res.status(400).json({ message: "Google email is not verified" });
    }

    const normalizedEmail = payload.email.toLowerCase().trim();

    // Try to find user in Prisma (MySQL). If not found, fall back to creating via Prisma.
    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      const baseName = buildNameFromEmail(normalizedEmail);
      const username = await createUniqueUsername(baseName);
      const randomPassword = crypto.randomBytes(32).toString("hex");

      const created = await prisma.user.create({
        data: {
          username,
          email: normalizedEmail,
          password: randomPassword,
          isAdmin: false,
        },
      });

      user = created;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        // Prisma schema does not yet have authType/isEmailVerified fields — synthesize them for compatibility
        authType: "GOOGLE",
        isEmailVerified: true,
        isAdmin: user.isAdmin || false,
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
    const uid = req.user.id;
    const productIdNum = Number(productId);

    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const cart = Array.isArray(user.cart) ? user.cart : [];

    const itemIndex = cart.findIndex((item) => Number(item.productId) === productIdNum);

    if (itemIndex > -1) {
      cart[itemIndex].quantity = (cart[itemIndex].quantity || 0) + (qty || 1);
    } else {
      cart.push({ productId: productIdNum, quantity: qty || 1 });
    }

    await prisma.user.update({ where: { id: uid }, data: { cart } });

    // populate product details
    const productIds = cart.map((c) => Number(c.productId));
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    const populatedCart = cart.map((c) => ({
      product: products.find((p) => p.id === Number(c.productId)) || { id: c.productId },
      quantity: c.quantity,
    }));

    res.status(200).json({ message: "Cart updated", cart: populatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const uid = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const cart = Array.isArray(user.cart) ? user.cart : [];
    const productIds = cart.map((c) => Number(c.productId));
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const populatedCart = cart.map((c) => ({
      product: products.find((p) => p.id === Number(c.productId)) || { id: c.productId },
      quantity: c.quantity,
    }));

    res.status(200).json({ cart: populatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const uid = req.user.id;
    const productIdNum = Number(productId);

    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const cart = Array.isArray(user.cart) ? user.cart : [];
    const itemIndex = cart.findIndex((item) => Number(item.productId) === productIdNum);
    if (itemIndex === -1) return res.status(404).json({ message: "Item not in cart" });

    if (qty <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = qty;
    }

    await prisma.user.update({ where: { id: uid }, data: { cart } });

    const productIds = cart.map((c) => Number(c.productId));
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const populatedCart = cart.map((c) => ({
      product: products.find((p) => p.id === Number(c.productId)) || { id: c.productId },
      quantity: c.quantity,
    }));

    res.status(200).json({ cart: populatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const uid = req.user.id;
    const productIdNum = Number(productId);

    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const cart = Array.isArray(user.cart) ? user.cart : [];
    const newCart = cart.filter((item) => Number(item.productId) !== productIdNum);

    await prisma.user.update({ where: { id: uid }, data: { cart: newCart } });

    const productIds = newCart.map((c) => Number(c.productId));
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const populatedCart = newCart.map((c) => ({
      product: products.find((p) => p.id === Number(c.productId)) || { id: c.productId },
      quantity: c.quantity,
    }));

    res.status(200).json({ cart: populatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const uid = req.user.id;
    const productIdNum = Number(productId);

    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const wishlist = Array.isArray(user.wishlist) ? user.wishlist : [];
    if (wishlist.some((id) => Number(id) === productIdNum)) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    wishlist.push(productIdNum);
    await prisma.user.update({ where: { id: uid }, data: { wishlist } });

    const products = await prisma.product.findMany({ where: { id: { in: wishlist } } });

    res.status(200).json({ message: "Added to wishlist", wishlist: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const uid = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const wishlist = Array.isArray(user.wishlist) ? user.wishlist : [];
    const products = await prisma.product.findMany({ where: { id: { in: wishlist } } });
    res.status(200).json({ wishlist: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const uid = req.user.id;
    const productIdNum = Number(productId);

    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const wishlist = Array.isArray(user.wishlist) ? user.wishlist : [];
    const newWishlist = wishlist.filter((id) => Number(id) !== productIdNum);

    await prisma.user.update({ where: { id: uid }, data: { wishlist: newWishlist } });

    const products = await prisma.product.findMany({ where: { id: { in: newWishlist } } });

    res.status(200).json({ message: "Removed from wishlist", wishlist: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};