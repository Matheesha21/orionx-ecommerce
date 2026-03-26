import express from "express";
import { streamChat } from "../services/chatAgent.js";

const router = express.Router();

/**
 * POST /api/agent/chat
 *
 * SSE endpoint that streams the chatbot response.
 *
 * Request body:
 *   { "message": "string", "mode": "faster" | "smarter" }
 *
 * SSE event types sent to the client:
 *   event: progress   data: { "status": "initializing" | "generating" | "done" }
 *   event: token      data: { "token": "..." }
 *   event: error      data: { "error": "..." }
 */
router.post("/", async (req, res) => {
  const { message, mode } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // disable nginx buffering
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
