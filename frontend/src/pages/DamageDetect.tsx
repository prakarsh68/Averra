import React, { useState, useRef } from "react";

interface DamageResult {
  damage_severity: string;
  confidence: number;
}

const DamageDetect = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DamageResult | null>(null);
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

  const handleClassify = async () => {
    if (!file) return alert("Upload an image for assessment.");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/classify-damage", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Classification Error", error);
      alert("Error: Analysis server unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-neutral-800 pb-6 mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2">
              <span className="text-red-500">🏚</span> Damage Assessment AI
            </h2>
            <p className="text-neutral-500 text-sm uppercase tracking-widest">
              Structural Integrity & Impact Analysis
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* --- LEFT: Upload Section --- */}
          <div className="space-y-6">
            <div className="relative w-full h-96 bg-neutral-900 rounded-xl border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center overflow-hidden group hover:border-neutral-500 transition-colors">
              
              {preview ? (
                <>
                  <img src={preview} alt="Damage Preview" className="w-full h-full object-cover" />
                  {loading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <span className="text-amber-500 font-mono text-sm tracking-widest animate-pulse">
                          CALCULATING STRUCTURAL LOAD...
                        </span>
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-2 rounded transition"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="text-6xl mb-4 opacity-30 text-neutral-400">🏗</div>
                  <p className="text-lg font-bold text-neutral-300">Upload Infrastructure Imagery</p>
                  <p className="text-xs text-neutral-500 mt-2 uppercase">Buildings • Roads • Bridges</p>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <button
              onClick={handleClassify}
              disabled={!file || loading}
              className={`w-full py-4 rounded font-bold text-lg tracking-widest transition uppercase
                ${!file ? "bg-neutral-800 text-neutral-600 cursor-not-allowed" : 
                  "bg-red-700 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"}`}
            >
              Execute Assessment
            </button>
          </div>

          {/* --- RIGHT: Analysis Results --- */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 flex flex-col justify-center relative">
             {/* Decorative Corner Markers */}
             <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neutral-600"></div>
             <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neutral-600"></div>
             <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neutral-600"></div>
             <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neutral-600"></div>

             {result ? (
               <div className="space-y-8 animate-fade-in">
                 
                 {/* Main Classification */}
                 <div className="text-center">
                   <h3 className="text-neutral-500 text-sm font-bold uppercase tracking-widest mb-2">Assessed Damage Level</h3>
                   <div className={`text-4xl md:text-5xl font-extrabold uppercase ${getDamageColor(result.damage_severity)}`}>
                     {result.damage_severity}
                   </div>
                 </div>

                 <div className="border-t border-neutral-800 my-4"></div>

                 {/* Visual Scale */}
                 <div>
                    <div className="flex justify-between text-xs text-neutral-500 mb-2 uppercase font-mono">
                      <span>Intact</span>
                      <span>Minor</span>
                      <span>Severe</span>
                      <span>Destroyed</span>
                    </div>
                    {/* Segmented Bar */}
                    <div className="flex gap-1 h-4">
                      <div className={`flex-1 rounded-l ${result.damage_severity.includes("no") ? "bg-emerald-500" : "bg-neutral-800"}`}></div>
                      <div className={`flex-1 ${result.damage_severity.includes("minor") ? "bg-amber-400" : "bg-neutral-800"}`}></div>
                      <div className={`flex-1 ${result.damage_severity.includes("major") || result.damage_severity.includes("severe") ? "bg-orange-500" : "bg-neutral-800"}`}></div>
                      <div className={`flex-1 rounded-r ${result.damage_severity.includes("destroy") || result.damage_severity.includes("critical") ? "bg-red-600 shadow-[0_0_10px_red]" : "bg-neutral-800"}`}></div>
                    </div>
                 </div>

                 {/* Confidence Metric */}
                 <div className="bg-black/30 p-4 rounded border border-neutral-800 flex justify-between items-center">
                   <span className="text-neutral-400 text-sm">AI CONFIDENCE INDEX</span>
                   <span className="text-xl font-mono text-white">{(result.confidence * 100).toFixed(1)}%</span>
                 </div>

               </div>
             ) : (
               /* Idle State */
               <div className="text-center opacity-40">
                 <div className="text-6xl mb-4 grayscale">📊</div>
                 <h3 className="text-xl font-bold">Awaiting Input</h3>
                 <p className="text-sm mt-2">Upload visual data to calculate structural integrity coefficients.</p>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Helper for Colors ---
const getDamageColor = (severity: string) => {
  const s = severity.toLowerCase();
  if (s.includes("destroy") || s.includes("critical")) return "text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]";
  if (s.includes("major") || s.includes("severe")) return "text-orange-500";
  if (s.includes("minor")) return "text-amber-400";
  return "text-emerald-500";
};

export default DamageDetect;