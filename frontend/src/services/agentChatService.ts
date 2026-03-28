export type ChatMode = "faster" | "smarter";

export interface StreamHandlers {
  onProgress?: (status: string) => void;
  onToken?: (token: string) => void;
  onError?: (error: string) => void;
  onDone?: () => void;
}

const API_BASE_URL = "http://127.0.0.1:5050/api";

function processEventBlock(eventBlock: string, handlers: StreamHandlers) {
  const lines = eventBlock.split("\n");
  let eventType = "";
  let data = "";

  for (const line of lines) {
    if (line.startsWith("event:")) {
      eventType = line.replace("event:", "").trim();
    } else if (line.startsWith("data:")) {
      data += line.replace("data:", "").trim();
    }
  }

  if (!eventType || !data) return;

  try {
    const parsed = JSON.parse(data);

    if (eventType === "progress") {
      handlers.onProgress?.(parsed.status || "");
    } else if (eventType === "token") {
      handlers.onToken?.(parsed.token || "");
    } else if (eventType === "error") {
      handlers.onError?.(parsed.error || "Unknown chatbot error");
    }
  } catch {
    handlers.onError?.("Failed to parse chatbot response");
  }
}

export async function streamAgentChat(
  message: string,
  token: string,
  mode: ChatMode,
  handlers: StreamHandlers
) {
  const response = await fetch(`${API_BASE_URL}/agent/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ message, mode }),
  });

  if (!response.ok) {
    let errorMessage = "Chat request failed";

    try {
      const errorData = await response.json();
      errorMessage = errorData?.error || errorData?.message || errorMessage;
    } catch {
      //
    }

    handlers.onError?.(errorMessage);
    return;
  }

  if (!response.body) {
    handlers.onError?.("No stream received from server");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      if (buffer.trim()) {
        const blocks = buffer.split("\n\n").filter(Boolean);
        for (const block of blocks) {
          processEventBlock(block, handlers);
        }
      }

      handlers.onDone?.();
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    const eventBlocks = buffer.split("\n\n");
    buffer = eventBlocks.pop() || "";

    for (const block of eventBlocks) {
      if (block.trim()) {
        processEventBlock(block, handlers);
      }
    }
  }
}