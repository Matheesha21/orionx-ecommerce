import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  MessageCircle,
  X,
  Send,
  Sparkles,
  Tag,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { streamAgentChat } from "../../services/agentChatService";
import { productsApi } from "../../services/productService";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type ProductItem = {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  description?: string;
  shortDescription?: string;
  images?: string[];
  stockCount?: number;
  isFeatured?: boolean;
  isOnSale?: boolean;
  discountPercentage?: number;
};

const QUICK_PROMPTS = [
  "Help me find a laptop",
  "Show me the best deals",
  "Recommend a gaming laptop",
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

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(value);
};

export function AgentChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [dealsLoading, setDealsLoading] = useState(false);
  const [deals, setDeals] = useState<ProductItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const hasMessages = messages.length > 0;

  const topDeals = useMemo(() => {
    if (!deals.length) return [];

    return [...deals]
      .sort((a, b) => {
        const discountA =
          a.discountPercentage ||
          ((a.originalPrice && a.originalPrice > a.price)
            ? Math.round(((a.originalPrice - a.price) / a.originalPrice) * 100)
            : 0);

        const discountB =
          b.discountPercentage ||
          ((b.originalPrice && b.originalPrice > b.price)
            ? Math.round(((b.originalPrice - b.price) / b.originalPrice) * 100)
            : 0);

        return discountB - discountA;
      })
      .slice(0, 4);
  }, [deals]);

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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    const loadDeals = async () => {
      try {
        setDealsLoading(true);

        const response = await productsApi.getAll({
          page: 1,
          limit: 12,
        });

        const products =
          response?.products ||
          response?.data?.products ||
          response?.data ||
          [];

        const safeProducts = Array.isArray(products) ? products : [];

        const onSaleProducts = safeProducts.filter((p: ProductItem) => {
          return (
            p.isOnSale ||
            (p.discountPercentage && p.discountPercentage > 0) ||
            (p.originalPrice && p.originalPrice > p.price)
          );
        });

        setDeals(onSaleProducts.length > 0 ? onSaleProducts : safeProducts.slice(0, 4));
      } catch (error) {
        console.error("Failed to load chatbot deals:", error);
        setDeals([]);
      } finally {
        setDealsLoading(false);
      }
    };

    if (isOpen && deals.length === 0) {
      loadDeals();
    }
  }, [isOpen, deals.length]);

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setProgressText("");
    setIsStreaming(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

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

    await streamAgentChat(finalMessage, token, "faster", {
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

      onError: () => {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: "Something went wrong with the chat. Please try again.",
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
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-[60]">
          <motion.button
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-3 rounded-full bg-primary text-white shadow-2xl px-5 py-3 hover:scale-[1.02] transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden sm:block font-medium">Ask ORIONX</span>
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatBoxRef}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 right-5 z-[70] w-[92vw] max-w-[430px] h-[78vh] max-h-[780px] rounded-3xl border border-border bg-background shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">ORIONX Assistant</h3>
                  <p className="text-xs text-white/80">
                    Smart shopping help for your store
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNewChat}
                  className="px-3 py-1.5 rounded-xl text-xs bg-white/10 hover:bg-white/20 transition"
                >
                  New Chat
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="h-[calc(78vh-88px)] flex flex-col">
              {!hasMessages ? (
                <>
                  <div className="flex-1 overflow-y-auto px-4 py-4 bg-background">
                    <div className="rounded-3xl border border-border bg-white shadow-sm p-5 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                          <Sparkles className="w-6 h-6" />
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-text-primary">
                            Welcome to ORIONX
                          </h4>
                          <p className="text-sm text-text-secondary mt-1 leading-6">
                            Ask for laptops, accessories, recommendations, or deals.
                            I’ll help you shop faster.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {QUICK_PROMPTS.map((prompt) => (
                          <button
                            key={prompt}
                            onClick={() => handleSend(prompt)}
                            className="text-xs px-3 py-2 rounded-full bg-background border border-border text-text-secondary hover:text-text-primary hover:border-primary/30 transition"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        <h4 className="text-sm font-semibold text-text-primary">
                          Hot deals of the day
                        </h4>
                      </div>

                      <Link
                        to="/shop"
                        className="text-xs text-primary font-medium flex items-center gap-1"
                      >
                        View all
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {dealsLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-border bg-white p-3 animate-pulse"
                          >
                            <div className="flex gap-3">
                              <div className="w-16 h-16 rounded-xl bg-surface" />
                              <div className="flex-1">
                                <div className="h-4 bg-surface rounded w-3/4 mb-2" />
                                <div className="h-3 bg-surface rounded w-1/2 mb-2" />
                                <div className="h-4 bg-surface rounded w-1/3" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : topDeals.length > 0 ? (
                      <div className="space-y-3">
                        {topDeals.map((product, index) => {
                          const discount =
                            product.discountPercentage ||
                            ((product.originalPrice && product.originalPrice > product.price)
                              ? Math.round(
                                  ((product.originalPrice - product.price) /
                                    product.originalPrice) *
                                    100
                                )
                              : 0);

                          return (
                            <div
                              key={product._id || product.id || `${product.name}-${index}`}
                              className="rounded-2xl border border-border bg-white p-3 shadow-sm"
                            >
                              <div className="flex gap-3">
                                <img
                                  src={product.images?.[0] || "/placeholder-product.png"}
                                  alt={product.name}
                                  className="w-16 h-16 rounded-xl object-cover border border-border"
                                />

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <h5 className="text-sm font-semibold text-text-primary line-clamp-2">
                                      {product.name}
                                    </h5>

                                    {discount > 0 && (
                                      <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-full bg-primary/10 text-primary">
                                        {discount}% OFF
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs text-text-secondary mt-1">
                                    {product.brand || product.category || "ORIONX Product"}
                                  </p>

                                  <div className="mt-2 flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-bold text-primary">
                                        {formatPrice(product.price)}
                                      </p>

                                      {product.originalPrice &&
                                        product.originalPrice > product.price && (
                                          <p className="text-xs text-text-secondary line-through">
                                            {formatPrice(product.originalPrice)}
                                          </p>
                                        )}
                                    </div>

                                    {product.slug ? (
                                      <Link
                                        to={`/product/${product.slug}`}
                                        className="text-xs px-3 py-2 rounded-xl bg-primary text-white hover:opacity-90 transition"
                                      >
                                        View
                                      </Link>
                                    ) : (
                                      <Link
                                        to="/shop"
                                        className="text-xs px-3 py-2 rounded-xl bg-primary text-white hover:opacity-90 transition"
                                      >
                                        Browse
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-border bg-white p-4 text-sm text-text-secondary">
                        No deals available right now.
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border bg-white p-4">
                    <div className="flex items-center gap-3">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Ask me anything about products..."
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
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto px-4 py-4 bg-background">
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
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Type your message..."
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
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}