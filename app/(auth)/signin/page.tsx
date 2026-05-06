"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic
  };

  return (
    <main className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="block text-2xl font-bold text-cyan-400 tracking-wide mb-12">
          Free-fit.com
        </Link>

        {/* Form Card */}
        <div className="border border-cyan-400/50 rounded-lg p-8 bg-[#0a0e27]/50">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back!</h1>
            <p className="text-gray-400">Login in and enjoy streaming in HD</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-lg font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Input your email"
                className="w-full px-4 py-3 bg-[#3a3a3a] border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white text-lg font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your Password"
                className="w-full px-4 py-3 bg-[#3a3a3a] border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-[#3a3a3a] border border-cyan-400/50 rounded accent-cyan-400"
                />
                <span className="text-gray-400 text-sm">Remember Me</span>
              </label>
              <Link href="#" className="text-gray-400 text-sm hover:text-cyan-400 transition-colors">
                Forget Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gray-300 text-[#0a0e27] rounded-full font-bold text-lg hover:bg-white transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white font-medium mb-4">Or continue with</p>
            <button className="w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
          </div>

          <p className="mt-6 text-center text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-white font-semibold hover:text-cyan-400 transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}