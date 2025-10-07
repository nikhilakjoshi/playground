"use client";

import React, { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export function ManualWavesurferTest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs((prev) => [
      ...prev.slice(-4),
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    if (!containerRef.current) {
      addLog("Container ref not available");
      return;
    }

    addLog("Creating WaveSurfer instance");

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#22c55e",
      progressColor: "#059669",
      height: 100,
    });

    ws.on("ready", () => {
      addLog("WaveSurfer ready event fired");
      setIsLoading(false);
    });

    ws.on("loading", (percent) => {
      addLog(`Loading: ${percent}%`);
    });

    ws.on("error", (err) => {
      addLog(`Error: ${err.message}`);
      setError(err.message);
      setIsLoading(false);
    });

    ws.on("play", () => {
      addLog("Play event");
      setIsPlaying(true);
    });

    ws.on("pause", () => {
      addLog("Pause event");
      setIsPlaying(false);
    });

    setWavesurfer(ws);

    // Try to load the audio
    addLog("Loading audio: /Tauba.mp3");
    ws.load("/Tauba.mp3");

    return () => {
      addLog("Cleaning up WaveSurfer");
      ws.destroy();
    };
  }, []);

  return (
    <div className="p-4 border rounded">
      <h3>Manual WaveSurfer Test</h3>
      <div className="mb-2">
        Status:{" "}
        {isLoading
          ? "🔄 Loading..."
          : error
          ? `❌ Error: ${error}`
          : "✅ Ready"}
      </div>
      <div className="mb-2">Playing: {isPlaying ? "▶️ Yes" : "⏸️ No"}</div>

      <div
        ref={containerRef}
        className="mt-4 border bg-gray-50"
        style={{ height: "100px", minHeight: "100px" }}
      />

      {wavesurfer && (
        <button
          onClick={() => wavesurfer.playPause()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      )}

      <div className="mt-4">
        <h4 className="font-semibold">Debug Logs:</h4>
        <div className="text-xs bg-gray-100 p-2 rounded max-h-32 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
