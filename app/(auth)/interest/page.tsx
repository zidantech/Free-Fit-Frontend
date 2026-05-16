"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, userAPI, sportsAPI } from "@/lib/api";
import SportSelector from "@/components/SportSelector";
import { ArrowRight, Loader2 } from "lucide-react";

const defaultSports = [
  { id: "1", name: "Football", slug: "football", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099672.png" },
  { id: "2", name: "Tennis", slug: "tennis", icon: "https://cdn-icons-png.flaticon.com/128/2151/2151115.png" },
  { id: "3", name: "Basketball", slug: "basketball", icon: "https://cdn-icons-png.flaticon.com/128/317/317709.png" },
  { id: "4", name: "Cricket", slug: "cricket", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099683.png" },
  { id: "5", name: "Hockey", slug: "hockey", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099692.png" },
  { id: "6", name: "Golf", slug: "golf", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099710.png" },
  { id: "7", name: "Baseball", slug: "baseball", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099695.png" },
  { id: "8", name: "Wrestling", slug: "wrestling", icon: "https://cdn-icons-png.flaticon.com/128/2548/2548530.png" },
  { id: "9", name: "Formula 1", slug: "formula-1", icon: "https://cdn-icons-png.flaticon.com/128/2964/2964514.png" },
  { id: "10", name: "Boxing", slug: "boxing", icon: "https://cdn-icons-png.flaticon.com/128/2548/2548535.png" },
  { id: "11", name: "Rugby", slug: "rugby", icon: "https://cdn-icons-png.flaticon.com/128/1099/1099702.png" },
  { id: "12", name: "Athletics", slug: "athletics", icon: "https://cdn-icons-png.flaticon.com/128/2548/2548540.png" },
];

export default function InterestPage() {
  const router = useRouter();
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [sports, setSports] = useState(defaultSports);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!authAPI.isAuthenticated()) {
      router.push("/signin");
      return;
    }

    // Try to fetch sports from API
    const fetchSports = async () => {
      try {
        const data = await sportsAPI.getSports();
        if (data?.data && data.data.length > 0) {
          setSports(data.data);
        }
      } catch (err) {
        console.log("Using default sports");
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, [router]);

  const handleContinue = async () => {
    if (selectedSports.length === 0) {
      alert("Please select at least one sport");
      return;
    }

    setSaving(true);
    try {
      // Save interests to API
      await userAPI.updateInterests(selectedSports);

      // Also save to localStorage for quick access
      localStorage.setItem("interests", JSON.stringify(selectedSports));

      router.push("/home");
    } catch (err) {
      console.error("Failed to save interests:", err);
      // Still redirect even if API fails
      localStorage.setItem("interests", JSON.stringify(selectedSports));
      router.push("/home");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    router.push("/home");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0e27] px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
          Pick your interest
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mb-8 sm:mb-12">
          Select your favorite sports to get personalized content and recommendations
        </p>

        <SportSelector
          sports={sports}
          selected={selectedSports}
          onChange={setSelectedSports}
          multiSelect={true}
        />

        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base order-2 sm:order-1"
          >
            Skip for now
          </button>

          <button
            onClick={handleContinue}
            disabled={saving || selectedSports.length === 0}
            className="flex items-center gap-2 px-6 sm:px-8 py-3 bg-cyan-400 text-[#0a0e27] rounded-full font-semibold text-sm sm:text-base hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 w-full sm:w-auto justify-center"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {selectedSports.length > 0 && (
          <p className="mt-4 text-center text-cyan-400 text-sm">
            {selectedSports.length} sport{selectedSports.length !== 1 ? "s" : ""} selected
          </p>
        )}
      </div>
    </main>
  );
}