"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { authAPI } from "@/lib/api";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check auth status on mount
    const checkAuth = () => {
      const authenticated = authAPI.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        // Try to get user from localStorage or fetch profile
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    };

    checkAuth();

    // Listen for storage changes (login from another tab)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e27]/90 backdrop-blur-sm border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-cyan-400 tracking-wide">
          Free-fit.com
        </Link>

        <div className="flex items-center gap-8">
          <Link href="/#live" className="text-white hover:text-cyan-400 transition-colors font-medium uppercase text-sm tracking-wider">
            Live
          </Link>
          <Link href="/#schedule" className="text-white hover:text-cyan-400 transition-colors font-medium uppercase text-sm tracking-wider">
            Schedule
          </Link>
          <Link href="/#highlights" className="text-white hover:text-cyan-400 transition-colors font-medium uppercase text-sm tracking-wider">
            Highlights
          </Link>
          <Link href="/#news" className="text-white hover:text-cyan-400 transition-colors font-medium uppercase text-sm tracking-wider">
            News
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {user?.avatar && (
                <img 
                  src={user.avatar} 
                  alt={user.name || "User"} 
                  className="w-8 h-8 rounded-full border border-cyan-400"
                />
              )}
              <button 
                onClick={handleLogout}
                className="px-6 py-2 border border-red-400 text-red-400 rounded-full hover:bg-red-400 hover:text-white transition-all font-medium text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              href="/signin" 
              className="px-6 py-2 border border-cyan-400 text-cyan-400 rounded-full hover:bg-cyan-400 hover:text-[#0a0e27] transition-all font-medium text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}