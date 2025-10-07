"use client";

import React, { useEffect, useState, useRef } from "react";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { SkipBack, SkipForward, Volume2 } from "lucide-react";

interface VoiceAnalysisProps {
  audioSrc?: string;
  className?: string;
}

export function VoiceAnalysis({ className = "" }: VoiceAnalysisProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const hasInitialized = useRef(false);

  // Initialize the voice visualizer controls
  const recorderControls = useVoiceVisualizer();
  const { setPreloadedAudioBlob, duration, currentAudioTime } =
    recorderControls;

  // Sample compliance data - in real implementation, this would come from props or API
  const complianceData = [
    { start: 5, end: 15, type: "non-compliant", message: "Non-compliant: 2" },
    { start: 25, end: 35, type: "compliant", message: "Compliant section" },
  ];

  // Generate a simple test audio using Web Audio API
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    let isMounted = true;

    const generateTestAudio = async () => {
      if (!isMounted) return;

      try {
        setIsLoading(true);
        setError(null);

        // Create AudioContext
        const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;
        if (!AudioContextClass) {
          throw new Error("Web Audio API not supported");
        }
        const audioContext = new AudioContextClass();

        // Create a 5-second audio buffer with some tones
        const sampleRate = audioContext.sampleRate;
        const duration = 5;
        const length = sampleRate * duration;
        const audioBuffer = audioContext.createBuffer(1, length, sampleRate);
        const channelData = audioBuffer.getChannelData(0);

        // Generate a simple waveform with varying frequencies
        for (let i = 0; i < length; i++) {
          const time = i / sampleRate;
          // Mix different frequencies to create an interesting waveform
          const frequency1 = 440; // A note
          const frequency2 = 880; // A note octave higher
          const frequency3 = 220; // A note octave lower

          const amplitude1 = Math.sin(2 * Math.PI * frequency1 * time) * 0.3;
          const amplitude2 = Math.sin(2 * Math.PI * frequency2 * time) * 0.2;
          const amplitude3 = Math.sin(2 * Math.PI * frequency3 * time) * 0.1;

          // Add some envelope to make it more interesting
          const envelope = Math.max(
            0,
            1 - Math.abs(time - duration / 2) / (duration / 2)
          );

          channelData[i] = (amplitude1 + amplitude2 + amplitude3) * envelope;
        }

        // Convert AudioBuffer to WAV blob
        const wavBlob = audioBufferToWav(audioBuffer);

        if (isMounted) {
          console.log("Generated audio blob:", wavBlob.type, wavBlob.size);
          setPreloadedAudioBlob(wavBlob);
          setIsLoading(false);
        }

        // Clean up AudioContext
        audioContext.close();
      } catch (error) {
        if (isMounted) {
          console.error("Error generating audio:", error);
          setError(error as Error);
          setIsLoading(false);
        }
      }
    };

    generateTestAudio();

    return () => {
      isMounted = false;
    };
  }, [setPreloadedAudioBlob]); // Keep the dependency but use hasInitialized to prevent multiple runs

  // Helper function to convert AudioBuffer to WAV blob
  const audioBufferToWav = (buffer: AudioBuffer) => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, length * numberOfChannels * 2, true);

    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(
          -1,
          Math.min(1, buffer.getChannelData(channel)[i])
        );
        view.setInt16(offset, sample * 0x7fff, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  };

  const skipSeconds = (seconds: number) => {
    const audio = recorderControls.audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentAudioTime + seconds));
    audio.currentTime = newTime;
  };

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

        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-gray-600" />
        </div>
      </div>

      {/* Waveform Container */}
      <div className="relative mb-4">
        <div className="bg-gray-50 rounded-lg p-4">
          {/* Time indicator */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">
              {formatTime(currentAudioTime)}
            </span>
            <span className="text-xs text-gray-500">
              {formatTime(duration)}
            </span>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center h-24 bg-white rounded border">
              <div className="text-sm text-gray-500">Loading audio...</div>
            </div>
          )}

          {/* React Voice Visualizer Component */}
          {!isLoading && (
            <div className="relative">
              <VoiceVisualizer
                controls={recorderControls}
                height={96}
                width="100%"
                backgroundColor="#ffffff"
                mainBarColor="#22c55e"
                secondaryBarColor="#ef4444"
                barWidth={2}
                gap={1}
                rounded={2}
                isControlPanelShown={true}
                isDownloadAudioButtonShown={false}
                animateCurrentPick={true}
                isProgressIndicatorShown={true}
                isProgressIndicatorTimeShown={true}
                isProgressIndicatorOnHoverShown={true}
                isProgressIndicatorTimeOnHoverShown={true}
              />

              {/* Compliance overlays on top of visualizer */}
              <div className="absolute top-0 left-0 w-full h-24 pointer-events-none">
                {complianceData.map((item, index) => {
                  const startPercent =
                    duration > 0 ? (item.start / duration) * 100 : 0;
                  const widthPercent =
                    duration > 0
                      ? ((item.end - item.start) / duration) * 100
                      : 0;

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
            </div>
          )}

          {/* Timeline */}
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>00:00:00</span>
            <span>00:02:00</span>
            <span>00:04:00</span>
            <span>00:06:00</span>
          </div>
        </div>

        {/* Non-compliant indicator */}
        {currentAudioTime >= 5 && currentAudioTime <= 15 && (
          <div className="absolute top-2 left-1/4 bg-red-500 text-white px-3 py-2 rounded-md text-xs shadow-lg">
            <div className="font-semibold">{formatTime(currentAudioTime)}</div>
            <div className="text-red-100">Non-compliant: 2</div>
          </div>
        )}
      </div>

      {/* Duration display */}
      <div className="text-right">
        <span className="text-sm text-gray-600">{formatTime(duration)}</span>
      </div>
    </div>
  );
}

export default VoiceAnalysis;
