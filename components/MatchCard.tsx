"use client";

import Link from "next/link";
import { Play, Clock } from "lucide-react";

interface Team {
  id: string;
  name: string;
  logo: string;
  score?: number;
}

interface MatchCardProps {
  id: string;
  teams: [Team, Team];
  status: "live" | "upcoming" | "ended";
  league?: string;
  startTime?: string;
  streamUrl?: string;
  isPremium?: boolean;
  className?: string;
}

export default function MatchCard({
  id,
  teams,
  status,
  league,
  startTime,
  streamUrl,
  isPremium = false,
  className = "",
}: MatchCardProps) {
  const isLive = status === "live";
  const isEnded = status === "ended";

  return (
    <div className={`bg-[#0f1535] border border-cyan-500/20 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all ${className}`}>
      {/* Header */}
      <div className="px-3 sm:px-4 py-2 flex items-center justify-between border-b border-cyan-500/10">
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-xs font-bold uppercase">Live</span>
            </span>
          )}
          {isEnded && (
            <span className="text-gray-400 text-xs font-medium uppercase">FT</span>
          )}
          {!isLive && !isEnded && startTime && (
            <span className="flex items-center gap-1 text-gray-400 text-xs">
              <Clock className="w-3 h-3" />
              {new Date(startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
        {league && (
          <span className="text-gray-400 text-xs truncate max-w-[120px]">{league}</span>
        )}
      </div>

      {/* Teams */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <img
              src={teams[0].logo}
              alt={teams[0].name}
              className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
            />
            <span className="text-white text-xs sm:text-sm font-medium text-center truncate w-full">
              {teams[0].name}
            </span>
          </div>

          {/* Score / VS */}
          <div className="flex flex-col items-center px-2 sm:px-4 shrink-0">
            {isLive || isEnded ? (
              <span className="text-xl sm:text-3xl font-bold text-white font-mono">
                {teams[0].score ?? 0} - {teams[1].score ?? 0}
              </span>
            ) : (
              <span className="text-lg sm:text-2xl font-bold text-cyan-400">VS</span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <img
              src={teams[1].logo}
              alt={teams[1].name}
              className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
            />
            <span className="text-white text-xs sm:text-sm font-medium text-center truncate w-full">
              {teams[1].name}
            </span>
          </div>
        </div>
      </div>

      {/* Action */}
      {isLive && streamUrl && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <Link
            href={`/streams/${id}`}
            className="flex items-center justify-center gap-2 w-full py-2 sm:py-2.5 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all text-sm font-medium"
          >
            <Play className="w-4 h-4" fill="currentColor" />
            Watch Live
          </Link>
        </div>
      )}
    </div>
  );
}