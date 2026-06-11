"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, highlightsAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Sparkles, Play, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";

const sportDisplayNames: Record<string, string> = {
  football: "Football",
  soccer: "Football",
  tennis: "Tennis",
  basketball: "Basketball",
  cricket: "Cricket",
  hockey: "Hockey",
  golf: "Golf",
  baseball: "Baseball",
  wrestling: "Wrestling",
  "formula-1": "Formula 1",
  boxing: "Boxing",
  rugby: "Rugby",
  athletics: "Athletics",
};

const demoHighlights: Record<string, any[]> = {
  football: [
    {
      id: "h1",
      title: "Premier League Best Goals - Matchweek 12",
      thumbnail: "https://images.unsplash.com/photo-1629977007371-0ba395424741?w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      duration: "3:45",
      views: "1.2M",
      sport: "Football",
    },
    {
      id: "h2",
      title: "Champions League Final - Extended Highlights",
      thumbnail: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      duration: "8:15",
      views: "2.5M",
      sport: "Football",
    },
    {
      id: "h3",
      title: "El Clasico: Real Madrid vs Barcelona - All Goals",
      thumbnail: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      duration: "6:30",
      views: "3.1M",
      sport: "Football",
    },
    {
      id: "h4",
      title: "Top 10 Free Kicks of the Season",
      thumbnail: "https://images.unsplash.com/photo-1522778119026-d647f0565c6a?w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      duration: "4:20",
      views: "890K",
      sport: "Football",
    },
    {
      id: "h5",
      title: "FA Cup Final Highlights",
      thumbnail: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      duration: "5:45",
      views: "1.8M",
      sport: "Football",
    },
    {
      id: "h6",
      title: "World Cup Best Moments 2026",
      thumbnail: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      duration: "10:00",
      views: "5.2M",
      sport: "Football",
    },
  ],
  tennis: [
    {
      id: "ht1",
      title: "Wimbledon Final: Sinner vs Alcaraz",
      thumbnail: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      duration: "12:30",
      views: "2.1M",
      sport: "Tennis",
    },
    {
      id: "ht2",
      title: "US Open Top 10 Rallies",
      thumbnail: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      duration: "5:45",
      views: "980K",
      sport: "Tennis",
    },
    {
      id: "ht3",
      title: "Roland Garros Best Points",
      thumbnail: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      duration: "7:20",
      views: "1.5M",
      sport: "Tennis",
    },
  ],
  basketball: [
    {
      id: "hb1",
      title: "NBA Finals: Lakers vs Celtics Game 7",
      thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      duration: "15:30",
      views: "4.2M",
      sport: "Basketball",
    },
    {
      id: "hb2",
      title: "Top 50 Dunks of the Season",
      thumbnail: "https://images.unsplash.com/photo-1519861531473-9200263931a2?w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      duration: "8:45",
      views: "3.5M",
      sport: "Basketball",
    },
    {
      id: "hb3",
      title: "All-Star Weekend Highlights",
      thumbnail: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      duration: "6:15",
      views: "2.8M",
      sport: "Basketball",
    },
  ],
  default: [
    {
      id: "hd1",
      title: "Best Moments of the Season",
      thumbnail: "https://images.unsplash.com/photo-1461896836934-bd315a73a2b2?w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      duration: "5:30",
      views: "1.1M",
      sport: "General",
    },
    {
      id: "hd2",
      title: "Epic Rivalry Match Highlights",
      thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      duration: "7:15",
      views: "1.4M",
      sport: "General",
    },
    {
      id: "hd3",
      title: "Championship Final Highlights",
      thumbnail: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      duration: "9:45",
      views: "2.2M",
      sport: "General",
    },
  ],
};

function getPrimaryInterest(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("primaryInterest") || "football";
  }
  return "football";
}

export default function HighlightsPage() {
  const router = useRouter();
  const [primarySport, setPrimarySport] = useState<string>("football");
  const [sportName, setSportName] = useState<string>("Football");
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      router.push("/signin");
      return;
    }

    const interest = getPrimaryInterest();
    setPrimarySport(interest);
    setSportName(sportDisplayNames[interest] || interest.charAt(0).toUpperCase() + interest.slice(1));

    const fetchHighlights = async () => {
      try {
        const data = await highlightsAPI.getHighlights({ sport: interest });
        if (data?.data?.length > 0) {
          setHighlights(data.data);
        } else {
          setHighlights(demoHighlights[interest] || demoHighlights.default);
        }
      } catch (err) {
        console.log("Using demo highlights");
        setHighlights(demoHighlights[interest] || demoHighlights.default);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, [router]);

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

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{sportName} Highlights</h1>
                <p className="text-gray-400 text-sm sm:text-base">Best moments from your sport</p>
              </div>
            </div>
            <Link
              href="/categories"
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full hover:bg-cyan-500/30 transition-all text-sm font-medium"
            >
              Browse Other Sports
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Featured Video Player */}
          {activeVideo && (
            <section className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden">
              <video
                src={activeVideo}
                controls
                autoPlay
                className="w-full h-full object-cover"
                playsInline
              />
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 px-4 py-2 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors text-sm"
              >
                Close
              </button>
            </section>
          )}

          {/* Highlights Grid */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="group relative rounded-xl overflow-hidden bg-[#0f1535] border border-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-pointer"
                  onClick={() => setActiveVideo(highlight.videoUrl)}
                >
                  <div className="aspect-video relative">
                    <img
                      src={highlight.thumbnail}
                      alt={highlight.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 bg-cyan-400/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-cyan-400/30">
                        <Play className="w-7 h-7 text-[#0a0e27] ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded font-medium">
                      {highlight.duration}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-cyan-400 transition-colors">
                      {highlight.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-cyan-400 text-xs">{highlight.sport || sportName}</span>
                      <span className="text-gray-500 text-xs">{highlight.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Discover More */}
          <section className="bg-[#0f1535] border border-cyan-500/20 rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Want More Highlights?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mb-4 max-w-lg mx-auto">
              Explore highlights from all sports on the Categories page.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 text-[#0a0e27] rounded-full font-semibold text-sm sm:text-base hover:bg-cyan-300 transition-colors"
            >
              Browse All Sports
              <ChevronRight className="w-5 h-5" />
            </Link>
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
