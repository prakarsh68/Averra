import React, { useState, useRef } from "react";

// Define the shape of the API response
interface DetectionResult {
  detected: boolean;
  type: string;
  severity: string;
  confidence: number; // Assuming 0-1 or 0-100
}

const AIDetect = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Create local preview URL
      setResult(null); // Reset previous results
    }
  };

  // Handle API Call
  const handleDetect = async () => {
    if (!file) return alert("Please upload an image");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/detect", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Analysis Failed", error);
      alert("System Error: Unable to connect to AI Core.");
    } finally {
      setLoading(false);
    }
  };

  // Reset function
  const clearScan = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* --- Header --- */}
        <div className="flex justify-between items-end border-b border-neutral-800 pb-6 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2">
              <span className="text-amber-500">👁‍🗨</span> Visual Reconnaissance
            </h2>
            <p className="text-neutral-500 text-sm uppercase tracking-widest">
              Satellite Imagery & Aerial Drone Analysis
            </p>
          </div>
          {/* Status Indicator */}
          <div className={`px-4 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${loading ? "bg-amber-900/20 border-amber-500 text-amber-500 animate-pulse" : "bg-neutral-900 border-neutral-700 text-neutral-500"}`}>
            {loading ? "SYSTEM ANALYZING..." : "SYSTEM READY"}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* --- LEFT COL: Upload & Preview --- */}
          <div className="space-y-6">
            
            {/* Image Container */}
            <div className="relative w-full h-80 bg-neutral-900 rounded-xl border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center overflow-hidden group">
              
              {preview ? (
                <>
                  {/* The Image */}
                  <img src={preview} alt="Upload Preview" className="w-full h-full object-cover opacity-80" />
                  
                  {/* Scanning Overlay Effect */}
                  {loading && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/20 to-transparent w-full h-full animate-scan z-10 border-b-2 border-amber-500"></div>
                  )}

                  {/* Remove Button */}
                  {!loading && (
                    <button onClick={clearScan} className="absolute top-2 right-2 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full transition backdrop-blur-md">
                      ✕
                    </button>
                  )}
                </>
              ) : (
                /* Upload Placeholder */
                <div 
                  className="text-center cursor-pointer p-10 w-full h-full flex flex-col items-center justify-center hover:bg-neutral-800 transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-5xl mb-4 opacity-50">🛰</div>
                  <p className="text-neutral-300 font-bold mb-2">Upload Satellite Imagery</p>
                  <p className="text-xs text-neutral-500 uppercase">JPEG, PNG, TIFF Supported</p>
                </div>
              )}
              
              {/* Hidden Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handleDetect}
              disabled={!file || loading}
              className={`w-full py-4 rounded-lg font-bold text-lg tracking-widest transition shadow-lg
                ${!file ? "bg-neutral-800 text-neutral-600 cursor-not-allowed" : 
                  loading ? "bg-neutral-800 text-amber-500 cursor-wait" : 
                  "bg-amber-600 hover:bg-amber-500 text-black shadow-amber-500/20"}`}
            >
              {loading ? "PROCESSING..." : "INITIATE SCAN"}
            </button>
          </div>

          {/* --- RIGHT COL: Analysis Results --- */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 relative overflow-hidden">
            {/* Background Grid Decoration */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" 
                 style={{backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            </div>

            <h3 className="text-xl font-bold text-white mb-6 border-b border-neutral-800 pb-2">
              Analysis Log
            </h3>

            {result ? (
              <div className="space-y-6 relative z-10">
                {/* Detection Status */}
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-sm uppercase">Threat Detected</span>
                  <span className={`text-lg font-bold ${result.detected ? "text-red-500" : "text-emerald-500"}`}>
                    {result.detected ? "POSITIVE" : "NEGATIVE"}
                  </span>
                </div>

                {/* Type */}
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-sm uppercase">Classification</span>
                  <span className="text-xl font-mono text-white tracking-wider">
                    {result.type || "N/A"}
                  </span>
                </div>

                {/* Severity */}
                <div>
                  <span className="text-neutral-400 text-sm uppercase mb-2 block">Severity Assessment</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${getSeverityColor(result.severity)}`}>
                      {result.severity || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Confidence Meter */}
                <div>
                  <div className="flex justify-between text-xs text-neutral-500 mb-1">
                    <span>AI CONFIDENCE</span>
                    <span>{Math.round(result.confidence * 100)}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full transition-all duration-1000 ease-out" 
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

              </div>
            ) : (
              // Empty State
              <div className="h-full flex flex-col items-center justify-center text-neutral-600 opacity-50 pb-10">
                <div className="text-6xl mb-4">📉</div>
                <p>Waiting for data stream...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for Styling Severity
const getSeverityColor = (severity: string) => {
    if (!severity) return "text-neutral-500";
    const s = severity.toLowerCase();
    if (s.includes("critical") || s.includes("destroy")) return "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]";
    if (s.includes("high")) return "text-orange-500";
    if (s.includes("medium")) return "text-amber-400";
    return "text-emerald-400";
};

export default AIDetect;