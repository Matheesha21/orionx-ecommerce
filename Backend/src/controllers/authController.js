import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../lib/prisma.js";

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

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const buildDuplicateAccountMessage = (existingUser) => {
  if (existingUser?.authType === "GOOGLE") {
    return "An account with this email already exists and uses Google sign-in. Please continue with Google.";
  }

  return "An account with this email already exists. Please sign in or use Forgot password.";
};

// @desc Register user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();
    const baseName = (username || buildNameFromEmail(normalizedEmail)).trim() || buildNameFromEmail(normalizedEmail);

    if (!normalizedEmail) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        message: buildDuplicateAccountMessage(existingUser),
        code: "USER_ALREADY_EXISTS",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uniqueUsername = await createUniqueUsername(baseName);

    const user = await prisma.user.create({
      data: {
        username: uniqueUsername,
        email: normalizedEmail,
        password: hashedPassword,
        isAdmin: false,
        authType: "EMAIL",
      },
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user.id),
    });
  } catch (error) {
    // Handle common DB connectivity errors with a clearer response
    const msg = (error && error.message) ? String(error.message) : 'Internal server error';

    if (msg.includes('pool timeout') || msg.includes('Access denied') || msg.includes('Prisma client not initialized')) {
      return res.status(503).json({
        message: 'Registration temporarily unavailable due to database connectivity issues. Please try again later.',
        code: 'DB_CONNECTION_ERROR',
      });
    }

    res.status(500).json({
      message: msg,
    });
  }
};

// @desc Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Get current user
export const getMe = async (req, res) => {
  res.json(req.user);
};