"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, streamsAPI, matchesAPI, sportsAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import MatchCard from "@/components/MatchCard";
import SportSelector from "@/components/SportSelector";
import { 
  Play, Trophy, Calendar, Clock, ChevronRight, 
  Flame, TrendingUp, Star, Loader2 
} from "lucide-react";
import Link from "next/link";

// Demo data for when API is not available
const demoLiveMatches = [
  {
    id: "1",
    teams: [
      { id: "t1", name: "Arsenal", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg", score: 2 },
      { id: "t2", name: "Man United", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg", score: 1 }
    ],
    status: "live" as const,
    league: "Premier League",
    streamUrl: "https://example.com/stream1"
  },
  {
    id: "2",
    teams: [
      { id: "t3", name: "Real Madrid", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg", score: 3 },
      { id: "t4", name: "Barcelona", logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg", score: 2 }
    ],
    status: "live" as const,
    league: "La Liga",
    streamUrl: "https://example.com/stream2"
  },
  {
    id: "3",
    teams: [
      { id: "t5", name: "Liverpool", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg", score: 1 },
      { id: "t6", name: "Chelsea", logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg", score: 1 }
    ],
    status: "live" as const,
    league: "Premier League",
    streamUrl: "https://example.com/stream3"
  }
];

const demoPreviousMatches = [
  {
    id: "4",
    teams: [
      { id: "t7", name: "Bayern Munich", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg", score: 4 },
      { id: "t8", name: "Dortmund", logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg", score: 2 }
    ],
    status: "ended" as const,
    league: "Bundesliga"
  },
  {
    id: "5",
    teams: [
      { id: "t9", name: "Juventus", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Juventus_FC_-_pictogram_black_%28Italy%2C_2017%29.svg", score: 2 },
      { id: "t10", name: "AC Milan", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/AC_Milan_logo.svg", score: 1 }
    ],
    status: "ended" as const,
    league: "Serie A"
  },
  {
    id: "6",
    teams: [
      { id: "t11", name: "PSG", logo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg", score: 3 },
      { id: "t12", name: "Marseille", logo: "https://upload.wikimedia.org/wikipedia/commons/4/43/Olympique_de_Marseille_logo.svg", score: 0 }
    ],
    status: "ended" as const,
    league: "Ligue 1"
  },
  {
    id: "7",
    teams: [
      { id: "t13", name: "Man City", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg", score: 2 },
      { id: "t14", name: "Tottenham", logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg", score: 2 }
    ],
    status: "ended" as const,
    league: "Premier League"
  }
];

const defaultSports = [
  { id: "1", name: "Football", slug: "football", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099672.png" },
  { id: "2", name: "Tennis", slug: "tennis", icon: "https://cdn-icons-png.flaticon.com/128/2151/2151115.png" },
  { id: "3", name: "Basketball", slug: "basketball", icon: "https://cdn-icons-png.flaticon.com/128/317/317709.png" },
  { id: "4", name: "Cricket", slug: "cricket", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099683.png" },
  { id: "5", name: "Hockey", slug: "hockey", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099692.png" },
  { id: "6", name: "Golf", slug: "golf", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099710.png" },
  { id: "7", name: "Baseball", slug: "baseball", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099695.png" },
  { id: "8", name: "Formula 1", slug: "formula-1", icon: "https://cdn-icons-png.flaticon.com/128/2964/2964514.png" },
];

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"live" | "previous">("live");
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [liveMatches, setLiveMatches] = useState(demoLiveMatches);
  const [previousMatches, setPreviousMatches] = useState(demoPreviousMatches);
  const [sports, setSports] = useState(defaultSports);
  const [featuredStream, setFeaturedStream] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      router.push("/signin");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch live matches
        const liveData = await matchesAPI.getLiveMatches();
        if (liveData?.data?.length > 0) {
          setLiveMatches(liveData.data);
        }

        // Fetch previous matches
        const prevData = await matchesAPI.getPreviousMatches();
        if (prevData?.data?.length > 0) {
          setPreviousMatches(prevData.data);
        }

        // Fetch sports
        const sportsData = await sportsAPI.getSports();
        if (sportsData?.data?.length > 0) {
          setSports(sportsData.data);
        }

        // Fetch featured stream
        const featured = await streamsAPI.getFeatured();
        if (featured?.data?.[0]) {
          setFeaturedStream(featured.data[0]);
        }
      } catch (err) {
        console.log("Using demo data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const filteredLive = selectedSport === "all" 
    ? liveMatches 
    : liveMatches.filter(m => m.teams.some((t: any) => t.sport?.slug === selectedSport));

  const filteredPrevious = selectedSport === "all" 
    ? previousMatches 
    : previousMatches.filter(m => m.teams.some((t: any) => t.sport?.slug === selectedSport));

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Navbar />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">

          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome back!</h1>
              <p className="text-gray-400 text-sm sm:text-base mt-1">Here&apos;s what&apos;s happening today</p>
            </div>
            <Link 
              href="/interest" 
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full hover:bg-cyan-500/30 transition-all text-sm font-medium"
            >
              <Star className="w-4 h-4" />
              Edit Interests
            </Link>
          </div>

          {/* Main Video Player Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-red-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white">Featured Live Stream</h2>
            </div>
            <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden">
              {featuredStream ? (
                <VideoPlayer 
                  src={featuredStream.streamUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
                  poster={featuredStream.thumbnail}
                  autoPlay={false}
                  className="h-full"
                />
              ) : (
                <VideoPlayer 
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  poster="https://images.unsplash.com/photo-1629977007371-0ba395424741?w=1200&q=80"
                  autoPlay={false}
                  className="h-full"
                />
              )}
            </div>
          </section>

          {/* Sport Selector */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Select Sport</h2>
            <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-2">
              <button
                onClick={() => setSelectedSport("all")}
                className={`shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border text-sm font-medium transition-all ${
                  selectedSport === "all"
                    ? "border-cyan-400 bg-cyan-400/20 text-cyan-400"
                    : "border-cyan-500/30 text-gray-300 hover:border-cyan-500/50"
                }`}
              >
                All Sports
              </button>
              {sports.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => setSelectedSport(sport.slug)}
                  className={`shrink-0 flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border text-sm font-medium transition-all ${
                    selectedSport === sport.slug
                      ? "border-cyan-400 bg-cyan-400/20 text-cyan-400"
                      : "border-cyan-500/30 text-gray-300 hover:border-cyan-500/50"
                  }`}
                >
                  <img src={sport.icon} alt="" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
                  <span className="hidden sm:inline">{sport.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Live & Previous Matches */}
          <section>
            {/* Tabs */}
            <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6 border-b border-cyan-500/20">
              <button
                onClick={() => setActiveTab("live")}
                className={`pb-3 sm:pb-4 text-sm sm:text-base font-semibold transition-colors relative ${
                  activeTab === "live" ? "text-cyan-400" : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Live Matches
                </span>
                {activeTab === "live" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("previous")}
                className={`pb-3 sm:pb-4 text-sm sm:text-base font-semibold transition-colors relative ${
                  activeTab === "previous" ? "text-cyan-400" : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Previous Matches
                </span>
                {activeTab === "previous" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>
            </div>

            {/* Matches Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {activeTab === "live" ? (
                filteredLive.length > 0 ? (
                  filteredLive.map((match) => (
                    <MatchCard
                      key={match.id}
                      id={match.id}
                      teams={match.teams}
                      status={match.status}
                      league={match.league}
                      streamUrl={match.streamUrl}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-400">
                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No live matches for this sport right now</p>
                  </div>
                )
              ) : (
                filteredPrevious.length > 0 ? (
                  filteredPrevious.map((match) => (
                    <MatchCard
                      key={match.id}
                      id={match.id}
                      teams={match.teams}
                      status={match.status}
                      league={match.league}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No previous matches for this sport</p>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Trending Highlights */}
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white">Trending Highlights</h2>
              </div>
              <Link href="#" className="flex items-center gap-1 text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group relative rounded-xl overflow-hidden bg-[#0f1535] border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                  <div className="aspect-video relative">
                    <img 
                      src={`https://images.unsplash.com/photo-${i === 1 ? '1629977007371-0ba395424741' : i === 2 ? '1728116693268-125c5d6ad9e2' : '1577223625816-7546f13df25d'}?w=600&q=80`}
                      alt="Highlight"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 bg-cyan-400/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-[#0a0e27] ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                      {i === 1 ? "3:45" : i === 2 ? "5:20" : "8:15"}
                    </span>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-white text-sm font-medium truncate">
                      {i === 1 ? "Premier League Best Goals" : i === 2 ? "F1 Monaco GP Highlights" : "Champions League Final"}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">{i === 1 ? "Football" : i === 2 ? "Formula 1" : "Football"} • {i === 1 ? "1.2M" : i === 2 ? "890K" : "2.5M"} views</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-cyan-500/20 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-xs sm:text-sm">
          <p>© 2026 Free-Fit.com. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}