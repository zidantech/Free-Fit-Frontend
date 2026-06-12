// components/LiveChat.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Send,
  ChevronRight,
  ChevronLeft,
  User,
} from "lucide-react";

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  dislikes: number;
  timestamp: string;
  isMe?: boolean;
}

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    user: "Paul",
    avatar: "https://i.pravatar.cc/150?img=11",
    text: "Ronaldo is the greatest",
    likes: 12,
    dislikes: 2,
    timestamp: "2m ago",
  },
  {
    id: "2",
    user: "Sarah",
    avatar: "https://i.pravatar.cc/150?img=5",
    text: "That goal was insane! 🔥",
    likes: 8,
    dislikes: 0,
    timestamp: "1m ago",
  },
  {
    id: "3",
    user: "Mike",
    avatar: "https://i.pravatar.cc/150?img=3",
    text: "Best match of the season so far",
    likes: 15,
    dislikes: 1,
    timestamp: "now",
  },
];

interface LiveChatProps {
  streamId?: string;
}

export default function LiveChat({ streamId }: LiveChatProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      avatar: "ME",
      text: inputText.trim(),
      likes: 0,
      dislikes: 0,
      timestamp: "now",
      isMe: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLike = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, likes: m.likes + 1 } : m))
    );
  };

  const handleDislike = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, dislikes: m.dislikes + 1 } : m
      )
    );
  };

  // Collapsed state — just a vertical tab
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 bg-[#1a1f4a] hover:bg-[#252a5c] border-l border-white/10 rounded-l-2xl py-6 px-3 transition-all group"
      >
        <ChevronLeft className="w-5 h-5 text-[#00d4ff] group-hover:-translate-x-0.5 transition-transform" />
        <span
          className="text-xs font-bold text-[#ff3333] tracking-wider uppercase whitespace-nowrap"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Live Chat
        </span>
        <MessageCircle className="w-4 h-4 text-gray-400" />
        <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
      </button>
    );
  }

  return (
    <div className="w-[320px] flex-shrink-0 bg-[#0f1535] border-l border-white/10 flex flex-col h-full relative z-30">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0a0e27]">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#ff3333]" />
          <h3 className="text-sm font-bold text-[#ff3333] tracking-wider uppercase">
            Live Chat
          </h3>
          <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          title="Collapse chat"
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.isMe ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              {msg.avatar === "ME" ? (
                <div className="w-8 h-8 rounded-full bg-[#00d4ff]/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-[#00d4ff]" />
                </div>
              ) : (
                <img
                  src={msg.avatar}
                  alt={msg.user}
                  className="w-8 h-8 rounded-full object-cover border border-white/10"
                />
              )}
            </div>

            {/* Content */}
            <div
              className={`flex-1 min-w-0 ${
                msg.isMe ? "items-end" : "items-start"
              } flex flex-col`}
            >
              {/* Name + Time */}
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`text-xs font-semibold ${
                    msg.isMe ? "text-[#00d4ff]" : "text-white"
                  }`}
                >
                  {msg.user}
                </span>
                <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`px-3 py-2 rounded-xl text-sm leading-relaxed max-w-[220px] ${
                  msg.isMe
                    ? "bg-[#00d4ff]/15 text-white rounded-br-sm border border-[#00d4ff]/20"
                    : "bg-[#1a1f4a] text-gray-200 rounded-bl-sm border border-white/5"
                }`}
              >
                {msg.text}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-1.5">
                <button
                  onClick={() => handleLike(msg.id)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#00d4ff] transition-colors"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{msg.likes}</span>
                </button>
                <button
                  onClick={() => handleDislike(msg.id)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
                >
                  <ThumbsDown className="w-3 h-3" />
                  <span>{msg.dislikes}</span>
                </button>
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
                  <Reply className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10 bg-[#0a0e27]">
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add comment..."
            className="w-full bg-[#1a1f4a] border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/30 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-[#00d4ff] hover:bg-[#00d4ff]/90 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-all"
          >
            <Send className="w-3.5 h-3.5 text-[#0a0e27]" />
          </button>
        </div>
      </div>
    </div>
  );
}