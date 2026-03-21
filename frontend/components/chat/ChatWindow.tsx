"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import { Send, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useProjectStore } from "@/stores/project-store";
import { getToken } from "@/lib/auth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const QUICK_ACTIONS = [
  "Refine the data model",
  "Add a new module",
  "Improve dashboard KPIs",
  "Adjust the sprint plan",
  "Explain the Theory of Change",
];

export default function ChatWindow() {
  const { currentProject } = useProjectStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = getToken();
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: { project: currentProject },
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-xl ios-gradient flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-[#080e0c]" />
            </div>
            <h3 className="font-semibold mb-2">Ask ImpactOS AI anything</h3>
            <p className="text-white/40 text-sm max-w-sm mx-auto">
              Refine your data model, add modules, adjust the sprint plan, or ask questions about your MIS design.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => setInput(action)}
                  className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:border-[#00d4aa]/30 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const textPart = msg.parts?.find((p: { type: string }) => p.type === "text") as
            | { type: "text"; text: string }
            | undefined;
          const content = textPart?.text ?? "";
          return (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-[#00d4aa]/15 border border-[#00d4aa]/20 text-white"
                    : "bg-[#0f1a17] border border-white/8 text-white/90"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  </div>
                ) : (
                  content
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#0f1a17] border border-white/8 rounded-xl px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-[#00d4aa]/60 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3 pt-4 border-t border-white/6">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your MIS design, request changes, or explore the data model..."
          className="flex-1 bg-[#0f1a17] border-white/10 min-h-[52px] max-h-32 resize-none text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }
          }}
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-[#00d4aa] text-[#080e0c] hover:bg-[#00d4aa]/90 h-[52px] w-[52px] p-0 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
