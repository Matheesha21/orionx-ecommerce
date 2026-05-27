import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    next();
  } catch (error) {
    res.status(401).json({
      message: "Token not valid",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({
      message: "Admin access only",
    });
  }
};