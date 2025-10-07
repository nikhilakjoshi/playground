"use client";

import React, { useRef, useEffect, useState } from "react";
import { useWavesurfer } from "@wavesurfer/react";

export function SimpleWavesurferTest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: "#22c55e",
    progressColor: "#059669",
    url: mounted ? "/Tauba.mp3" : undefined,
  });

  if (!mounted) {
    return (
      <div className="p-4 border rounded">
        <h3>Simple Wavesurfer Test</h3>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded">
      <h3>Simple Wavesurfer Test</h3>
      <div>Wavesurfer: {wavesurfer ? "✅ Created" : "❌ Not created"}</div>
      <div>Playing: {isPlaying ? "▶️ Yes" : "⏸️ No"}</div>
      <div>Time: {currentTime?.toFixed(2) || "0.00"}s</div>
      <div
        ref={containerRef}
        className="mt-4 border"
        style={{ height: "100px" }}
      />
      {wavesurfer && (
        <button
          onClick={() => wavesurfer.playPause()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      )}
    </div>
  );
}
