'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import { 
  Scissors as ScissorsIcon, 
  Copy as CopyIcon, 
  Clipboard as ClipboardIcon,
  Undo as UndoIcon,
  Save as SaveIcon,
  MousePointer as CursorIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Repeat as RepeatIcon,
  RefreshCw as LoopIcon
} from 'lucide-react';

export default function WaveformEditor({ audioBlob, onSave }) {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [copiedRegion, setCopiedRegion] = useState(null);
  const [editHistory, setEditHistory] = useState([]);
  const [isLooping, setIsLooping] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [activeRegion, setActiveRegion] = useState(null);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    if (!audioBlob || !containerRef.current) return;

    let audioUrl;
    let isMounted = true;

    const initWaveSurfer = async () => {
      try {
        const wavesurfer = WaveSurfer.create({
          container: containerRef.current,
          waveColor: '#ef4444',
          progressColor: '#dc2626',
          cursorColor: '#f87171',
          barWidth: 2,
          barGap: 1,
          height: 128,
          responsive: true,
          normalize: true,
          backend: 'WebAudio',
          barRadius: 3,
          plugins: [
            RegionsPlugin.create({
              regions: [],
              dragSelection: true // Enable drag selection for regions
            })
          ]
        });

        wavesurfer.on('ready', () => {
          if (isMounted) {
            setIsReady(true);
            const duration = wavesurfer.getDuration();
            const containerWidth = containerRef.current.clientWidth;
            const optimalZoom = containerWidth / duration;
            wavesurfer.zoom(optimalZoom);
          }
        });

        wavesurfer.on('play', () => setIsPlaying(true));
        wavesurfer.on('pause', () => setIsPlaying(false));
        wavesurfer.on('finish', () => {
          if (isRepeating) {
            wavesurfer.play(0);
          } else {
            setIsPlaying(false);
          }
        });

        // Handle region creation
        wavesurfer.on('region-created', region => {
          setRegions(prev => [...prev, region]);
          setActiveRegion(region);
          
          // Style the region
          region.element.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
          region.element.style.border = '2px solid #ef4444';
        });

        // Handle region updates
        wavesurfer.on('region-updated', region => {
          setActiveRegion(region);
        });

        wavesurfer.on('region-click', region => {
          setActiveRegion(region);
          region.play();
        });

        wavesurfer.on('region-out', () => {
          if (isLooping && activeRegion) {
            activeRegion.play();
          }
        });

        audioUrl = URL.createObjectURL(audioBlob);
        await wavesurfer.load(audioUrl);
        wavesurferRef.current = wavesurfer;
      } catch (error) {
        console.error('Error initializing WaveSurfer:', error);
      }
    };

    initWaveSurfer();

    return () => {
      isMounted = false;
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [audioBlob]);

  const handlePlayPause = () => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.playPause();
  };

  const handleRepeat = () => {
    setIsRepeating(!isRepeating);
    setIsLooping(false);
  };

  const handleLoop = () => {
    setIsLooping(!isLooping);
    setIsRepeating(false);
  };

  const handleCut = async () => {
    if (!activeRegion || !wavesurferRef.current) return;

    try {
      // Store current state in history
      const currentAudioBuffer = wavesurferRef.current.getDecodedData();
      setEditHistory(prev => [...prev, currentAudioBuffer]);

      // Get the region boundaries
      const start = activeRegion.start;
      const end = activeRegion.end;
      
      // Create new AudioBuffer without the selected region
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const originalBuffer = wavesurferRef.current.getDecodedData();
      const newDuration = originalBuffer.duration - (end - start);
      const newBuffer = audioContext.createBuffer(
        originalBuffer.numberOfChannels,
        Math.floor(newDuration * originalBuffer.sampleRate),
        originalBuffer.sampleRate
      );

      // Copy the audio data, excluding the selected region
      for (let channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
        const channelData = newBuffer.getChannelData(channel);
        const originalData = originalBuffer.getChannelData(channel);
        
        // Copy first part (before cut)
        const startOffset = Math.floor(start * originalBuffer.sampleRate);
        channelData.set(originalData.slice(0, startOffset), 0);
        
        // Copy second part (after cut)
        const endOffset = Math.floor(end * originalBuffer.sampleRate);
        channelData.set(
          originalData.slice(endOffset),
          startOffset
        );
      }

      // Convert AudioBuffer to Blob
      const audioData = await audioBufferToWav(newBuffer);
      const newAudioBlob = new Blob([audioData], { type: 'audio/wav' });

      // Load new audio into wavesurfer
      const newAudioUrl = URL.createObjectURL(newAudioBlob);
      await wavesurferRef.current.load(newAudioUrl);
      
      // Clear regions
      wavesurferRef.current.regions.clear();
      setRegions([]);
      setActiveRegion(null);

      // Notify parent component
      if (onSave) {
        onSave(newAudioBlob);
      }

      URL.revokeObjectURL(newAudioUrl);
    } catch (error) {
      console.error('Error cutting audio:', error);
    }
  };

  const handleUndo = async () => {
    if (editHistory.length === 0) return;

    const previousBuffer = editHistory[editHistory.length - 1];
    setEditHistory(prev => prev.slice(0, -1));

    try {
      const audioData = await audioBufferToWav(previousBuffer);
      const previousAudioBlob = new Blob([audioData], { type: 'audio/wav' });
      const previousAudioUrl = URL.createObjectURL(previousAudioBlob);
      
      await wavesurferRef.current.load(previousAudioUrl);
      wavesurferRef.current.regions.clear();
      setRegions([]);
      setActiveRegion(null);

      if (onSave) {
        onSave(previousAudioBlob);
      }

      URL.revokeObjectURL(previousAudioUrl);
    } catch (error) {
      console.error('Error undoing:', error);
    }
  };

  // Helper function to convert AudioBuffer to WAV format
  const audioBufferToWav = (buffer) => {
    return new Promise((resolve) => {
      const worker = new Worker(
        URL.createObjectURL(
          new Blob(
            [`(${audioBufferToWavWorker.toString()})()`],
            { type: 'application/javascript' }
          )
        )
      );

      worker.onmessage = (e) => {
        resolve(e.data);
        worker.terminate();
      };

      worker.postMessage({
        buffer: buffer.getChannelData(0),
        sampleRate: buffer.sampleRate
      });
    });
  };

  return (
    <div className="bg-black/50 rounded-lg p-6 mb-4">
      {/* Edit Tools */}
      <div className="mb-4 flex justify-between items-center">
        <div className="space-x-2">
          <button
            onClick={() => handleCut()}
            disabled={!activeRegion}
            className={`p-2 rounded-lg transition-colors ${
              activeRegion ? 'bg-red-700 hover:bg-red-600' : 'bg-gray-700 cursor-not-allowed'
            }`}
            title="Cut selected region"
          >
            <ScissorsIcon className="h-5 w-5" />
          </button>

          <button
            onClick={handleUndo}
            disabled={editHistory.length === 0}
            className={`p-2 rounded-lg transition-colors ${
              editHistory.length > 0 ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-700 cursor-not-allowed'
            }`}
            title="Undo last action"
          >
            <UndoIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Waveform */}
      <div ref={containerRef} className="border border-red-900/30 rounded-lg" />

      {/* Playback Controls */}
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={handlePlayPause}
          className="bg-red-700 hover:bg-red-600 p-2 rounded-lg transition-colors"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <PauseIcon className="h-5 w-5" />
          ) : (
            <PlayIcon className="h-5 w-5" />
          )}
        </button>

        <button
          onClick={handleRepeat}
          className={`p-2 rounded-lg transition-colors ${
            isRepeating ? 'bg-red-700' : 'bg-gray-800 hover:bg-gray-700'
          }`}
          title="Repeat entire audio"
        >
          <RepeatIcon className="h-5 w-5" />
        </button>

        <button
          onClick={handleLoop}
          className={`p-2 rounded-lg transition-colors ${
            isLooping ? 'bg-red-700' : 'bg-gray-800 hover:bg-gray-700'
          }`}
          title="Loop selected region"
        >
          <LoopIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-400">
        Click and drag on the waveform to select a region to cut, or use playback controls to preview audio
      </div>
    </div>
  );
}

// Web Worker for WAV conversion
function audioBufferToWavWorker() {
  self.onmessage = function(e) {
    const { buffer, sampleRate } = e.data;
    
    // Create WAV file
    const arrayBuffer = new ArrayBuffer(44 + buffer.length * 2);
    const view = new DataView(arrayBuffer);
    
    // Write WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + buffer.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, buffer.length * 2, true);
    
    // Write audio data
    const length = buffer.length;
    let index = 44;
    for (let i = 0; i < length; i++) {
      view.setInt16(index, buffer[i] * 32767, true);
      index += 2;
    }
    
    self.postMessage(arrayBuffer);
  };

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}