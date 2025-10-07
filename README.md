This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Voice Analysis Components

This project includes two voice analysis implementations for audio waveform visualization and compliance monitoring:

### Components

1. **React Voice Visualizer** (`voice-analysis-v2.tsx`) - Original implementation
2. **Wavesurfer.js** (`voice-analysis-wavesurfer.tsx`) - New implementation with advanced features

### Features Comparison

#### React Voice Visualizer

- React-specific implementation
- Built-in recording capabilities
- Simpler integration
- Basic waveform rendering
- Limited customization

#### Wavesurfer.js Implementation

- High-performance canvas rendering
- Advanced zoom functionality with mouse wheel and buttons
- Interactive regions with drag/resize capabilities
- Timeline display for better navigation
- Real-time playback controls
- Visual compliance markers (green for compliant, red for non-compliant)
- Extensive plugin ecosystem

### Demo Pages

- `/voice-analysis-demo` - Side-by-side comparison of both components
- `/wavesurfer-demo` - Standalone wavesurfer implementation

### Installation

The project includes the necessary wavesurfer.js dependencies:

```bash
npm install wavesurfer.js @wavesurfer/react
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Navigate to the voice analysis demos using the navigation bar or directly:

- [Voice Analysis Comparison](http://localhost:3000/voice-analysis-demo)
- [Wavesurfer Demo](http://localhost:3000/wavesurfer-demo)

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
