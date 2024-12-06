'use client';

import { useState, useRef } from 'react';
import { MusicalNoteIcon } from '@heroicons/react/24/solid';

export default function KeyFinder({ audioBlob, onPitchDetected }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const audioContextRef = useRef(null);

  const analyzeAudio = async () => {
    if (!audioBlob) {
      setError('No audio recording available');
      return;
    }

    try {
      setIsAnalyzing(true);
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);
      
      const sampleRate = audioBuffer.sampleRate;
      const samplesPerAnalysis = sampleRate / 4; // Analysis every 1/20th of a second
      const notes = [];

      for (let i = 0; i < channelData.length; i += samplesPerAnalysis) {
        const chunk = channelData.slice(i, i + samplesPerAnalysis);
        const frequency = detectPitch(chunk, sampleRate);
        
        if (frequency && frequency > 20 && frequency < 4000) {
          const note = getNote(frequency);
          const currentTime = i / sampleRate;
          
          // Only add if it's a different note than the last one
          if (notes.length === 0 || notes[notes.length - 1].note !== note) {
            notes.push({
              note,
              frequency: Math.round(frequency),
              time: currentTime.toFixed(2),
            });
          }
        }
      }

      onPitchDetected?.(notes);
      setIsAnalyzing(false);
      
    } catch (err) {
      console.error('Error analyzing audio:', err);
      setError(err.message);
      setIsAnalyzing(false);
    }
  };

  const detectPitch = (buffer, sampleRate) => {
    let zeroCrossings = 0;
    for (let i = 1; i < buffer.length; i++) {
      if ((buffer[i - 1] < 0 && buffer[i] >= 0) || 
          (buffer[i - 1] >= 0 && buffer[i] < 0)) {
        zeroCrossings++;
      }
    }
    
    const frequency = (zeroCrossings * sampleRate) / (2 * buffer.length);
    return frequency;
  };

  const getNote = (frequency) => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const c0 = 16.35;
    
    const halfSteps = Math.round(12 * Math.log2(frequency / c0));
    const octave = Math.floor(halfSteps / 12);
    const noteIndex = halfSteps % 12;
    
    return `${notes[noteIndex]}${octave}`;
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg shadow-red-900/30 border border-red-900/30">
      {error && (
        <div className="bg-red-900/20 text-red-400 p-4 rounded-lg mb-4">
          Error: {error}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={analyzeAudio}
          disabled={!audioBlob || isAnalyzing}
          className={`${
            !audioBlob || isAnalyzing
              ? 'bg-gray-700 cursor-not-allowed' 
              : 'bg-red-700 hover:bg-red-600'
          } text-white px-6 py-3 rounded-lg
            transition-colors duration-300 flex items-center space-x-2`}
        >
          <MusicalNoteIcon className="h-5 w-5" />
          <span>
            {isAnalyzing ? 'Analyzing...' : 'Analyze Recording'}
          </span>
        </button>
      </div>
    </div>
  );
}