import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/models.js";

/**
 * In-memory store: userId → { buffer, summary, lastAccessedAt }
 *
 * Custom implementation of ConversationSummaryBufferMemory:
 *  - buffer: array of recent { human, ai } exchanges
 *  - summary: string summarizing older exchanges
 *  - When the buffer exceeds MAX_BUFFER_PAIRS, the oldest exchanges
 *    are folded into the summary using the faster LLM.
 */
const store = new Map();

const MAX_BUFFER_PAIRS = 4; // keep last 4 exchanges in full (~500 tokens)
const TTL_MS = 5 * 60 * 1000; // 5 minutes
const CLEANUP_INTERVAL_MS = 60 * 1000; // check every 1 minute

const SUMMARIZE_PROMPT = `Progressively summarize the lines of conversation provided, adding onto the previous summary.
Return a new concise summary of the entire conversation so far.

EXAMPLE
Current summary: The human asked about gaming laptops. The AI recommended three options.
New lines of conversation:
Human: Which one has the best battery?
AI: The ASUS ROG has 10-hour battery life, the best among the three.
New summary: The human asked about gaming laptops. The AI recommended three options. The human asked about battery life, and the AI said the ASUS ROG has the best at 10 hours.
END OF EXAMPLE

Current summary: {summary}
New lines of conversation:
{new_lines}
New summary:`;

/**
 * Returns the memory entry for a user, creating one if it doesn't exist.
 */
const getEntry = (userId) => {
  let entry = store.get(userId);

  if (!entry) {
    entry = { buffer: [], summary: "", lastAccessedAt: Date.now() };
    store.set(userId, entry);
  }

  entry.lastAccessedAt = Date.now();
  return entry;
};

/**
 * Summarizes the oldest exchanges and folds them into the summary string.
 */
const compactBuffer = async (entry) => {
  if (entry.buffer.length <= MAX_BUFFER_PAIRS) return;

  // Pull out the exchanges that need summarizing (everything except the last MAX_BUFFER_PAIRS)
  const toSummarize = entry.buffer.splice(0, entry.buffer.length - MAX_BUFFER_PAIRS);

  const newLines = toSummarize
    .map((ex) => `Human: ${ex.human}\nAI: ${ex.ai}`)
    .join("\n");

  const prompt = SUMMARIZE_PROMPT
    .replace("{summary}", entry.summary || "None yet.")
    .replace("{new_lines}", newLines);

  try {
    const llm = getModel("faster", false);
    const result = await llm.invoke([new HumanMessage(prompt)]);
    entry.summary = typeof result.content === "string" ? result.content : "";
  } catch (err) {
    console.error("[MemoryStore] Summarization failed:", err.message);
    // Keep the old summary as-is; don't lose data
  }
};

/**
 * Loads conversation history as LangChain message objects.
 * Returns an array of messages to inject between SystemMessage and the new HumanMessage.
 */
export const loadHistory = (userId) => {
  const entry = getEntry(userId);
  const messages = [];

  // Prepend summary as a system-level context if it exists
  if (entry.summary) {
    messages.push(new SystemMessage(`Previous conversation summary: ${entry.summary}`));
  }

  // Add buffered exchanges as full messages
  for (const ex of entry.buffer) {
    messages.push(new HumanMessage(ex.human));
    messages.push(new AIMessage(ex.ai));
  }

  return messages;
};

/**
 * Saves a new human/AI exchange and compacts the buffer if needed.
 */
export const saveExchange = async (userId, humanMsg, aiMsg) => {
  const entry = getEntry(userId);
  entry.buffer.push({ human: humanMsg, ai: aiMsg });
  await compactBuffer(entry);
};

/**
 * Removes memory entries that haven't been accessed in the last 5 minutes.
 */
const cleanup = () => {
  const now = Date.now();
  for (const [userId, entry] of store) {
    if (now - entry.lastAccessedAt > TTL_MS) {
      store.delete(userId);
      console.log(`[MemoryStore] Cleaned up memory for user ${userId}`);
    }
  }
};

// Start the cleanup scheduler
const cleanupTimer = setInterval(cleanup, CLEANUP_INTERVAL_MS);
cleanupTimer.unref();

export const getStoreSize = () => store.size;
