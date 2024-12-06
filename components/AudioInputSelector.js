// components/AudioInputSelector.js
'use client';

import { useState, useRef } from 'react';
import { MicrophoneIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import AudioRecorder from './AudioRecorder';

export default function AudioInputSelector({ onAudioCaptured }) {
  const [inputMethod, setInputMethod] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      if (!file.type.startsWith('audio/')) {
        setUploadError('Please upload an audio file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size must be less than 10MB');
        return;
      }

      // Create URL for audio preview
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setUploadedFile(file);
      setUploadError(null);
      onAudioCaptured(file);
    }
  };

  const resetUpload = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setUploadedFile(null);
    setAudioUrl(null);
    setUploadError(null);
  };

  const handleChangeMethod = () => {
    resetUpload();
    setInputMethod(null);
  };

  if (!inputMethod) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg shadow-red-900/30 border border-red-900/30">
        <h2 className="text-xl text-red-400 mb-6 text-center">Choose Input Method</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setInputMethod('record')}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-4 rounded-lg
              transition-colors duration-300 flex flex-col items-center space-y-2 w-40"
          >
            <MicrophoneIcon className="h-8 w-8 text-red-500" />
            <span>Record Audio</span>
          </button>

          <button
            onClick={() => setInputMethod('upload')}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-4 rounded-lg
              transition-colors duration-300 flex flex-col items-center space-y-2 w-40"
          >
            <ArrowUpTrayIcon className="h-8 w-8 text-red-500" />
            <span>Upload File</span>
          </button>
        </div>
      </div>
    );
  }

  if (inputMethod === 'upload') {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg shadow-red-900/30 border border-red-900/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-red-400">Upload Audio File</h2>
          <button
            onClick={handleChangeMethod}
            className="text-gray-400 hover:text-red-400 text-sm"
          >
            Change Method
          </button>
        </div>

        {uploadError && (
          <div className="bg-red-900/20 text-red-400 p-4 rounded-lg mb-4">
            {uploadError}
          </div>
        )}

        {audioUrl ? (
          <div className="space-y-4">
            <div className="bg-black/50 rounded-lg p-4">
              <p className="text-gray-400 mb-2">
                File: <span className="text-red-400">{uploadedFile.name}</span>
              </p>
              <audio 
                ref={audioRef}
                src={audioUrl} 
                controls 
                className="w-full"
              />
            </div>
            <button
              onClick={() => {
                resetUpload();
              }}
              className="text-red-400 hover:text-red-300 text-sm flex items-center"
            >
              Choose different file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <label className="w-full cursor-pointer">
              <div className="border-2 border-dashed border-red-900/50 rounded-lg p-8 
                hover:border-red-500/50 transition-colors duration-300
                flex flex-col items-center space-y-2">
                <ArrowUpTrayIcon className="h-12 w-12 text-red-500" />
                <span className="text-gray-400">Click to select audio file</span>
                <span className="text-sm text-gray-500">Supported formats: MP3, WAV, M4A</span>
              </div>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg shadow-red-900/30 border border-red-900/30">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-red-400">Record Audio</h2>
        <button
          onClick={handleChangeMethod}
          className="text-gray-400 hover:text-red-400 text-sm"
        >
          Change Method
        </button>
      </div>
      <AudioRecorder onAudioRecorded={onAudioCaptured} />
    </div>
  );
}