"use client";
import { useEffect, useRef, useState } from "react";
import { useProjectStore } from "@/stores/project-store";
import { useChatStore } from "@/stores/chat-store";
import { getToken } from "@/lib/auth";
import { Send, MessageSquare, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatPage() {
  const { currentProject } = useProjectStore();
  const { messages, isStreaming, addMessage, appendToLast, setStreaming, clearMessages } =
    useChatStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || isStreaming) return;
    const token = getToken();
    if (!token) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input.trim(),
      createdAt: new Date(),
    };
    addMessage(userMsg);
    setInput("");
    setStreaming(true);

    // Add empty assistant message to stream into
    const assistantId = (Date.now() + 1).toString();
    addMessage({
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: new Date(),
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          project_name: currentProject?.name,
        }),
      });

      if (!res.ok || !res.body) {
        appendToLast("Sorry, I encountered an error. Please try again.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // Handle SSE format
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const text =
                parsed.choices?.[0]?.delta?.content ||
                parsed.delta?.text ||
                parsed.text ||
                "";
              if (text) appendToLast(text);
            } catch {
              // plain text chunk
              if (data && data !== "[DONE]") appendToLast(data);
            }
          }
        }
      }
    } catch {
      appendToLast("Connection error. Please check your network and try again.");
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const SUGGESTED_PROMPTS = [
    "Explain the data model for this project",
    "What are the key risks in the sprint plan?",
    "How should we handle data quality?",
    "Suggest additional KPIs for the dashboards",
  ];

  return (
    <div className="flex flex-col h-full -m-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/6 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/15 border border-[#7c3aed]/25 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-[#7c3aed]" />
        </div>
        <div>
          <div className="font-semibold text-sm">AI Chat</div>
          <div className="text-[10px] text-white/40">
            {currentProject?.project_title
              ? `Discussing: ${currentProject.project_title}`
              : "ImpactOS AI Assistant"}
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="ml-auto text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-[#7c3aed]/15 border border-[#7c3aed]/25 flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-[#7c3aed]" />
            </div>
            <h3 className="font-semibold mb-1">Ask ImpactOS AI</h3>
            <p className="text-sm text-white/40 mb-6 max-w-sm">
              Get expert guidance on your MIS blueprint, data model, modules, or
              implementation strategy.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="text-left text-xs px-3 py-2.5 rounded-lg bg-[#0f1a17] border border-white/8 text-white/50 hover:text-white hover:border-white/15 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-[#7c3aed]/15 border border-[#7c3aed]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-[#7c3aed]" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#00d4aa]/15 border border-[#00d4aa]/20 text-white/90"
                    : "bg-[#0f1a17] border border-white/8 text-white/80"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content || (isStreaming ? "▋" : "")}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-white/50" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-white/6">
        <div className="flex gap-3 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your blueprint... (Enter to send, Shift+Enter for new line)"
            className="flex-1 bg-[#0f1a17] border-white/10 min-h-[44px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="bg-[#7c3aed] text-white hover:bg-[#7c3aed]/90 h-11 w-11 p-0 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-white/25 mt-2">
          ImpactOS AI can make mistakes. Verify important recommendations.
        </p>
      </div>
    </div>
  );
}
