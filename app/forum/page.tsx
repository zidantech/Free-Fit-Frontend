// app/forum/page.tsx
"use client";

import { useState } from "react";
import {
  MessageSquare,
  Users,
  Plus,
  Search,
  TrendingUp,
  Hash,
  ArrowRight,
  X,
  Globe,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";

interface Forum {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isJoined: boolean;
  isPrivate: boolean;
  trending?: boolean;
}

const DEMO_FORUMS: Forum[] = [
  {
    id: "1",
    name: "Premier League Talk",
    description: "Discuss every match, transfer rumor, and VAR decision.",
    members: 12450,
    category: "Football",
    isJoined: true,
    isPrivate: false,
    trending: true,
  },
  {
    id: "2",
    name: "NBA Central",
    description: "Game threads, trade ideas, and playoff predictions.",
    members: 8930,
    category: "Basketball",
    isJoined: true,
    isPrivate: false,
  },
  {
    id: "3",
    name: "F1 Paddock",
    description: "Quali analysis, race strategy, and driver debates.",
    members: 5620,
    category: "Formula 1",
    isJoined: false,
    isPrivate: false,
    trending: true,
  },
  {
    id: "4",
    name: "Tennis Grand Slams",
    description: "Wimbledon, Roland Garros, and everything in between.",
    members: 3400,
    category: "Tennis",
    isJoined: false,
    isPrivate: false,
  },
  {
    id: "5",
    name: "UFC Fight Night",
    description: "Pre-fight hype, live reactions, and post-fight breakdowns.",
    members: 2100,
    category: "MMA",
    isJoined: false,
    isPrivate: false,
  },
  {
    id: "6",
    name: "Fantasy League Pros",
    description: "Private league for serious fantasy managers only.",
    members: 48,
    category: "Fantasy",
    isJoined: false,
    isPrivate: true,
  },
];

const CATEGORIES = [
  "All",
  "Football",
  "Basketball",
  "Formula 1",
  "Tennis",
  "MMA",
  "Fantasy",
  "eSports",
];

export default function ForumHubPage() {
  const [forums, setForums] = useState<Forum[]>(DEMO_FORUMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newForumName, setNewForumName] = useState("");
  const [newForumDesc, setNewForumDesc] = useState("");
  const [newForumCategory, setNewForumCategory] = useState("Football");
  const [newForumPrivate, setNewForumPrivate] = useState(false);

  const filteredForums = forums.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || f.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const joinedForums = filteredForums.filter((f) => f.isJoined);
  const discoverForums = filteredForums.filter((f) => !f.isJoined);

  const handleJoin = (forumId: string) => {
    setForums((prev) =>
      prev.map((f) => (f.id === forumId ? { ...f, isJoined: true } : f))
    );
  };

  const handleCreateForum = () => {
    if (!newForumName.trim() || !newForumDesc.trim()) return;

    const newForum: Forum = {
      id: Date.now().toString(),
      name: newForumName.trim(),
      description: newForumDesc.trim(),
      members: 1,
      category: newForumCategory,
      isJoined: true,
      isPrivate: newForumPrivate,
    };

    setForums((prev) => [newForum, ...prev]);
    setShowCreateModal(false);
    setNewForumName("");
    setNewForumDesc("");
    setNewForumCategory("Football");
    setNewForumPrivate(false);
  };

  const formatMembers = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white pt-16 sm:pt-20">
      <Navbar />

      {/* Header */}
      <div className="border-b border-white/10 bg-[#0f1535]">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#00d4ff]/10 rounded-xl">
                <MessageSquare className="w-7 h-7 text-[#00d4ff]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Sports Forum</h1>
                <p className="text-sm text-gray-400">
                  Join discussions with fans worldwide
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a0e27] rounded-xl font-semibold text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Forum
            </button>
          </div>

          {/* Search & Filter */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search forums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-[#00d4ff] text-[#0a0e27]"
                      : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* Your Forums */}
        {joinedForums.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-[#00d4ff]" />
              Your Forums
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {joinedForums.map((forum) => (
                <ForumCard
                  key={forum.id}
                  forum={forum}
                  formatMembers={formatMembers}
                  onJoin={handleJoin}
                />
              ))}
            </div>
          </section>
        )}

        {/* Discover New Forums */}
        {discoverForums.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00d4ff]" />
              Discover
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {discoverForums.map((forum) => (
                <ForumCard
                  key={forum.id}
                  forum={forum}
                  formatMembers={formatMembers}
                  onJoin={handleJoin}
                />
              ))}
            </div>
          </section>
        )}

        {filteredForums.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No forums found.</p>
          </div>
        )}
      </div>

      {/* Create Forum Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1535] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Create New Forum</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Forum Name
                </label>
                <input
                  type="text"
                  value={newForumName}
                  onChange={(e) => setNewForumName(e.target.value)}
                  placeholder="e.g., La Liga Fan Club"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Description
                </label>
                <textarea
                  value={newForumDesc}
                  onChange={(e) => setNewForumDesc(e.target.value)}
                  placeholder="What is this forum about?"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Category
                </label>
                <select
                  value={newForumCategory}
                  onChange={(e) => setNewForumCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 transition-all appearance-none"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0f1535]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    newForumPrivate ? "bg-[#00d4ff]" : "bg-white/20"
                  }`}
                  onClick={() => setNewForumPrivate(!newForumPrivate)}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                      newForumPrivate ? "left-5" : "left-1"
                    }`}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  {newForumPrivate ? (
                    <Lock className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Globe className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-300">
                    {newForumPrivate ? "Private Forum" : "Public Forum"}
                  </span>
                </div>
              </label>
            </div>

            <button
              onClick={handleCreateForum}
              disabled={!newForumName.trim() || !newForumDesc.trim()}
              className="w-full py-3 bg-[#00d4ff] hover:bg-[#00d4ff]/90 disabled:opacity-40 disabled:cursor-not-allowed text-[#0a0e27] rounded-xl font-semibold text-sm transition-all"
            >
              Create Forum
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Forum Card Component
function ForumCard({
  forum,
  formatMembers,
  onJoin,
}: {
  forum: Forum;
  formatMembers: (n: number) => string;
  onJoin: (id: string) => void;
}) {
  return (
    <div className="group bg-[#0f1535] border border-white/10 rounded-2xl p-5 hover:border-[#00d4ff]/30 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white truncate">{forum.name}</h3>
            {forum.trending && (
              <span className="px-2 py-0.5 bg-[#00d4ff]/10 text-[#00d4ff] text-xs font-medium rounded-full">
                Trending
              </span>
            )}
            {forum.isPrivate && (
              <Lock className="w-3.5 h-3.5 text-gray-500" />
            )}
          </div>
          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
            {forum.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {formatMembers(forum.members)} members
            </span>
            <span className="px-2 py-0.5 bg-white/5 rounded-md">
              {forum.category}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {forum.isJoined ? (
          <a
            href={`/forum/${forum.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] rounded-xl text-sm font-medium transition-all"
          >
            Enter Chat
            <ArrowRight className="w-4 h-4" />
          </a>
        ) : (
          <button
            onClick={() => onJoin(forum.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a0e27] rounded-xl text-sm font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            Join Forum
          </button>
        )}
      </div>
    </div>
  );
}