import VoiceAnalysis from "@/components/voice-analysis-v2";
import VoiceAnalysisWavesurfer from "@/components/voice-analysis-wavesurfer";

export default function VoiceAnalysisDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Voice Analysis Components Comparison
        </h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              React Voice Visualizer (Original)
            </h2>
            <VoiceAnalysis />
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Wavesurfer.js Implementation (New)
            </h2>
            <VoiceAnalysisWavesurfer />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comparison
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  React Voice Visualizer
                </h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• React-specific implementation</li>
                  <li>• Built-in recording capabilities</li>
                  <li>• Simpler integration</li>
                  <li>• Basic waveform rendering</li>
                  <li>• Limited customization</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Wavesurfer.js
                </h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• High-performance canvas rendering</li>
                  <li>• Advanced zoom functionality</li>
                  <li>• Interactive regions with drag/resize</li>
                  <li>• Extensive plugin ecosystem</li>
                  <li>• Timeline and visualization features</li>
                  <li>• Better for complex audio analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
