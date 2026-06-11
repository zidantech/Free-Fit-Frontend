"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, matchesAPI, highlightsAPI, sportsAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import { LayoutGrid, Play, Loader2, Trophy, Sparkles } from "lucide-react";

interface Sport {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

const allSports: Sport[] = [
  { id: "1", name: "Football", slug: "football", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099672.png" },
  { id: "2", name: "Tennis", slug: "tennis", icon: "https://cdn-icons-png.flaticon.com/128/2151/2151115.png" },
  { id: "3", name: "Basketball", slug: "basketball", icon: "https://cdn-icons-png.flaticon.com/128/317/317709.png" },
  { id: "4", name: "Cricket", slug: "cricket", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099683.png" },
  { id: "5", name: "Hockey", slug: "hockey", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099692.png" },
  { id: "6", name: "Golf", slug: "golf", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099710.png" },
  { id: "7", name: "Baseball", slug: "baseball", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099695.png" },
  { id: "8", name: "Formula 1", slug: "formula-1", icon: "https://cdn-icons-png.flaticon.com/128/2964/2964514.png" },
  { id: "9", name: "Boxing", slug: "boxing", icon: "https://cdn-icons-png.flaticon.com/128/2548/2548535.png" },
  { id: "10", name: "Rugby", slug: "rugby", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099702.png" },
];

const demoMatchesBySport: Record<string, any[]> = {
  football: [
    {
      id: "cf1",
      teams: [
        { id: "ct1", name: "Man City", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg", score: 3 },
        { id: "ct2", name: "Arsenal", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg", score: 1 }
      ],
      status: "live" as const,
      league: "Premier League",
      streamUrl: "#"
    },
    {
      id: "cf2",
      teams: [
        { id: "ct3", name: "Inter", logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg", score: 2 },
        { id: "ct4", name: "AC Milan", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/AC_Milan_logo.svg", score: 0 }
      ],
      status: "ended" as const,
      league: "Serie A"
    },
  ],
  tennis: [
    {
      id: "ct1",
      teams: [
        { id: "ctt1", name: "Djokovic", logo: "https://via.placeholder.com/56?text=ND", score: 6 },
        { id: "ctt2", name: "Alcaraz", logo: "https://via.placeholder.com/56?text=CA", score: 4 }
      ],
      status: "live" as const,
      league: "Wimbledon",
      streamUrl: "#"
    },
  ],
  basketball: [
    {
      id: "cb1",
      teams: [
        { id: "cbt1", name: "Lakers", logo: "https://via.placeholder.com/56?text=LAL", score: 102 },
        { id: "cbt2", name: "Warriors", logo: "https://via.placeholder.com/56?text=GSW", score: 98 }
      ],
      status: "live" as const,
      league: "NBA",
      streamUrl: "#"
    },
  ],
};

const demoHighlightsBySport: Record<string, any[]> = {
  football: [
    { id: "ch1", title: "Premier League Best Goals", thumbnail: "https://images.unsplash.com/photo-1629977007371-0ba395424741?w=800&q=80", duration: "3:45", views: "1.2M" },
    { id: "ch2", title: "Champions League Final Highlights", thumbnail: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80", duration: "8:15", views: "2.5M" },
  ],
  tennis: [
    { id: "cht1", title: "Wimbledon Top Rallies", thumbnail: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80", duration: "5:30", views: "890K" },
  ],
  basketball: [
    { id: "chb1", title: "NBA Top Dunks", thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80", duration: "4:20", views: "2.1M" },
  ],
};

export default function CategoriesPage() {
  const router = useRouter();
  const [sports, setSports] = useState<Sport[]>(allSports);
  const [selectedSport, setSelectedSport] = useState<string>("football");
  const [matches, setMatches] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"matches" | "highlights">("matches");

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      router.push("/signin");
      return;
    }

    const fetchSports = async () => {
      try {
        const data = await sportsAPI.getSports();
        if (data?.data?.length > 0) {
          setSports(data.data);
        }
      } catch (err) {
        console.log("Using default sports");
      }
    };

    fetchSports();
    loadSportData("football");
  }, [router]);

  const loadSportData = async (sportSlug: string) => {
    setLoading(true);
    setSelectedSport(sportSlug);

    try {
      const matchesData = await matchesAPI.getLiveMatches();
      if (matchesData?.data?.length > 0) {
        const filtered = matchesData.data.filter((m: any) =>
          m.sport?.slug === sportSlug || m.teams?.some((t: any) => t.sport?.slug === sportSlug)
        );
        setMatches(filtered.length > 0 ? filtered : (demoMatchesBySport[sportSlug] || []));
      } else {
        setMatches(demoMatchesBySport[sportSlug] || []);
      }

      const highlightsData = await highlightsAPI.getHighlights({ sport: sportSlug });
      if (highlightsData?.data?.length > 0) {
        setHighlights(highlightsData.data);
      } else {
        setHighlights(demoHighlightsBySport[sportSlug] || []);
      }
    } catch (err) {
      console.log("Using demo data");
      setMatches(demoMatchesBySport[sportSlug] || []);
      setHighlights(demoHighlightsBySport[sportSlug] || []);
    } finally {
      setLoading(false);
    }
  };

  const selectedSportName = sports.find(s => s.slug === selectedSport)?.name || selectedSport;

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Navbar />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Categories</h1>
              <p className="text-gray-400 text-sm sm:text-base">Browse all sports and their content</p>
            </div>
          </div>

          {/* Sports Grid */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">All Sports</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {sports.map((sport) => {
                const isSelected = selectedSport === sport.slug;
                return (
                  <button
                    key={sport.id}
                    onClick={() => loadSportData(sport.slug)}
                    className={`relative p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 sm:gap-3 ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/10"
                        : "border-cyan-500/20 bg-[#0f1535]/50 hover:border-cyan-500/40 hover:bg-[#0f1535]"
                    }`}
                  >
                    <img src={sport.icon} alt={sport.name} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                    <span className={`text-xs sm:text-sm font-semibold ${isSelected ? "text-cyan-400" : "text-white"}`}>
                      {sport.name}
                    </span>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Content Tabs */}
          <section>
            <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6 border-b border-cyan-500/20">
              <button
                onClick={() => setActiveTab("matches")}
                className={`pb-3 sm:pb-4 text-sm sm:text-base font-semibold transition-colors relative flex items-center gap-2 ${
                  activeTab === "matches" ? "text-cyan-400" : "text-gray-400 hover:text-white"
                }`}
              >
                <Trophy className="w-4 h-4" />
                {selectedSportName} Matches
                {activeTab === "matches" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("highlights")}
                className={`pb-3 sm:pb-4 text-sm sm:text-base font-semibold transition-colors relative flex items-center gap-2 ${
                  activeTab === "highlights" ? "text-cyan-400" : "text-gray-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {selectedSportName} Highlights
                {activeTab === "highlights" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            ) : (
              <>
                {activeTab === "matches" ? (
                  matches.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {matches.map((match) => (
                        <MatchCard
                          key={match.id}
                          id={match.id}
                          teams={match.teams}
                          status={match.status}
                          league={match.league}
                          streamUrl={match.streamUrl}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-[#0f1535]/50 rounded-xl border border-cyan-500/20">
                      <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                      <p className="text-gray-400">No matches available for {selectedSportName}</p>
                    </div>
                  )
                ) : (
                  highlights.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {highlights.map((highlight) => (
                        <div
                          key={highlight.id}
                          className="group relative rounded-xl overflow-hidden bg-[#0f1535] border border-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-pointer"
                        >
                          <div className="aspect-video relative">
                            <img
                              src={highlight.thumbnail}
                              alt={highlight.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <div className="w-12 h-12 bg-cyan-400/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-6 h-6 text-[#0a0e27] ml-0.5" fill="currentColor" />
                              </div>
                            </div>
                            <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                              {highlight.duration}
                            </span>
                          </div>
                          <div className="p-3 sm:p-4">
                            <h3 className="text-white text-sm font-medium truncate group-hover:text-cyan-400 transition-colors">
                              {highlight.title}
                            </h3>
                            <p className="text-gray-400 text-xs mt-1">{selectedSportName} &bull; {highlight.views} views</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-[#0f1535]/50 rounded-xl border border-cyan-500/20">
                      <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                      <p className="text-gray-400">No highlights available for {selectedSportName}</p>
                    </div>
                  )
                )}
              </>
            )}
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-cyan-500/20 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-xs sm:text-sm">
          <p>&copy; 2026 Freefit.com. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
