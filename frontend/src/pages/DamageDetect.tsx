import React, { useState, useRef } from "react";

// --- Types & Constants ---
interface DamageResult {
  damage_severity: string;
  confidence: number;
}

const SEVERITY_CONFIG = {
  "no damage": { color: "#10b981", label: "SECURE", glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]" },
  "minor": { color: "#fbbf24", label: "CAUTION", glow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]" },
  "major": { color: "#f97316", label: "CRITICAL", glow: "shadow-[0_0_20px_rgba(249,115,22,0.3)]" },
  "destroyed": { color: "#ef4444", label: "BREACHED", glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]" },
};

const DamageDetect = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DamageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>(["System Ready. Awaiting Input..."]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      // Clean up old object URL to prevent memory leaks
      if (preview) URL.revokeObjectURL(preview);
      
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null); // Clear previous results on new image
      addLog(`Source Updated: ${selected.name.toUpperCase()}`);
    }
  };

  const resetScanner = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    addLog("Scanner Reset. Awaiting new data link...");
  };

  const runAnalysis = async () => {
    if (!file) return;
    setLoading(true);
    addLog("Accessing Neural Layers...");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/classify-damage", { method: "POST", body: formData });
      const data = await res.json();
      setResult(data);
      addLog("Assessment Cached Successfully.");
    } catch {
      addLog("CRITICAL ERROR: Uplink Timeout.");
    } finally {
      setLoading(false);
    }
  };

  const currentLevel = result?.damage_severity.toLowerCase() || "";
  const config = SEVERITY_CONFIG[currentLevel as keyof typeof SEVERITY_CONFIG] || { color: "#525252", label: "IDLE" };

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-500 font-mono p-4 md:p-10 selection:bg-emerald-500/30">
      
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-emerald-900/30 pb-4 mb-8">
          <h1 className="text-xl font-bold tracking-widest flex items-center gap-3">
            <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            V-SCAN // INFRASTRUCTURE_INTEGRITY
          </h1>
          <div className="text-[10px] opacity-40 uppercase">Encrypted Connection: TLS_1.3</div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Display Area */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative group rounded-sm border border-emerald-900/50 bg-black overflow-hidden aspect-video flex items-center justify-center">
              
              {preview ? (
                <>
                  <img src={preview} className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity" />
                  
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-emerald-500 text-black px-4 py-2 text-xs font-bold uppercase tracking-tighter hover:bg-white mb-2"
                    >
                      Change Source File
                    </button>
                    <button 
                      onClick={resetScanner}
                      className="text-white text-[10px] uppercase hover:underline"
                    >
                      Disconnect Link
                    </button>
                  </div>

                  {loading && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/40 to-transparent h-1/4 w-full animate-scan-line z-10" />
                  )}
                </>
              ) : (
                <div 
                  className="flex flex-col items-center cursor-pointer p-20 w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 border border-emerald-900 flex items-center justify-center mb-4 group-hover:border-emerald-500 transition-colors">
                    <span className="text-2xl">+</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-emerald-800 group-hover:text-emerald-500">Inject Optical Stream</p>
                </div>
              )}

              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </div>

            <div className="grid grid-cols-2 gap-2">
               <button 
                onClick={runAnalysis}
                disabled={!file || loading}
                className="py-4 bg-emerald-500 text-black hover:bg-white transition-all font-black uppercase tracking-[0.3em] disabled:opacity-10 disabled:grayscale"
              >
                {loading ? "PROCESSING..." : "Execute Scan"}
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="py-4 border border-emerald-900/50 hover:border-emerald-500 text-xs font-bold uppercase tracking-[0.2em]"
              >
                Switch Image
              </button>
            </div>
          </div>

          {/* Diagnostics Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Terminal Output */}
            <div className="bg-[#080808] border border-emerald-900/30 p-4 h-32 font-mono text-[10px] relative">
               <div className="absolute bottom-1 right-2 opacity-20 uppercase">Stream_Feed</div>
               <div className="space-y-1">
                 {logs.map((log, i) => (
                   <div key={i} className={i === 0 ? "text-emerald-400" : "opacity-30"}>{log}</div>
                 ))}
               </div>
            </div>

            {/* Results HUD */}
            <div className={`flex-1 p-8 border bg-black transition-all duration-500 ${result ? 'border-emerald-500/40' : 'border-emerald-900/10 opacity-30'}`}>
              <div className="mb-10">
                <p className="text-[10px] text-emerald-800 font-bold uppercase mb-1">Status Report</p>
                <h2 className="text-5xl font-black italic tracking-tighter" style={{ color: config.color }}>
                  {result?.damage_severity || "STANDBY"}
                </h2>
                <div className="mt-2 inline-block px-2 py-0.5 text-[9px] border border-emerald-900 font-bold">
                  LOC: TERMINAL_01
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-[10px] mb-2 uppercase italic">
                    <span>Confidence Index</span>
                    <span>{result ? (result.confidence * 100).toFixed(1) : "00.0"}%</span>
                  </div>
                  <div className="h-[2px] bg-emerald-900/30 w-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: result ? `${result.confidence * 100}%` : '0%' }}
                    />
                  </div>
                </div>

                {result && (
                  <div className="text-[11px] leading-relaxed text-emerald-700 border-l-2 border-emerald-900 pl-4 py-2 italic">
                    AI LOG: High-probability {result.damage_severity} detected. Logged to central database for structural review.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400%); opacity: 0; }
        }
        .animate-scan-line {
          animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default DamageDetect;