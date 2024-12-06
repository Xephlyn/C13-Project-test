export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-6xl font-bold text-gray-100 mb-6 text-center 
        [text-shadow:_0_0_10px_rgb(220_38_38_/_50%)]">
        The Studio in you Palm!
      </h1>
      
      <div className="max-w-4xl mx-auto bg-black/50 p-8 rounded-lg 
        shadow-lg shadow-red-900/30 border border-red-900/30">
        <h2 className="text-2xl text-red-400 mb-4">
          Create, Record, and Share Your Sound
        </h2>
        <p className="text-gray-300 mb-6">
          Record high-quality audio, analyze musical notes, and get real-time 
          harmony suggestions - all in one place.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-6 rounded-lg border border-red-900/20 
            hover:border-red-900/40 transition-colors">
            <h3 className="text-xl text-red-400 mb-3">Record</h3>
            <p className="text-gray-400">Start recording your audio with professional-grade tools</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg border border-red-900/20 
            hover:border-red-900/40 transition-colors">
            <h3 className="text-xl text-red-400 mb-3">Analyze</h3>
            <p className="text-gray-400">Get instant note detection and harmony suggestions</p>
          </div>
        </div>
      </div>
    </div>
  );
}