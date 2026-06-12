// app/forum/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  MessageCircle,
  User,
  Clock,
  ArrowLeft,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: Date;
  isMe?: boolean;
}

const DEMO_MESSAGES: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "1",
      user: "GunnersFan",
      avatar: "GF",
      text: "Saka is on fire this season! 🔥",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: "2",
      user: "RedDevil",
      avatar: "RD",
      text: "We need a proper striker in January 😤",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
    },
    {
      id: "3",
      user: "SportsFan99",
      avatar: "SF",
      text: "That Arsenal goal was insane! What a finish",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ],
  "2": [
    {
      id: "1",
      user: "LakersNation",
      avatar: "LN",
      text: "LeBron still dropping 30 at 40 years old 👑",
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
    },
    {
      id: "2",
      user: "WarriorsFan",
      avatar: "WF",
      text: "Curry from the logo again... unreal 🎯",
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
    },
  ],
};

const FORUM_INFO: Record<string, { name: string; members: number }> = {
  "1": { name: "Premier League Talk", members: 12450 },
  "2": { name: "NBA Central", members: 8930 },
};

export default function ForumChatPage() {
  const params = useParams();
  const forumId = params.id as string;

  const [messages, setMessages] = useState<ChatMessage[]>(
    DEMO_MESSAGES[forumId] || []
  );
  const [inputText, setInputText] = useState("");
  const [currentUser] = useState("You");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const forum = FORUM_INFO[forumId] || { name: "Forum Chat", members: 0 };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: currentUser,
      avatar: "ME",
      text: inputText.trim(),
      timestamp: new Date(),
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white flex flex-col pt-16 sm:pt-20">
      <Navbar />

      {/* Header */}
      <div className="border-b border-white/10 bg-[#0f1535]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <a
              href="/forum"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </a>
            <div className="p-2 bg-[#00d4ff]/10 rounded-lg">
              <MessageCircle className="w-5 h-5 text-[#00d4ff]" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white truncate">
                {forum.name}
              </h1>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {forum.members.toLocaleString()} members online
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.isMe ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.isMe
                    ? "bg-[#00d4ff] text-[#0a0e27]"
                    : "bg-white/10 text-gray-300"
                }`}
              >
                {msg.avatar}
              </div>
              <div
                className={`max-w-[75%] ${
                  msg.isMe ? "items-end" : "items-start"
                } flex flex-col`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-300">
                    {msg.user}
                  </span>
                  <span className="text-xs text-gray-600 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.isMe
                      ? "bg-[#00d4ff] text-[#0a0e27] rounded-br-md"
                      : "bg-white/5 text-gray-200 rounded-bl-md border border-white/10"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/10 bg-[#0f1535] p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <div className="w-9 h-9 rounded-full bg-[#00d4ff]/10 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-[#00d4ff]" />
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-[#00d4ff] hover:bg-[#00d4ff]/90 disabled:opacity-40 disabled:cursor-not-allowed text-[#0a0e27] rounded-xl font-medium transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}