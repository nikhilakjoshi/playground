"use client";

import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useWavesurfer } from "@wavesurfer/react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "./ui/button";
// Import Timeline plugin
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";

const VoiceAnalysisWorking = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { wavesurfer, isPlaying, currentTime, isReady } = useWavesurfer({
    container: containerRef,
    height: 120,
    waveColor: "#8b5cf6",
    progressColor: "#7c3aed",
    cursorColor: "#fbbf24",
    barWidth: 2,
    barRadius: 1,

    url: mounted ? "/Tauba.mp3" : undefined,
    plugins: useMemo(
      () => [
        Timeline.create({
          height: 20,
          insertPosition: "beforebegin",
          timeInterval: 0.2,
          primaryLabelInterval: 5,
          secondaryLabelInterval: 1,
          style: {
            fontSize: "10px",
            color: "#2563eb",
          },
        }),
      ],
      []
    ),
  });

  const playPause = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  }, [wavesurfer]);

  const skipBackward = useCallback(() => {
    if (wavesurfer) {
      const currentTime = wavesurfer.getCurrentTime();
      wavesurfer.seekTo(
        Math.max(0, (currentTime - 10) / wavesurfer.getDuration())
      );
    }
  }, [wavesurfer]);

  const skipForward = useCallback(() => {
    if (wavesurfer) {
      const currentTime = wavesurfer.getCurrentTime();
      const duration = wavesurfer.getDuration();
      wavesurfer.seekTo(Math.min(1, (currentTime + 10) / duration));
    }
  }, [wavesurfer]);

  const handleZoom = useCallback(
    (factor: number) => {
      if (wavesurfer) {
        const currentZoom = wavesurfer.options.minPxPerSec || 50;
        wavesurfer.zoom(currentZoom * factor);
      }
    },
    [wavesurfer]
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!mounted) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">Loading audio player...</div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">
          Voice Analysis - Working Version
        </h3>
        <p className="text-gray-600 text-sm">
          Status: {isReady ? "Ready ✅" : "Loading..."} | Audio: Tauba.mp3
        </p>
      </div>

      {/* Waveform Container */}
      <div className="mb-4 border rounded-lg bg-gray-50 p-2">
        <div
          ref={containerRef}
          style={{ minHeight: "140px" }} // Slightly taller for timeline
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={skipBackward}
            disabled={!isReady}
          >
            <SkipBack className="h-4 w-4" />
            <span className="ml-1">10s</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={playPause}
            disabled={!isReady}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={skipForward}
            disabled={!isReady}
          >
            <span className="mr-1">10s</span>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!isReady}
            onClick={() => handleZoom(0.8)}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!isReady}
            onClick={() => handleZoom(1.25)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Time Info */}
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <span>Current: {formatTime(currentTime || 0)}</span>
        <span>
          Duration:{" "}
          {wavesurfer ? formatTime(wavesurfer.getDuration() || 0) : "00:00"}
        </span>
      </div>

      {/* Debug Info */}
      <div className="mt-4 text-xs text-gray-500 border-t pt-2">
        <p>Playing: {isPlaying ? "Yes" : "No"}</p>
        <p>Ready: {isReady ? "Yes" : "No"}</p>
        <p>WaveSurfer: {wavesurfer ? "Created" : "Not created"}</p>
        <p>Current Time: {currentTime?.toFixed(2) || "0.00"}s</p>
      </div>
    </div>
  );
};

export default VoiceAnalysisWorking;
