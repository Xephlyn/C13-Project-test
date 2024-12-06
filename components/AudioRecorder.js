'use client';

import { useState, useRef } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  StopIcon, 
  ArrowPathIcon,
  MicrophoneIcon
} from '@heroicons/react/24/solid';

export default function AudioRecorder({ onAudioRecorded }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        chunksRef.current = [];
        // Pass the blob to parent component for analysis
        onAudioRecorded(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setAudioURL(null);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const togglePause = () => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const reRecord = () => {
    setAudioURL(null);
    startRecording();
  };

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg shadow-red-900/30 
      border border-red-900/30 max-w-2xl mx-auto">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-full bg-black rounded-lg p-6 text-center">
          {isRecording ? (
            <div className="animate-pulse">
              <MicrophoneIcon className="h-16 w-16 text-red-500 mx-auto" />
              <p className="text-red-400 mt-2">Recording...</p>
            </div>
          ) : audioURL ? (
            <audio ref={audioRef} src={audioURL} className="w-full" controls />
          ) : (
            <p className="text-gray-400">Click record to start</p>
          )}
        </div>

        <div className="flex space-x-4">
          {!isRecording && !audioURL && (
            <button
              onClick={startRecording}
              className="bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded-lg
                transition-colors duration-300 flex items-center space-x-2
                shadow-lg shadow-red-900/30"
            >
              <MicrophoneIcon className="h-5 w-5" />
              <span>Record</span>
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded-lg
                transition-colors duration-300 flex items-center space-x-2"
            >
              <StopIcon className="h-5 w-5" />
              <span>Stop</span>
            </button>
          )}

          {audioURL && (
            <>
              <button
                onClick={togglePause}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg
                  transition-colors duration-300 flex items-center space-x-2"
              >
                {isPaused ? (
                  <PlayIcon className="h-5 w-5" />
                ) : (
                  <PauseIcon className="h-5 w-5" />
                )}
                <span>{isPaused ? 'Play' : 'Pause'}</span>
              </button>

              <button
                onClick={reRecord}
                className="bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded-lg
                  transition-colors duration-300 flex items-center space-x-2"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>Re-record</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}