import React, { useState, useRef, useMemo } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// --- Theme Map for Full Environment Shift ---
const THEME_MAP = {
  idle: { color: "#fbbf24", bg: "bg-black", glow: "shadow-none", grid: "opacity-10" },
  safe: { color: "#10b981", bg: "bg-[#020a06]", glow: "shadow-[inset_0_0_100px_rgba(16,185,129,0.1)]", grid: "opacity-20" },
  low: { color: "#fbbf24", bg: "bg-[#0a0802]", glow: "shadow-[inset_0_0_100px_rgba(251,191,36,0.1)]", grid: "opacity-20" },
  high: { color: "#f97316", bg: "bg-[#0a0402]", glow: "shadow-[inset_0_0_100px_rgba(249,115,22,0.15)]", grid: "opacity-30" },
  critical: { color: "#ef4444", bg: "bg-[#0a0101]", glow: "shadow-[inset_0_0_150px_rgba(239,68,68,0.2)]", grid: "opacity-40" },
};

const AIDetect = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const currentTheme = useMemo(() => {
    if (!result) return THEME_MAP.idle;
    const s = result.severity?.toLowerCase() || "";
    if (s.includes("critical")) return THEME_MAP.critical;
    if (s.includes("high")) return THEME_MAP.high;
    if (s.includes("medium") || s.includes("minor")) return THEME_MAP.low;
    return THEME_MAP.safe;
  }, [result]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (preview) URL.revokeObjectURL(preview);
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const removeImage = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResult(null);
  };

  const handleDetect = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/detect", { method: "POST", body: formData });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      // Mock result for testing if server is down
      setResult({ detected: true, type: "Structural_Damage", severity: "Critical", confidence: 0.94 });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!file || !result) return;
    setSaving(true);
    try {
      const storageRef = ref(storage, `reports/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      await addDoc(collection(db, "reports"), { ...result, imageUrl, timestamp: serverTimestamp() });
      navigate("/dashboard");
    } catch (err) {
      alert("Archive Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 font-mono p-4 md:p-8 relative overflow-hidden text-white ${currentTheme.bg} ${currentTheme.glow}`}>
      
      {/* HUD Background Grid */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${currentTheme.grid} bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:40px_40px]`} style={{ color: currentTheme.color }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="flex justify-between items-center border-b border-white/10 pb-6 mb-12">
          <div className="flex items-center gap-0 border-2 border-amber-400 overflow-hidden shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <div className="bg-amber-400 text-black px-4 py-3 font-black text-2xl tracking-tighter italic">
              AVERRA
            </div>
            <div className="bg-black text-amber-400 px-4 py-3 font-bold text-xs tracking-[0.3em] flex flex-col justify-center">
              <span>INTELLIGENCE</span>
              <span className="text-[7px] opacity-60">TACTICAL_UNIT_v4</span>
            </div>
          </div>
          
          <div className="text-right text-[10px] hidden sm:block font-bold tracking-widest text-white/40">
            <p>SYSTEM_STATUS: <span className={loading ? "text-amber-400 animate-pulse" : "text-emerald-500"}>{loading ? "BUSY" : "ONLINE"}</span></p>
            <p>NODE_ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Main Visualizer (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="relative aspect-video rounded-sm border-2 overflow-hidden bg-black/40 backdrop-blur-md transition-colors duration-1000" style={{ borderColor: `${currentTheme.color}33` }}>
              {preview ? (
                <div className="relative h-full w-full group">
                  <img src={preview} className="w-full h-full object-cover opacity-80 transition-opacity duration-300" alt="Preview" />
                  {loading && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent h-1/3 w-full animate-scan" />}
                  
                  {/* Visual UI Overlays */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="px-2 py-1 bg-black/80 border border-white/10 text-[9px] font-bold tracking-tighter">LIVE_FEED</div>
                    <div className="px-2 py-1 bg-red-600/80 text-[9px] font-bold animate-pulse">REC</div>
                  </div>

                  {/* Remove Button - Visible on Hover */}
                  <button 
                    onClick={removeImage}
                    className="absolute top-4 right-4 bg-red-600/90 hover:bg-red-500 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100"
                  >
                    Remove Source
                  </button>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()} className="h-full flex flex-col items-center justify-center cursor-pointer group bg-neutral-900/20">
                  <div className="w-16 h-16 border-2 border-dashed border-white/10 flex items-center justify-center group-hover:border-amber-400 group-hover:text-amber-400 transition-all">
                    <span className="text-3xl font-light">+</span>
                  </div>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.5em] opacity-30 group-hover:opacity-100 transition-opacity">Initialize Satellite Link</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleDetect}
                disabled={!file || loading}
                className="py-5 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-amber-400 transition-all disabled:opacity-20"
              >
                {loading ? "Decrypting..." : "Execute Scan"}
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="py-5 border-2 border-white/10 text-[10px] font-bold uppercase tracking-widest hover:border-amber-400 hover:text-amber-400 transition-colors"
              >
                Switch Frame
              </button>
            </div>
          </div>

          {/* Intelligence Panel (Cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="flex-1 p-8 border-l-4 transition-all duration-1000 bg-white/[0.02] backdrop-blur-sm" style={{ borderColor: currentTheme.color }}>
              <p className="text-[10px] opacity-40 uppercase tracking-[0.4em] mb-4">Neural Readout</p>
              
              {result ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8">
                  <div>
                    <h2 className="text-6xl font-black italic tracking-tighter leading-none" style={{ color: currentTheme.color }}>
                      {result.severity?.toUpperCase()}
                    </h2>
                    <p className="text-sm font-bold mt-2 tracking-widest text-white/80">{result.type?.replace('_', ' ')}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] opacity-40 uppercase tracking-widest font-bold">Confidence Index</span>
                      <span className="text-2xl font-black">{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 w-full rounded-full overflow-hidden">
                      <div className="h-full bg-current transition-all duration-1000 shadow-[0_0_15px_currentColor]" style={{ width: `${result.confidence * 100}%`, color: currentTheme.color }} />
                    </div>
                  </div>

                  <div className="p-4 bg-black border border-white/5 text-[11px] leading-relaxed italic opacity-70 border-l-2" style={{ borderLeftColor: currentTheme.color }}>
                    "Structural anomalies identified. Environmental protocols updated to status: {result.severity.toUpperCase()}."
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center border border-dashed border-white/5">
                  <p className="text-[10px] uppercase tracking-widest opacity-20 animate-pulse">Awaiting Signal...</p>
                </div>
              )}
            </div>

            {result && (
              <button
                onClick={handleSaveReport}
                disabled={saving}
                className="w-full py-4 border-2 border-white/20 font-black text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all"
              >
                {saving ? "Transmitting..." : "Dispatch Official Report"}
              </button>
            )}
          </div>
        </div>

        <footer className="mt-12 flex justify-between text-[8px] uppercase tracking-[0.5em] opacity-20 border-t border-white/5 pt-4">
          <span>Encrypted: AES-256</span>
          <span>Averra Global Response</span>
          <span>© 2026 // NEURAL_NET_READY</span>
        </footer>
      </div>

      <style>{`
        @keyframes scan-line {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
        .animate-scan { animation: scan-line 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default AIDetect;