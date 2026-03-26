import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { streamChat } from "../services/chatAgent.js";

const router = express.Router();

/**
 * POST /api/agent/chat
 *
 * Protected SSE endpoint that streams the chatbot response.
 * Requires Bearer token in Authorization header.
 *
 * Request body:
 *   { "message": "string", "mode": "faster" | "smarter" }
 *
 * SSE event types sent to the client:
 *   event: progress   data: { "status": "..." }
 *   event: token      data: { "token": "..." }
 *   event: error      data: { "error": "..." }
 */
router.post("/", protect, async (req, res) => {
  const { message, mode } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  const userId = req.user._id.toString();

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  // Handle client disconnect
  let closed = false;
  res.on("close", () => {
    closed = true;
  });

  const sendSSE = (event, data) => {
    if (closed) return;
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    await streamChat(message, {
      userId,
      mode: mode || "faster",
      onToken: (token) => sendSSE("token", { token }),
      onProgress: (status) => sendSSE("progress", { status }),
    });

    res.end();
  } catch (err) {
    console.error("Chat stream error:", err);
    sendSSE("error", { error: err.message });
    res.end();
  }
});

export default router;
