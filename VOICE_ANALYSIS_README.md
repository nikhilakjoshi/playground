# Voice Analysis Component

A self-contained React component for displaying audio waveforms with playback controls and compliance indicators.

## Features

- **Audio Playback**: Play/pause controls with seeking functionality
- **Waveform Visualization**: Custom animated waveform with compliance coloring
- **Click-to-Seek**: Click anywhere on the waveform to jump to that position
- **Compliance Indicators**: Visual indicators for compliant/non-compliant sections
- **Progress Tracking**: Real-time progress indicator with timestamps
- **Skip Controls**: 10-second forward/backward skip buttons
- **Responsive Design**: Works on different screen sizes

## Usage

```tsx
import VoiceAnalysis from "@/components/voice-analysis";

// Basic usage with default sample audio
export default function MyPage() {
  return (
    <div>
      <VoiceAnalysis />
    </div>
  );
}

// With custom audio source
export default function MyPage() {
  return (
    <div>
      <VoiceAnalysis
        audioSrc="https://example.com/my-audio-file.mp3"
        className="my-custom-class"
      />
    </div>
  );
}
```

## Props

| Prop        | Type     | Default          | Description                      |
| ----------- | -------- | ---------------- | -------------------------------- |
| `audioSrc`  | `string` | Sample audio URL | URL to the audio file to analyze |
| `className` | `string` | `''`             | Additional CSS classes to apply  |

## Features Breakdown

### Waveform Display

- 200 individual bars representing audio segments
- Green bars for compliant sections
- Red bars for non-compliant sections
- Gray bars for unplayed sections

### Playback Controls

- Play/Pause button with visual feedback
- Skip backward 10 seconds
- Skip forward 10 seconds
- Volume indicator

### Progress Tracking

- Real-time timestamp display
- Progress indicator line
- Duration display
- Click-to-seek functionality

### Compliance Indicators

- Legend showing compliant/non-compliant colors
- Overlay indicators for specific violations
- Real-time compliance status display

## Dependencies

The component uses the following dependencies:

- `react` - React framework
- `lucide-react` - Icons
- `tailwindcss` - Styling

## Browser Support

- Modern browsers with HTML5 audio support
- Chrome, Firefox, Safari, Edge

## Example Integration

```tsx
// In a call details page
import VoiceAnalysis from "@/components/voice-analysis";

export default function CallDetailsPage({ callId }: { callId: string }) {
  const audioUrl = `https://api.example.com/calls/${callId}/audio`;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1>Call Analysis</h1>

      <VoiceAnalysis audioSrc={audioUrl} className="mt-6" />

      {/* Other call details */}
    </div>
  );
}
```

## Customization

The component is fully styled with Tailwind CSS classes and can be customized by:

1. **Styling**: Override classes using the `className` prop
2. **Colors**: Modify the compliance colors in the component source
3. **Dimensions**: Adjust waveform height and bar count
4. **Audio Sources**: Support for various audio formats (MP3, WAV, etc.)

## File Structure

```
src/components/
└── voice-analysis.tsx    # Self-contained component file
```

The component is completely self-contained in a single file for easy lifting and shifting between projects.
