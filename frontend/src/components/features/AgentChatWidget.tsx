import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  MessageCircle,
  X,
  Send,
  Sparkles,
  Cpu,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { streamAgentChat, ChatMode } from "../../services/agentChatService";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const QUICK_PROMPTS = [
  "Help me find a laptop",
  "What are the best deals?",
  "Recommend a gaming PC",
  "Suggest accessories for students",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <motion.span
        className="w-2 h-2 rounded-full bg-primary/70"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <motion.span
        className="w-2 h-2 rounded-full bg-primary/70"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
      />
      <motion.span
        className="w-2 h-2 rounded-full bg-primary/70"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
      />
    </div>
  );
}

export function AgentChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ChatMode>("faster");
  const [isStreaming, setIsStreaming] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "Hi, I’m the ORIONX assistant. I can help you find products, compare options, and answer shopping questions.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, progressText, isStreaming]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        chatBoxRef.current &&
        !chatBoxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = async (preset?: string) => {
    const finalMessage = (preset ?? input).trim();
    if (!finalMessage || isStreaming) return;

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: {
          from: { pathname: window.location.pathname },
        },
      });
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        text: finalMessage,
      },
    ]);

    setInput("");
    setIsStreaming(true);
    setProgressText("Preparing a response...");

    let assistantStarted = false;

    await streamAgentChat(finalMessage, token, mode, {
      onProgress: (status) => {
        if (status && status !== "done") {
          setProgressText(status);
        }
      },

      onToken: (tokenChunk) => {
        if (!assistantStarted) {
          assistantStarted = true;

          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              text: tokenChunk,
            },
          ]);
        } else {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];

            if (last && last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                text: last.text + tokenChunk,
              };
            }

            return updated;
          });
        }
      },

      onError: (error) => {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: `Error: ${error}`,
          },
        ]);
        setIsStreaming(false);
        setProgressText("");
      },

      onDone: () => {
        setIsStreaming(false);
        setProgressText("");
      },
    });
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[60]">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              onClick={() => setIsOpen(true)}
              className="group flex items-center gap-3 rounded-full bg-primary text-white shadow-2xl px-5 py-3 hover:scale-[1.02] transition"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:block font-medium">Ask ORIONX</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatBoxRef}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 right-5 z-[70] w-[92vw] max-w-[430px] h-[75vh] max-h-[760px] rounded-3xl border border-border bg-background shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">ORIONX Assistant</h3>
                  <p className="text-xs text-white/80">
                    Streaming AI shopping help
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-3 border-b border-border bg-surface/70">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode("faster")}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition ${
                    mode === "faster"
                      ? "bg-primary text-white"
                      : "bg-white border border-border text-text-secondary"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 inline mr-1" />
                  Faster
                </button>

                <button
                  onClick={() => setMode("smarter")}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition ${
                    mode === "smarter"
                      ? "bg-primary text-white"
                      : "bg-white border border-border text-text-secondary"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 inline mr-1" />
                  Smarter
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-xs px-3 py-2 rounded-full bg-white border border-border text-text-secondary hover:text-text-primary transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[calc(75vh-210px)] overflow-y-auto px-4 py-4 bg-background">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-white rounded-br-md"
                          : "bg-white border border-border text-text-primary rounded-bl-md shadow-sm"
                      }`}
                    >
                      <p className="text-sm leading-6 whitespace-pre-wrap">
                        {message.text}
                      </p>
                    </div>
                  </div>
                ))}

                {isStreaming && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] bg-white border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <TypingDots />
                        <span className="text-sm font-medium text-text-primary">
                          ORIONX Assistant
                        </span>
                      </div>

                      <p className="text-sm text-text-secondary leading-6">
                        {progressText || "Preparing a response..."}
                      </p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-border bg-white p-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about products, recommendations, or deals..."
                  className="flex-1 px-4 py-3 rounded-2xl border border-border bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <button
                  onClick={() => handleSend()}
                  disabled={isStreaming}
                  className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-60 transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <p className="text-[11px] text-text-secondary mt-2 px-1">
                Secure assistant for ORIONX customers. Login required.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}