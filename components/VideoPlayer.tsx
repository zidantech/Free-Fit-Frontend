"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

export default function VideoPlayer({ src, poster, autoPlay = false, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleLoaded = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current && duration) {
      const time = (parseFloat(e.target.value) / 100) * duration;
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`relative group bg-black rounded-lg overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        className="w-full h-full object-cover"
        onClick={togglePlay}
        playsInline
      />

      {/* Center Play Button (when paused) */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-400/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-cyan-400/30">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#0a0e27] ml-1" fill="currentColor" />
          </div>
        </button>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 sm:h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer mb-3 accent-cyan-400"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={togglePlay} className="text-white hover:text-cyan-400 transition-colors">
              {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            <button onClick={() => { if (videoRef.current) videoRef.current.currentTime -= 10; }} className="text-white hover:text-cyan-400 transition-colors hidden sm:block">
              <SkipBack className="w-5 h-5" />
            </button>

            <button onClick={() => { if (videoRef.current) videoRef.current.currentTime += 10; }} className="text-white hover:text-cyan-400 transition-colors hidden sm:block">
              <SkipForward className="w-5 h-5" />
            </button>

            <button onClick={toggleMute} className="text-white hover:text-cyan-400 transition-colors">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <span className="text-white text-xs sm:text-sm font-mono">
              {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
            </span>
          </div>

          <button onClick={handleFullscreen} className="text-white hover:text-cyan-400 transition-colors">
            <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}