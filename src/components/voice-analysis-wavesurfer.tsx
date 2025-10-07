"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useWavesurfer } from "@wavesurfer/react";
import {
  SkipBack,
  SkipForward,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./ui/button";

// Import wavesurfer plugins - temporarily commented out for debugging
// import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
// import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.esm.js";
// import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";

// Type imports for better type safety
// type RegionsPluginType = InstanceType<typeof RegionsPlugin>;

interface VoiceAnalysisWavesurferProps {
  className?: string;
}

export function VoiceAnalysisWavesurfer({
  className = "",
}: VoiceAnalysisWavesurferProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentZoom, setCurrentZoom] = useState(100);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Separate timeout effect - increased timeout since we know it works
  useEffect(() => {
    if (!mounted) return;

    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log("Loading timeout reached");
        setError(
          new Error(
            "Audio loading timeout - this may be due to a large file size"
          )
        );
        setIsLoading(false);
      }
    }, 15000); // 15 second timeout since we know it can work

    return () => clearTimeout(timeout);
  }, [mounted, isLoading]);

  // Sample compliance data for podcast analysis
  const complianceData = useMemo(
    () => [
      {
        start: 2,
        end: 8,
        type: "non-compliant",
        message: "Inappropriate content detected",
      },
      { start: 12, end: 18, type: "compliant", message: "Clean conversation" },
      {
        start: 22,
        end: 28,
        type: "non-compliant",
        message: "Profanity detected",
      },
      {
        start: 32,
        end: 40,
        type: "compliant",
        message: "Educational content",
      },
    ],
    []
  );

  // Use a working web URL instead of local file to test basic functionality
  const { wavesurfer, isPlaying, currentTime, isReady } = useWavesurfer({
    container: containerRef,
    height: 96,
    waveColor: "#22c55e",
    progressColor: "#059669",
    url: mounted ? "/Tauba.mp3" : undefined,
    // Add additional options that might help
    backend: "WebAudio",
    mediaControls: false,
    normalize: true,
  });

  // Handle zoom changes
  useEffect(() => {
    if (wavesurfer) {
      console.log("Wavesurfer instance created, setting up zoom listener");
      wavesurfer.on("zoom", (minPxPerSec) => {
        setCurrentZoom(Math.round(minPxPerSec));
      });
    }
  }, [wavesurfer]);

  // Debug effect to track wavesurfer state
  useEffect(() => {
    console.log("Wavesurfer instance:", wavesurfer ? "exists" : "null");
    console.log("Container ref:", containerRef.current ? "exists" : "null");
    console.log("Mounted:", mounted);
  }, [wavesurfer, mounted]);

  // Initialize regions and handle loading states
  useEffect(() => {
    if (!wavesurfer) return;

    console.log("Setting up wavesurfer event listeners");

    const handleReady = () => {
      console.log("Wavesurfer ready event fired");
      setIsLoading(false);
      setError(null); // Clear any previous errors

      // Temporarily commented out regions for debugging
      /*
      // Get the regions plugin
      const regionsPlugin = wavesurfer
        .getActivePlugins()
        .find(
          (plugin) => plugin.constructor.name === "RegionsPlugin"
        ) as unknown as RegionsPluginType;

      if (regionsPlugin) {
        console.log("Adding compliance regions");
        // Clear existing regions
        regionsPlugin.clearRegions();

        // Create compliance regions
        complianceData.forEach((item) => {
          regionsPlugin.addRegion({
            start: item.start,
            end: item.end,
            content: item.message,
            color:
              item.type === "compliant"
                ? "rgba(34, 197, 94, 0.3)" // green
                : "rgba(239, 68, 68, 0.3)", // red
            drag: true,
            resize: true,
          });
        });
      }
      */
    };

    const handleLoad = () => {
      console.log("Wavesurfer load event fired");
      setError(null);
    };

    const handleError = (err: Error) => {
      console.error("Wavesurfer error:", err);
      setError(new Error(`Failed to load audio file: ${err.message}`));
      setIsLoading(false);
    };

    wavesurfer.on("ready", handleReady);
    wavesurfer.on("load", handleLoad);
    wavesurfer.on("error", handleError);

    return () => {
      wavesurfer.un("ready", handleReady);
      wavesurfer.un("load", handleLoad);
      wavesurfer.un("error", handleError);
    };
  }, [wavesurfer, complianceData]);

  const skipSeconds = useCallback(
    (seconds: number) => {
      if (!wavesurfer) return;
      const duration = wavesurfer.getDuration();
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      wavesurfer.seekTo(newTime / duration);
    },
    [wavesurfer, currentTime]
  );

  const togglePlayPause = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  }, [wavesurfer]);

  const handleZoomIn = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.zoom(currentZoom * 1.2);
    }
  }, [wavesurfer, currentZoom]);

  const handleZoomOut = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.zoom(currentZoom / 1.2);
    }
  }, [wavesurfer, currentZoom]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (!mounted) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-sm border ${className}`}>
        <div className="text-center text-gray-500">
          <p>Initializing...</p>
        </div>
      </div>
    );
  }

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
        <h3 className="text-lg font-semibold text-gray-900">
          Voice Analysis (Wavesurfer.js)
        </h3>
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
          disabled={!isReady}
        >
          <SkipBack className="w-4 h-4" />
          <span className="text-sm">10s</span>
        </button>

        <Button
          onClick={togglePlayPause}
          className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 transition-colors text-black rounded-full"
          size="icon-sm"
          disabled={!isReady}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>

        <button
          onClick={() => skipSeconds(10)}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          disabled={!isReady}
        >
          <span className="text-sm">10s</span>
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Zoom controls */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleZoomOut}
            className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            disabled={!isReady}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {currentZoom}px/s
          </span>
          <button
            onClick={handleZoomIn}
            className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            disabled={!isReady}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Waveform Container */}
      <div className="relative mb-4">
        <div className="rounded-lg p-4 border">
          {/* Loading state */}
          {!isReady ? (
            <div className="flex items-center justify-center h-24 bg-white rounded">
              <div className="text-sm text-gray-500">Loading audio...</div>
            </div>
          ) : (
            <ScrollArea className="w-full">
              <div
                ref={containerRef}
                className="relative"
                style={{
                  minWidth: currentZoom > 150 ? "200%" : "100%",
                  height: "120px",
                }}
              />
            </ScrollArea>
          )}
        </div>
      </div>

      {/* Time and Duration display */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {formatTime(currentTime || 0)}
        </span>
        <span className="text-sm text-gray-600">
          {wavesurfer ? formatTime(wavesurfer.getDuration() || 0) : "00:00"}
        </span>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          📖 Scroll over the waveform to zoom in/out. Drag and resize the
          colored regions to adjust compliance markers.
        </p>
      </div>
    </div>
  );
}

export default VoiceAnalysisWavesurfer;
