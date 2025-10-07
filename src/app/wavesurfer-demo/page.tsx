import VoiceAnalysisWavesurfer from "@/components/voice-analysis-wavesurfer";
import { SimpleWavesurferTest } from "@/components/simple-wavesurfer-test";
import { ManualWavesurferTest } from "@/components/manual-wavesurfer-test";
import VoiceAnalysisWorking from "@/components/voice-analysis-working";

export default function WavesurferDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Voice Analysis with Wavesurfer.js
        </h1>

        <div className="space-y-8">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Simple Wavesurfer Test
            </h3>
            <SimpleWavesurferTest />
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Manual Wavesurfer Test
            </h3>
            <ManualWavesurferTest />
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibent mb-4">
              Working Component with Timeline Plugin
            </h3>
            <VoiceAnalysisWorking />
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Original Complex Component (Debug)
            </h3>
            <VoiceAnalysisWavesurfer />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Features
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• High-performance waveform rendering using wavesurfer.js</li>
              <li>
                • Interactive zoom functionality with mouse wheel or buttons
              </li>
              <li>• Draggable and resizable compliance regions</li>
              <li>• Timeline display for better navigation</li>
              <li>• Real-time playback controls</li>
              <li>
                • Visual compliance markers (green for compliant, red for
                non-compliant)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
