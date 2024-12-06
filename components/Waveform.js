'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function Waveform({ audioBlob }) {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment and on a large screen
    if (typeof window === 'undefined' || window.innerWidth < 768) return;

    if (!audioBlob || !containerRef.current) return;

    let audioUrl;
    let isMounted = true;

    const initWaveSurfer = async () => {
      try {
        // Create new WaveSurfer instance
        const wavesurfer = WaveSurfer.create({
          container: containerRef.current,
          waveColor: '#ef4444',
          progressColor: '#dc2626',
          cursorColor: '#f87171',
          barWidth: 2,
          barGap: 1,
          height: 100,
          responsive: true,
          normalize: true,
          backend: 'WebAudio',
          barRadius: 3,
        });

        // Set up event listeners
        wavesurfer.on('play', () => isMounted && setIsPlaying(true));
        wavesurfer.on('pause', () => isMounted && setIsPlaying(false));
        wavesurfer.on('ready', () => isMounted && setIsReady(true));

        // Load audio
        audioUrl = URL.createObjectURL(audioBlob);
        await wavesurfer.load(audioUrl);

        // Store reference
        wavesurferRef.current = wavesurfer;
      } catch (error) {
        console.error('Error initializing WaveSurfer:', error);
      }
    };

    initWaveSurfer();

    // Cleanup function
    return () => {
      isMounted = false;
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [audioBlob]);

  const handlePlayPause = () => {
    if (wavesurferRef.current && isReady) {
      wavesurferRef.current.playPause();
    }
  };

  // Don't render anything on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <div className="hidden md:block bg-black/50 rounded-lg p-6 mb-4">
      <div ref={containerRef} className="min-h-[100px]" />
      {audioBlob && isReady && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handlePlayPause}
            className="bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded-lg
              transition-colors duration-300 flex items-center space-x-2"
          >
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>
      )}
    </div>
  );
}