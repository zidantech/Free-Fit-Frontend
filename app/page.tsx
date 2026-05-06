"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import Navbar from "@/components/Navbar";

const sportsImages = [
  {
    src: "https://images.unsplash.com/photo-1728116693268-125c5d6ad9e2?w=800&q=80",
    alt: "Formula 1 Racing",
    span: "col-span-2 row-span-1"
  },
  {
    src: "https://images.unsplash.com/photo-1629977007371-0ba395424741?w=800&q=80",
    alt: "Football Action",
    span: "col-span-1 row-span-1"
  },
  {
    src: "https://images.unsplash.com/photo-1719518701287-72bb9b3366ee?w=800&q=80",
    alt: "American Football",
    span: "col-span-1 row-span-1"
  },
  {
    src: "https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?w=800&q=80",
    alt: "Boxing Match",
    span: "col-span-1 row-span-1"
  },
  {
    src: "https://images.unsplash.com/photo-1651179602825-a5cb093cd467?w=800&q=80",
    alt: "Baseball Game",
    span: "col-span-2 row-span-1"
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1676634832558-6654a134e920?w=800&q=80",
    alt: "Basketball Game",
    span: "col-span-1 row-span-1"
  },
  {
    src: "https://images.unsplash.com/flagged/photo-1576972405668-2d020a01cbfa?w=800&q=80",
    alt: "Tennis Player",
    span: "col-span-1 row-span-1"
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1664910059954-9fba97bc5d6e?w=800&q=80",
    alt: "Boxing Training",
    span: "col-span-1 row-span-1"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Navbar />

      {/* Hero Video Section */}
      <section className="pt-24 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-cyan-400 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-cyan-400/30">
                <Play className="w-10 h-10 text-[#0a0e27] ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Sports CTA Section */}
      <section 
        className="relative py-24 px-6"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1629977007371-0ba395424741?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#0a0e27]/80" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-cyan-400 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-400/30">
            <Play className="w-8 h-8 text-[#0a0e27] ml-1" fill="currentColor" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider">
            Live Sports
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Stream the biggest matches and events from across the continent in HD
          </p>
          <Link 
            href="/signup"
            className="inline-block px-12 py-3 bg-[#5a5a5a] text-cyan-400 rounded-full font-semibold text-lg hover:bg-[#6a6a6a] transition-colors tracking-wide"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Sports Grid Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-4 auto-rows-[200px]">
            {sportsImages.map((image, index) => (
              <div 
                key={index}
                className={`${image.span} relative rounded-lg overflow-hidden group cursor-pointer`}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#0a0e27]/40 group-hover:bg-[#0a0e27]/20 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-cyan-500/20">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2026 Free-Fit.com. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}