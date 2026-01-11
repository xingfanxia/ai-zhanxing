"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  endpoint: string;
  contextId: string;
  contextType: "astrology" | "tarot";
  initialContext?: string;
}

export function ChatInterface({
  endpoint,
  contextId,
  contextType,
  initialContext,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contextId,
          contextType,
          message: userMessage,
          context: initialContext,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const accentColor = contextType === "astrology" ? "purple" : "pink";

  return (
    <div className="flex flex-col h-[400px] rounded-lg border border-slate-700/50 bg-slate-900/30 overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Ask a follow-up question about your reading...
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      accentColor === "purple"
                        ? "bg-purple-500/20"
                        : "bg-pink-500/20"
                    }`}
                  >
                    <Sparkles
                      className={`w-4 h-4 ${
                        accentColor === "purple"
                          ? "text-purple-400"
                          : "text-pink-400"
                      }`}
                    />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-slate-700/50 text-slate-200"
                      : accentColor === "purple"
                      ? "bg-purple-500/10 text-slate-200 border border-purple-500/20"
                      : "bg-pink-500/10 text-slate-200 border border-pink-500/20"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                accentColor === "purple" ? "bg-purple-500/20" : "bg-pink-500/20"
              }`}
            >
              <Loader2
                className={`w-4 h-4 animate-spin ${
                  accentColor === "purple" ? "text-purple-400" : "text-pink-400"
                }`}
              />
            </div>
            <div
              className={`rounded-lg px-4 py-2 ${
                accentColor === "purple"
                  ? "bg-purple-500/10 border border-purple-500/20"
                  : "bg-pink-500/10 border border-pink-500/20"
              }`}
            >
              <p className="text-sm text-slate-400">Thinking...</p>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-700/50 p-4 flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your reading..."
          className="flex-1 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
          disabled={isLoading}
        />
        <Button
          type="submit"
          variant="mystical"
          size="icon"
          disabled={isLoading || !input.trim()}
          className={
            accentColor === "pink"
              ? "from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              : ""
          }
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
