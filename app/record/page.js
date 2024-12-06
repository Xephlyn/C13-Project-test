'use client';

import { useState } from 'react';
import AudioInputSelector from '../../components/AudioInputSelector';
import KeyFinder from '../../components/KeyFinder';
import WaveformEditor from '@/components/WaveformEditor';

export default function RecordPage() {
  const [audioBlob, setAudioBlob] = useState(null);
  const [noteSequence, setNoteSequence] = useState([]);

  const handleAudioCaptured = async (audio) => {
    try {
      let blob;
      // If it's a File from upload, convert to blob
      if (audio instanceof File) {
        // Create a proper audio blob from the file
        const arrayBuffer = await audio.arrayBuffer();
        blob = new Blob([arrayBuffer], { type: audio.type });
      } else {
        // If it's already a blob from recording
        blob = audio;
      }
      setAudioBlob(blob);
      setNoteSequence([]);
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  };

  const handlePitchDetected = (notes) => {
    setNoteSequence(notes);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-100 mb-8 text-center
        [text-shadow:_0_0_10px_rgb(220_38_38_/_50%)]">
        Analyze Audio
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* Results Panel */}
        <div className="lg:w-2/3 lg:order-1 order-2">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg shadow-red-900/30 
            border border-red-900/30 h-full">
            <h2 className="text-xl text-red-400 mb-4">Analysis Results</h2>

            {/* Waveform Visualization - Only shows on desktop */}
            {audioBlob && (
  <WaveformEditor 
    audioBlob={audioBlob} 
    onSave={(editedBlob) => {
      setAudioBlob(editedBlob);
      setNoteSequence([]);
    }}
  />
)}
             
            
            <div className="h-[calc(100vh-300px)] overflow-y-auto pr-2
              scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-gray-800">
              {noteSequence.length > 0 ? (
                <div className="space-y-4">
                  {/* Detailed Note Analysis */}
                  <div className="bg-black/50 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-black">
                        <tr className="text-left border-b border-red-900/30">
                          <th className="p-3 text-gray-400">Time (s)</th>
                          <th className="p-3 text-gray-400">Note</th>
                          <th className="p-3 text-gray-400">Frequency (Hz)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {noteSequence.map((note, index) => (
                          <tr 
                            key={index} 
                            className="border-b border-red-900/10 hover:bg-red-900/5"
                          >
                            <td className="p-3 text-gray-300">{note.time}</td>
                            <td className="p-3 text-red-400 font-medium">{note.note}</td>
                            <td className="p-3 text-red-400">{note.frequency}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Note Sequence Summary */}
                  <div className="flex flex-wrap gap-2 p-4 bg-black/50 rounded-lg">
                    {noteSequence.map((note, index) => (
                      <span 
                        key={index}
                        className="bg-red-900/20 px-3 py-1 rounded-full text-red-400"
                      >
                        {note.note}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  {audioBlob ? 'Click Analyze to process the audio' : 'Record or upload audio to begin analysis'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input and Analysis Panel */}
        <div className="lg:w-1/3 lg:order-2 order-1">
          <div className="space-y-8 sticky top-8">
            <AudioInputSelector onAudioCaptured={handleAudioCaptured} />
            {audioBlob && (
              <KeyFinder 
                audioBlob={audioBlob} 
                onPitchDetected={handlePitchDetected}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}