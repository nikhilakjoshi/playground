"use client";

import React, { useEffect, useState, useRef } from "react";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { SkipBack, SkipForward, Play, Pause } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./ui/button";

interface VoiceAnalysisProps {
  className?: string;
}

export function VoiceAnalysis({ className = "" }: VoiceAnalysisProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const audioInitialized = useRef(false);

  // Initialize the voice visualizer controls
  const recorderControls = useVoiceVisualizer();
  const {
    setPreloadedAudioBlob,
    duration,
    currentAudioTime,
    togglePauseResume,
    isPausedRecordedAudio,
  } = recorderControls;

  // Sample compliance data for podcast analysis
  const complianceData = [
    {
      start: 120,
      end: 180,
      type: "non-compliant",
      message: "Inappropriate content detected",
    },
    { start: 300, end: 420, type: "compliant", message: "Clean conversation" },
    {
      start: 600,
      end: 720,
      type: "non-compliant",
      message: "Profanity detected",
    },
    {
      start: 900,
      end: 1200,
      type: "compliant",
      message: "Educational content",
    },
  ];

  // Initialize audio once
  useEffect(() => {
    if (audioInitialized.current) return;

    const loadPodcastAudio = async () => {
      try {
        audioInitialized.current = true;
        setIsLoading(true);
        setError(null);

        // Load the Joe Rogan podcast episode
        const audioFileName = "echoes.mp3";
        const response = await fetch(`/${encodeURIComponent(audioFileName)}`);

        if (!response.ok) {
          throw new Error(`Failed to load audio file: ${response.status}`);
        }

        const audioBlob = await response.blob();

        if (audioBlob.size === 0) {
          throw new Error("Empty audio file");
        }

        console.log("Loaded podcast audio:", audioBlob.type, audioBlob.size);
        setPreloadedAudioBlob(audioBlob);
        setIsLoading(false);
      } catch (err) {
        console.error("Audio loading error:", err);
        setError(err as Error);
        setIsLoading(false);
      }
    };

    loadPodcastAudio();
  }, [setPreloadedAudioBlob]); // No dependencies to prevent re-runs

  const skipSeconds = (seconds: number) => {
    const audio = recorderControls.audioRef?.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentAudioTime + seconds));
    audio.currentTime = newTime;
  };

  const togglePlayPause = () => {
    // Use the VoiceVisualizer's built-in toggle method to ensure proper sync
    togglePauseResume();
  };

  // Listen for audio events to keep play state in sync
  //   useEffect(() => {
  //     const audio = recorderControls.audioRef?.current;
  //     if (!audio) return;

  //     const updatePlayState = () => {
  //       setIsPlaying(!audio.paused);
  //     };

  //     // Listen to multiple events to ensure we catch all state changes
  //     const handlePlay = () => setIsPlaying(true);
  //     const handlePause = () => setIsPlaying(false);
  //     const handleEnded = () => setIsPlaying(false);
  //     const handleTimeUpdate = updatePlayState;

  //     audio.addEventListener("play", handlePlay);
  //     audio.addEventListener("pause", handlePause);
  //     audio.addEventListener("ended", handleEnded);
  //     audio.addEventListener("timeupdate", handleTimeUpdate);

  //     // Initial state sync
  //     updatePlayState();

  //     return () => {
  //       audio.removeEventListener("play", handlePlay);
  //       audio.removeEventListener("pause", handlePause);
  //       audio.removeEventListener("ended", handleEnded);
  //       audio.removeEventListener("timeupdate", handleTimeUpdate);
  //     };
  //   }, [recorderControls.audioRef]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (error) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-sm border ${className}`}>
        <div className="text-center text-red-600">
          <p>Error loading audio: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Voice Analysis</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Non-compliant</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => skipSeconds(-10)}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          <SkipBack className="w-4 h-4" />
          <span className="text-sm">10 Seconds</span>
        </button>

        <button
          onClick={() => skipSeconds(10)}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          <span className="text-sm">+10 seconds</span>
          <SkipForward className="w-4 h-4" />
        </button>

        <Button
          onClick={togglePlayPause}
          className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 transition-colors text-black rounded-full"
          size="icon-sm"
          disabled={isLoading}
        >
          {!isPausedRecordedAudio ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {/* <span className="text-sm">
            {!isPausedRecordedAudio ? "Pause" : "Play"}
          </span> */}
        </Button>

        {/* <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-gray-600" />
        </div> */}
      </div>

      {/* Waveform Container */}
      <div className="relative mb-4">
        <div className="rounded-lg p-4">
          {/* Time indicator */}
          {/* <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">
              {formatTime(currentAudioTime || 0)}
            </span>
            <span className="text-xs text-gray-500">
              {formatTime(duration || 0)}
            </span>
          </div> */}

          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center justify-center h-24 bg-white rounded border">
              <div className="text-sm text-gray-500">Loading audio...</div>
            </div>
          ) : (
            <ScrollArea className="w-full">
              <div
                className="relative"
                style={{ minWidth: duration > 1800 ? "200%" : "100%" }}
              >
                <VoiceVisualizer
                  controls={recorderControls}
                  height={96}
                  width="100%"
                  backgroundColor="#ffffff"
                  mainBarColor="#22c55e"
                  secondaryBarColor="#e0e0e0"
                  barWidth={4}
                  gap={1}
                  rounded={5}
                  isControlPanelShown={false}
                  isDownloadAudioButtonShown={false}
                  animateCurrentPick={true}
                  isProgressIndicatorShown={true}
                  isProgressIndicatorTimeShown={true}
                />

                {/* Compliance overlays */}
                {duration > 0 && (
                  <div className="absolute top-0 left-0 w-full h-24 pointer-events-none">
                    {complianceData.map((item, index) => {
                      const startPercent = (item.start / duration) * 100;
                      const widthPercent =
                        ((item.end - item.start) / duration) * 100;

                      return (
                        <div
                          key={index}
                          className={`absolute top-0 h-full opacity-20 ${
                            item.type === "compliant"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            left: `${startPercent}%`,
                            width: `${widthPercent}%`,
                          }}
                          title={item.message}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Timeline */}
          <ScrollArea className="w-full">
            <div
              className="flex justify-between mt-2 text-xs text-gray-400"
              style={{ minWidth: duration > 1800 ? "200%" : "100%" }}
            >
              <span>00:00</span>
              <span>{formatTime(duration * 0.25)}</span>
              <span>{formatTime(duration * 0.5)}</span>
              <span>{formatTime(duration * 0.75)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Duration display */}
      <div className="text-right">
        <span className="text-sm text-gray-600">
          {formatTime(duration || 0)}
        </span>
      </div>
    </div>
  );
}

export default VoiceAnalysis;
