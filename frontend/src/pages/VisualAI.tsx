import React, { useState, useRef } from "react";

interface IntelResult {
  area_type: string;
  confidence: number;
  risks: {
    flood_risk: number;
    wildfire_risk: number;
    landslide_risk: number;
  };

  metadata?: string[];
}

const VisualIntel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<IntelResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeepScan, setIsDeepScan] = useState(false); // The Checkbox State

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (preview) URL.revokeObjectURL(preview);
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    // PASSING THE CHECKBOX STATE TO BACKEND
    formData.append("deep_scan", String(isDeepScan));

    try {
  const res = await fetch("http://127.0.0.1:8000/visual-intel", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  console.log(data);
  setResult(data);

} catch (error) {
  console.error(error);

} finally {
  setLoading(false);
}

};

  return( 
    <div className={`min-h-screen transition-colors duration-700 font-mono p-4 md:p-8 ${isDeepScan ? 'bg-[#05010a]' : 'bg-[#02040a]'} text-slate-300`}>
      
      {/* Background Grid - Changes color based on checkbox */}
      <div className={`fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:40px_40px] transition-colors duration-700 ${isDeepScan ? 'text-purple-900' : 'text-cyan-900'}`} />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header with Functional Toggle */}
        <header className="flex justify-between items-center border-b border-white/10 pb-6 mb-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter">AVERRA_INTEL</h2>
            <p className="text-[9px] uppercase tracking-[0.4em] text-slate-500">EuroSAT Satellite Unit</p>
          </div>

          {/* THE CHECKBOX (TOGGLE) */}
          <div className="flex items-center gap-4 group">
            <span className={`text-[10px] font-bold tracking-widest transition-colors ${isDeepScan ? 'text-purple-400' : 'text-slate-600'}`}>
              {isDeepScan ? "NEURAL_OVERDRIVE" : "STANDARD_SCAN"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isDeepScan}
                onChange={() => {
                  setIsDeepScan(!isDeepScan);
                  setResult(null); // Clear result when switching modes
                }}
              />
              <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 shadow-inner"></div>
            </label>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-7 space-y-6">
            <div className={`relative aspect-video rounded border-2 transition-all duration-500 overflow-hidden bg-black/40 ${isDeepScan ? 'border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)]' : 'border-slate-800'}`}>
              {preview ? (
                <div className="relative h-full w-full group">
                  <img src={preview} className={`w-full h-full object-cover transition-all duration-700 ${isDeepScan ? 'contrast-125 saturate-150' : 'opacity-80'}`} />
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:invert transition-all">Change Source</button>
                    <button onClick={() => { setFile(null); setPreview(null); setResult(null); }} className="px-4 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-500">Destroy</button>
                  </div>

                  {loading && <div className={`absolute inset-0 h-1 z-20 animate-scan ${isDeepScan ? 'bg-purple-500' : 'bg-cyan-500'}`} />}
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()} className="h-full flex flex-col items-center justify-center cursor-pointer opacity-30 hover:opacity-100 transition-opacity">
                  <span className="text-4xl mb-2">⛶</span>
                  <p className="text-[10px] uppercase tracking-[0.5em]">Inject Visual Data</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={`w-full py-5 font-black text-xs tracking-[0.4em] uppercase transition-all
                ${!file || loading ? "bg-slate-900 text-slate-700 border border-slate-800" : 
                  isDeepScan ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:bg-purple-500" : 
                  "bg-white text-black hover:bg-cyan-500"}`}
            >
              {loading ? "INITIALIZING UPLINK..." : isDeepScan ? "Execute Deep Neural Scan" : "Perform Standard Analysis"}
            </button>
          </div>

          <div className="lg:col-span-5">
            <div className={`h-full p-8 border-l-2 transition-all duration-700 ${isDeepScan ? 'border-purple-500 bg-purple-500/5' : 'border-slate-800 bg-slate-900/10'}`}>
              <p className="text-[10px] uppercase tracking-[0.5em] text-slate-500 mb-8 font-bold">Analysis Module</p>

              {result ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                  <div>
                    <h4 className={`text-6xl font-black italic tracking-tighter transition-colors ${isDeepScan ? 'text-purple-400' : 'text-white'}`}>
                      {result.area_type.toUpperCase()}
                    </h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2">Classified via {isDeepScan ? 'Neural Overdrive' : 'Standard Core'}</p>
                  </div>

                  <div className="border-t border-white/10 pt-6">
  <p className="text-[10px] uppercase tracking-widest text-cyan-400 mb-4">
    Risk Analysis
  </p>

  <div className="space-y-3">
    <div className="flex justify-between">
      <span>Flood Risk</span>
      <span className="text-red-400 font-bold">
        {result.risks.flood_risk}%
      </span>
    </div>

    <div className="flex justify-between">
      <span>Wildfire Risk</span>
      <span className="text-orange-400 font-bold">
        {result.risks.wildfire_risk}%
      </span>
    </div>

    <div className="flex justify-between">
      <span>Landslide Risk</span>
      <span className="text-yellow-400 font-bold">
        {result.risks.landslide_risk}%
      </span>
    </div>
  </div>
</div>

                  {isDeepScan && result.metadata && (
                    <div className="space-y-2 border-t border-purple-500/20 pt-6">
                      <p className="text-[9px] text-purple-400 font-bold uppercase mb-2 tracking-widest underline">Detailed Sub-Log:</p>
                      {result.metadata.map((log, i) => (
                        <div key={i} className="text-[10px] text-purple-300 font-mono flex items-center gap-2">
                           <span className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" /> {log}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/5 text-[11px] leading-relaxed text-slate-500 italic">
                    {isDeepScan ? 
                      "> Warning: Deep scan suggests subsurface instability. Check thermal anomalies." : 
                      "> Baseline scan complete. No critical alerts."}
                  </div>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center border border-dashed border-white/5 opacity-20">
                  <p className="text-[10px] uppercase tracking-widest">Awaiting Link...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan { animation: scan 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default VisualIntel;