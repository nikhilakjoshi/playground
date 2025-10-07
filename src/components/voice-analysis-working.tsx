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
// Import Timeline and Regions plugins
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

// Define types for compliance regions
export type ComplianceType = "compliant" | "non-compliant" | "review-required";

export interface ComplianceRegion {
  id?: string;
  start: number;
  end: number;
  type: ComplianceType;
  content?: string;
  draggable?: boolean;
  resizable?: boolean;
}

interface VoiceAnalysisWorkingProps {
  audioUrl?: string;
  complianceRegions?: ComplianceRegion[];
  maxVisibleDuration?: number; // in minutes, default 4
  showDebugInfo?: boolean;
}

const VoiceAnalysisWorking: React.FC<VoiceAnalysisWorkingProps> = ({
  audioUrl = "/Tauba.mp3",
  complianceRegions = [],
  maxVisibleDuration = 4,
  showDebugInfo = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [regionsPlugin, setRegionsPlugin] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create plugins instance only on client side
  const plugins = useMemo(() => {
    if (!mounted) return [];

    const pluginsList = [];

    // Add Timeline plugin
    pluginsList.push(
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
      })
    );

    return pluginsList;
  }, [mounted]);

  const { wavesurfer, isPlaying, currentTime, isReady } = useWavesurfer({
    container: containerRef,
    height: 120,
    waveColor: "#8b5cf6",
    progressColor: "#7c3aed",
    cursorColor: "#fbbf24",
    barWidth: 2,
    barRadius: 1,
    // Set default zoom to show only 4 minutes (240 seconds)
    // Calculate minPxPerSec based on container width and desired visible duration
    minPxPerSec: 50, // We'll adjust this after getting duration

    url: mounted ? audioUrl : undefined,
    plugins,
  });

  // Helper function to get color for compliance type
  const getComplianceColor = (type: ComplianceType) => {
    switch (type) {
      case "compliant":
        return "rgba(34, 197, 94, 0.3)"; // Green
      case "non-compliant":
        return "rgba(239, 68, 68, 0.3)"; // Red
      case "review-required":
        return "rgba(245, 158, 11, 0.3)"; // Amber
      default:
        return "rgba(156, 163, 175, 0.3)"; // Gray
    }
  };

  // Helper function to get display name for compliance type
  const getComplianceDisplayName = (type: ComplianceType) => {
    switch (type) {
      case "compliant":
        return "Compliant Section";
      case "non-compliant":
        return "Non-compliant Section";
      case "review-required":
        return "Review Required";
      default:
        return "Unknown";
    }
  };

  // Initialize regions plugin after wavesurfer is ready
  useEffect(() => {
    if (wavesurfer && isReady && !regionsPlugin) {
      console.log("Creating regions plugin for initialized WaveSurfer");
      try {
        const newRegionsPlugin = RegionsPlugin.create();
        wavesurfer.registerPlugin(newRegionsPlugin);
        setRegionsPlugin(newRegionsPlugin);
        console.log("Regions plugin created and registered:", newRegionsPlugin);
      } catch (error) {
        console.error("Error creating regions plugin:", error);
      }
    }
  }, [wavesurfer, isReady, regionsPlugin]);

  // Set up default zoom and add compliance regions when audio is loaded
  useEffect(() => {
    if (wavesurfer && isReady && regionsPlugin && containerRef.current) {
      const setupZoomAndRegions = async () => {
        try {
          // Wait a bit longer for everything to be fully initialized
          await new Promise((resolve) => setTimeout(resolve, 300));

          const duration = wavesurfer.getDuration();
          const containerWidth = containerRef.current?.offsetWidth || 800;

          console.log(
            "Setting up zoom and regions, duration:",
            duration,
            "regions:",
            complianceRegions.length
          );

          // Calculate zoom to show only maxVisibleDuration minutes (or full duration if less)
          const maxVisibleSeconds = maxVisibleDuration * 60;
          const visibleDuration = Math.min(duration, maxVisibleSeconds);
          const targetPixelsPerSecond = containerWidth / visibleDuration;

          // Set the zoom
          wavesurfer.zoom(Math.max(50, targetPixelsPerSecond));

          // Clear any existing regions first
          if (regionsPlugin.clearRegions) {
            regionsPlugin.clearRegions();
          }

          // Add compliance regions from props
          complianceRegions.forEach((region, index) => {
            console.log(`Adding region ${index}:`, region);

            // Ensure region is within audio duration
            if (region.start < duration && region.end <= duration) {
              const regionConfig = {
                id: region.id || `region-${index}`,
                start: region.start,
                end: region.end,
                content:
                  region.content || getComplianceDisplayName(region.type),
                color: getComplianceColor(region.type),
                drag: region.draggable !== false,
                resize: region.resizable !== false,
              };

              console.log("Region config:", regionConfig);
              const addedRegion = regionsPlugin.addRegion(regionConfig);
              console.log("Added region:", addedRegion);
            } else {
              console.log(
                `Skipping region ${index} - outside duration`,
                region
              );
            }
          });

          console.log(
            "Total regions after adding:",
            regionsPlugin.getRegions
              ? regionsPlugin.getRegions().length
              : "unknown"
          );
        } catch (error) {
          console.error("Error setting up zoom and regions:", error);
        }
      };

      setupZoomAndRegions();
    }
  }, [
    wavesurfer,
    isReady,
    regionsPlugin,
    complianceRegions,
    maxVisibleDuration,
  ]);

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
          Voice Analysis - Enhanced with Regions & Auto-Zoom
        </h3>
        <p className="text-gray-600 text-sm">
          Status: {isReady ? "Ready ✅" : "Loading..."} | Audio:{" "}
          {audioUrl.split("/").pop()} | Zoom: {maxVisibleDuration}-min view |
          Regions: {complianceRegions.length} loaded
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
      {showDebugInfo && (
        <div className="mt-4 text-xs text-gray-500 border-t pt-2">
          <p>Playing: {isPlaying ? "Yes" : "No"}</p>
          <p>Ready: {isReady ? "Yes" : "No"}</p>
          <p>WaveSurfer: {wavesurfer ? "Created" : "Not created"}</p>
          <p>Regions Plugin: {regionsPlugin ? "Active" : "Not loaded"}</p>
          <p>Current Time: {currentTime?.toFixed(2) || "0.00"}s</p>
          <p>Compliance Regions: {complianceRegions.length}</p>
          <p className="text-blue-600">
            💡 Green = Compliant | Red = Non-compliant | Orange = Review
            Required
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceAnalysisWorking;
