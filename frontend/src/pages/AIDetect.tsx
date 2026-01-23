import React, { useState, useRef } from "react";

interface DetectionResult {
  detected: boolean;
  type: string;
  severity?: string;
  confidence: number;
}

const AIDetect = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleDetect = async () => {
    if (!file) return alert("Please upload an image");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/ai/predict", {
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

  const clearScan = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-neutral-800 pb-6 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2">
              <span className="text-amber-500">👁‍🗨</span> Visual Reconnaissance
            </h2>
            <p className="text-neutral-500 text-sm uppercase tracking-widest">
              Satellite Imagery & Aerial Analysis
            </p>
          </div>
          <div className={`px-4 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${loading ? "bg-amber-900/20 border-amber-500 text-amber-500 animate-pulse" : "bg-neutral-900 border-neutral-700 text-neutral-500"}`}>
            {loading ? "ANALYZING..." : "READY"}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Upload */}
          <div className="space-y-6">
            <div className="relative w-full h-80 bg-neutral-900 rounded-xl border-2 border-dashed border-neutral-700 flex items-center justify-center overflow-hidden">
              {preview ? (
                <>
                  <img src={preview} alt="preview" className="w-full h-full object-cover opacity-80" />
                  {!loading && (
                    <button onClick={clearScan} className="absolute top-2 right-2 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full">
                      ✕
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center cursor-pointer p-10" onClick={() => fileInputRef.current?.click()}>
                  <div className="text-5xl mb-4 opacity-50">🛰</div>
                  <p className="font-bold">Upload Image</p>
                  <p className="text-xs text-neutral-500">JPEG / PNG</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            <button
              onClick={handleDetect}
              disabled={!file || loading}
              className={`w-full py-4 rounded-lg font-bold text-lg transition
                ${!file ? "bg-neutral-800 text-neutral-600" :
                  loading ? "bg-neutral-800 text-amber-500" :
                  "bg-amber-600 hover:bg-amber-500 text-black"}`}
            >
              {loading ? "PROCESSING..." : "INITIATE SCAN"}
            </button>
          </div>

          {/* Results */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-neutral-800 pb-2">
              Analysis Log
            </h3>

            {result ? (
              <div className="space-y-6">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Threat</span>
                  <span className={result.detected ? "text-red-500" : "text-emerald-500"}>
                    {result.detected ? "DETECTED" : "NONE"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-400">Type</span>
                  <span className="font-bold text-white">{result.type}</span>
                </div>

                <div>
                  <span className="text-neutral-400 block mb-1">Severity</span>
                  <span className={`text-2xl font-bold ${getSeverityColor(result?.severity)}`}>
                    {result.severity || "Unknown"}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-neutral-500 mb-1">
                    <span>AI CONFIDENCE</span>
                    <span>{Math.round(result.confidence * 100)}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full">
                    <div className="bg-amber-500 h-full" style={{ width: `${result.confidence * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-neutral-600 py-20">Waiting for data...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// SAFE severity color handler
const getSeverityColor = (severity?: string) => {
  if (!severity) return "text-neutral-500";
  const s = severity.toLowerCase();
  if (s.includes("critical") || s.includes("destroy")) return "text-red-500";
  if (s.includes("high")) return "text-orange-500";
  if (s.includes("medium")) return "text-amber-400";
  return "text-emerald-400";
};

export default AIDetect;
