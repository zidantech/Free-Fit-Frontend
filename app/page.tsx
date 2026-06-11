"use client";

import Link from "next/link";
import { Play, ChevronRight, Trophy, Calendar, Newspaper } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import { authAPI, streamsAPI } from "@/lib/api";

const sportsImages = [
  { src: "https://images.unsplash.com/photo-1728116693268-125c5d6ad9e2?w=800&q=80", alt: "Formula 1 Racing", span: "col-span-2 row-span-1" },
  { src: "https://images.unsplash.com/photo-1629977007371-0ba395424741?w=800&q=80", alt: "Football Action", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1719518701287-72bb9b3366ee?w=800&q=80", alt: "American Football", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?w=800&q=80", alt: "Boxing Match", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1651179602825-a5cb093cd467?w=800&q=80", alt: "Baseball Game", span: "col-span-2 row-span-1" },
  { src: "https://plus.unsplash.com/premium_photo-1676634832558-6654a134e920?w=800&q=80", alt: "Basketball Game", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/flagged/photo-1576972405668-2d020a01cbfa?w=800&q=80", alt: "Tennis Player", span: "col-span-1 row-span-1" },
  { src: "https://plus.unsplash.com/premium_photo-1664910059954-9fba97bc5d6e?w=800&q=80", alt: "Boxing Training", span: "col-span-1 row-span-1" }
];

// Demo video highlights data
const videoHighlights = [
  {
    id: "1",
    title: "Premier League Best Goals - Matchweek 12",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://images.unsplash.com/photo-1629977007371-0ba395424741?w=800&q=80",
    sport: "Football",
    duration: "3:45",
    views: "1.2M"
  },
  {
    id: "2",
    title: "F1 Monaco GP 2026 - Race Highlights",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://images.unsplash.com/photo-1728116693268-125c5d6ad9e2?w=800&q=80",
    sport: "Formula 1",
    duration: "5:20",
    views: "890K"
  },
  {
    id: "3",
    title: "Champions League Final - Extended Highlights",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
    sport: "Football",
    duration: "8:15",
    views: "2.5M"
  }
];

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [featuredStreams, setFeaturedStreams] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState(0);

  useEffect(() => {
    setIsAuthenticated(authAPI.isAuthenticated());

    const fetchStreams = async () => {
      try {
        const data = await streamsAPI.getFeatured();
        if (data?.data) setFeaturedStreams(data.data);
      } catch (err) {
        console.log("Featured streams not available yet");
      }
    };
    fetchStreams();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Navbar />

      {/* Hero Section - Video Highlights */}
      <section className="pt-20 sm:pt-24 px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <span className="flex items-center gap-2 text-red-400 text-sm font-bold uppercase mb-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live Now
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Matches Streaming Now</h2>
            </div>
            <Link 
              href="/home" 
              className="flex items-center gap-1 text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Main Video Player */}
          <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4 sm:mb-6">
            <VideoPlayer 
              src={videoHighlights[activeVideo].videoUrl}
              poster={videoHighlights[activeVideo].poster}
              autoPlay={false}
              className="h-full"
            />
          </div>

          {/* Video Playlist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {videoHighlights.map((video, index) => (
              <button
                key={video.id}
                onClick={() => setActiveVideo(index)}
                className={`flex items-center gap-3 p-2 sm:p-3 rounded-lg border transition-all text-left ${
                  activeVideo === index
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-cyan-500/20 bg-[#0f1535] hover:border-cyan-500/40"
                }`}
              >
                <div className="relative shrink-0">
                  <img 
                    src={video.poster} 
                    alt={video.title}
                    className="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="white" />
                  </div>
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-[10px] sm:text-xs rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-white text-xs sm:text-sm font-medium truncate">{video.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-cyan-400 text-[10px] sm:text-xs">{video.sport}</span>
                    <span className="text-gray-500 text-[10px] sm:text-xs">{video.views} views</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Live Sports CTA Section */}
      <section 
        className="relative py-16 sm:py-24 px-4 sm:px-6"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1629977007371-0ba395424741?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#0a0e27]/80" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-cyan-400 rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-cyan-400/30">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 text-[#0a0e27] ml-1" fill="currentColor" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 uppercase tracking-wider">
            Live Sports
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Stream the biggest matches and events from across the continent in HD
          </p>

          {isAuthenticated ? (
            <Link 
              href="/home"
              className="inline-block px-8 sm:px-12 py-2.5 sm:py-3 bg-cyan-400 text-[#0a0e27] rounded-full font-semibold text-base sm:text-lg hover:bg-cyan-300 transition-colors tracking-wide"
            >
              Watch Now
            </Link>
          ) : (
            <Link 
              href="/signup"
              className="inline-block px-8 sm:px-12 py-2.5 sm:py-3 bg-[#5a5a5a] text-cyan-400 rounded-full font-semibold text-base sm:text-lg hover:bg-[#6a6a6a] transition-colors tracking-wide"
            >
              Get Started
            </Link>
          )}
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <Link href="/home" className="group flex items-center gap-4 p-4 sm:p-6 bg-[#0f1535] border border-cyan-500/20 rounded-xl hover:border-cyan-400/50 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base">Live Matches</h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Watch ongoing games now</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 ml-auto group-hover:text-cyan-400 transition-colors shrink-0" />
            </Link>

            <Link href="/home#schedule" className="group flex items-center gap-4 p-4 sm:p-6 bg-[#0f1535] border border-cyan-500/20 rounded-xl hover:border-cyan-400/50 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base">Schedule</h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Upcoming matches</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 ml-auto group-hover:text-cyan-400 transition-colors shrink-0" />
            </Link>

            <Link href="/home#highlights" className="group flex items-center gap-4 p-4 sm:p-6 bg-[#0f1535] border border-cyan-500/20 rounded-xl hover:border-cyan-400/50 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center shrink-0">
                <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base">Highlights</h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Best moments replay</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 ml-auto group-hover:text-cyan-400 transition-colors shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sports Grid Section */}
      <section id="categories" className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center">All Sports</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 auto-rows-[120px] sm:auto-rows-[200px]">
            {sportsImages.map((image, index) => (
              <div 
                key={index}
                className={`${image.span} relative rounded-lg overflow-hidden group cursor-pointer`}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#0a0e27]/40 group-hover:bg-[#0a0e27]/20 transition-colors" />
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                  <span className="text-white font-semibold text-xs sm:text-sm">{image.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-cyan-500/20">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-xs sm:text-sm">
          <p>&copy; 2026 Freefit.com. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}