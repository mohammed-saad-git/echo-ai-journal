import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Sparkles, 
  User, 
  Loader2, 
  BookOpen, 
  CornerDownLeft, 
  X,
  FileText,
  RotateCcw
} from "lucide-react";
import { ChatMessage, JournalEntry } from "../types";
import { sendChatMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { 
  getDemoSessionConversation, 
  saveDemoSessionConversation, 
  INITIAL_DEMO_CONVERSATION 
} from "../lib/demoData";

interface ConversationViewProps {
  entries: JournalEntry[];
  focusEntry?: JournalEntry | null;
  onClearFocusEntry?: () => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  entries,
  focusEntry,
  onClearFocusEntry,
}) => {
  const { isDemo } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages: If in Demo Mode without a specific focus entry, load the pre-populated multi-turn demo conversation
  useEffect(() => {
    if (focusEntry) {
      setMessages([
        {
          id: "m_focus_init",
          sender: "echo",
          text: `I have your entry from ${new Date(focusEntry.createdAt).toLocaleDateString()} ready. We can explore its themes, or connect it to your broader thoughts. What's on your mind?`,
          timestamp: new Date().toISOString(),
        }
      ]);
    } else if (isDemo) {
      const demoConvo = getDemoSessionConversation();
      setMessages(demoConvo);
    } else if (messages.length === 0) {
      const initialText = `Hello. I've analyzed ${entries.length} of your journal ${entries.length === 1 ? "entry" : "entries"}. You can ask about patterns you've noticed, tensions you're wrestling with, or how your perspective has evolved. What would you like to explore?`;
      setMessages([
        {
          id: "m_init",
          sender: "echo",
          text: initialText,
          timestamp: new Date().toISOString(),
        }
      ]);
    }
  }, [entries.length, focusEntry, isDemo]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const quickQuestions = [
    "What patterns do you see in my recent entries?",
    "Why do I keep procrastinating?",
    "What has changed about how I think?",
    "What decisions have I been avoiding?",
    "What themes keep coming up?"
  ];

  const handleResetDemoConvo = () => {
    saveDemoSessionConversation(INITIAL_DEMO_CONVERSATION);
    setMessages(INITIAL_DEMO_CONVERSATION);
  };

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    if (isDemo && !focusEntry) {
      saveDemoSessionConversation(newHistory);
    }
    setInput("");
    setIsSending(true);

    try {
      // Backend receives conversation history + scoped user entries and calls real Gemini
      const res = await sendChatMessage(
        newHistory.map((m) => ({ sender: m.sender, text: m.text })),
        entries.slice(0, 10), // Pass user's top recent entries
        focusEntry?.id
      );

      const echoReply: ChatMessage = {
        id: `e_${Date.now()}`,
        sender: "echo",
        text: res.reply,
        timestamp: new Date().toISOString(),
      };

      const updatedWithReply = [...newHistory, echoReply];
      setMessages(updatedWithReply);
      if (isDemo && !focusEntry) {
        saveDemoSessionConversation(updatedWithReply);
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: "echo",
        text: "I encountered an issue connecting to your journal context. Please try asking again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col h-[calc(100vh-5rem)] md:h-screen">
      {/* Header */}
      <div className="pb-4 border-b border-[#E5E5E0] shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-light tracking-tight text-[#1A1A1A] flex items-center gap-2">
              <span>Talk to</span>
              <span className="font-serif italic font-semibold">Echo</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h1>
            <p className="text-xs text-[#6B6B66] mt-0.5">
              Multi-turn inquiry with your private journal context
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isDemo && (
              <button
                id="btn-reset-demo-chat"
                onClick={handleResetDemoConvo}
                title="Reset conversation back to demo baseline"
                className="px-2.5 py-1 rounded-full bg-white hover:bg-[#F5F5F0] border border-[#E5E5E0] text-[11px] font-medium text-[#6B6B66] hover:text-[#1A1A1A] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-[#5A5A40]" />
                <span>Reset Demo Chat</span>
              </button>
            )}
            <div className="px-3 py-1 rounded-full bg-[#F5F5F0] border border-[#E5E5E0] text-[11px] font-medium text-[#1A1A1A] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>{entries.length} entries indexed</span>
            </div>
          </div>
        </div>

        {/* Focus Entry Pill */}
        {focusEntry && (
          <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F5F0] border border-[#E5E5E0] text-xs text-[#1A1A1A]">
            <FileText className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span className="truncate max-w-xs sm:max-w-md">
              Focusing on entry: <strong>"{focusEntry.summary || focusEntry.content.slice(0, 40) + '...'}"</strong>
            </span>
            {onClearFocusEntry && (
              <button 
                onClick={onClearFocusEntry} 
                className="hover:text-black p-0.5" 
                title="Clear entry focus"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-2xl ${isUser ? "ml-auto justify-end" : "mr-auto"}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-serif italic text-xs shrink-0 mt-1 shadow-2xs">
                  E
                </div>
              )}

              <div
                className={`p-4 sm:p-5 rounded-2xl text-sm leading-relaxed ${
                  isUser
                    ? "bg-[#1A1A1A] text-white rounded-tr-xs"
                    : "bg-white border border-[#E5E5E0] text-[#1A1A1A] rounded-tl-xs shadow-2xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-[#5A5A40] text-white flex items-center justify-center shrink-0 mt-1 text-xs font-medium">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex gap-3 max-w-2xl mr-auto">
            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-serif italic text-xs shrink-0 mt-1">
              E
            </div>
            <div className="p-4 bg-white border border-[#E5E5E0] rounded-2xl rounded-tl-xs shadow-2xs flex items-center gap-2 text-xs text-[#6B6B66]">
              <Sparkles className="w-3.5 h-3.5 text-[#5A5A40] animate-spin" />
              <span>Echo is synthesizing patterns from your journal...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Prompts */}
      {messages.length < 4 && (
        <div className="py-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex gap-2 whitespace-nowrap">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isSending}
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5E5E0] text-xs text-[#6B6B66] hover:text-[#1A1A1A] hover:bg-[#F5F5F0] transition-all cursor-pointer shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-2 pb-3 shrink-0"
      >
        <div className="relative bg-white border border-[#E5E5E0] rounded-full shadow-2xs focus-within:border-[#5A5A40] focus-within:ring-2 focus-within:ring-[#5A5A40]/15 transition-all flex items-center">
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your thoughts, decisions, or patterns..."
            disabled={isSending}
            className="w-full pl-6 pr-14 py-3.5 text-sm bg-transparent border-0 focus:outline-hidden text-[#1A1A1A] placeholder:text-[#A3A38E]"
          />
          <button
            id="btn-send-chat"
            type="submit"
            disabled={!input.trim() || isSending}
            className={`absolute right-2 p-2 rounded-full transition-colors ${
              input.trim() && !isSending
                ? "bg-[#5A5A40] text-white hover:bg-[#4A4A30] cursor-pointer"
                : "text-[#C4C4BC] cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between px-3 pt-1.5 text-[11px] text-[#A3A38E]">
          <span>Shift + Enter for new lines • Enter to send</span>
          <span>Encrypted with Google Cloud security primitives</span>
        </div>
      </form>
    </div>
  );
};
