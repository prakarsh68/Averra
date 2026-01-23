import React, { useState, useRef } from "react";

const VisualAI = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [maskUrl, setMaskUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setMaskUrl(null); // Reset previous result
    }
  };

  const handleSegment = async () => {
    if (!file) return alert("Upload satellite imagery first.");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/segment", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Segmentation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setMaskUrl(url);
    } catch (error) {
      console.error("Segmentation Error", error);
      alert("Error: Visual processing unit failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-neutral-800 pb-6 mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2">
              <span className="text-purple-500">🗺</span> Visual Segmentation
            </h2>
            <p className="text-neutral-500 text-sm uppercase tracking-widest">
              Topological Analysis & Impact Zoning
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 border border-neutral-800 px-3 py-1 rounded-full">
            <span className={`w-2 h-2 rounded-full ${loading ? "bg-purple-500 animate-pulse" : "bg-emerald-500"}`}></span>
            {loading ? "PROCESSING TOPOLOGY..." : "SYSTEM IDLE"}
          </div>
        </div>

        {/* --- Main Interface --- */}
        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Panel: Controls */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* Upload Card */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer group relative h-64 bg-neutral-900 border-2 border-dashed border-neutral-700 rounded-xl flex flex-col items-center justify-center hover:border-purple-500/50 transition duration-300"
                >
                    <div className="text-5xl mb-4 opacity-30 group-hover:opacity-100 transition duration-300 transform group-hover:scale-110">
                        🛰
                    </div>
                    <p className="font-bold text-neutral-300">Upload Terrain Data</p>
                    <p className="text-xs text-neutral-500 mt-2 uppercase">High-Res Imagery Required</p>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                    />
                </div>

                {/* Info Box */}
                <div className="bg-neutral-900 p-5 rounded-lg border border-neutral-800 text-sm">
                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        ℹ Protocol
                    </h4>
                    <p className="text-neutral-500 leading-relaxed">
                        This unit uses semantic segmentation to isolate disaster zones from safe terrain. 
                        Masks are color-coded for rapid topological assessment.
                    </p>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleSegment}
                    disabled={!file || loading}
                    className={`w-full py-4 rounded font-bold text-lg tracking-widest transition uppercase shadow-lg
                        ${!file ? "bg-neutral-800 text-neutral-600 cursor-not-allowed" : 
                        loading ? "bg-neutral-800 text-purple-400 cursor-wait" : 
                        "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20"}`}
                >
                    {loading ? "GENERATING MASK..." : "GENERATE MASK"}
                </button>
            </div>

            {/* Right Panel: Visualization */}
            <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-2 relative min-h-[500px] flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                
                {/* Empty State */}
                {!preview && !loading && (
                    <div className="text-center opacity-30">
                        <div className="text-6xl mb-4">🖼</div>
                        <p className="font-mono uppercase tracking-widest">No Visual Data Loaded</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm rounded-xl">
                        <div className="relative w-24 h-24 mb-6">
                             <div className="absolute inset-0 border-4 border-purple-900 rounded-full"></div>
                             <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-purple-400 font-mono tracking-widest animate-pulse">SEGMENTING TERRAIN...</p>
                    </div>
                )}

                {/* Result View */}
                {(preview || maskUrl) && !loading && (
                    <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-2">
                        
                        {/* Original Image */}
                        <div className="relative rounded-lg overflow-hidden border border-neutral-700 group">
                            <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md z-10">
                                ORIGINAL FEED
                            </span>
                            <img src={preview!} alt="Original" className="w-full h-full object-cover" />
                        </div>

                        {/* Mask Result (or placeholder) */}
                        <div className="relative rounded-lg overflow-hidden border border-neutral-700 bg-black/50 flex items-center justify-center">
                            <span className="absolute top-2 left-2 bg-purple-900/80 text-white text-xs px-2 py-1 rounded backdrop-blur-md z-10 border border-purple-500/30">
                                AI SEGMENTATION
                            </span>
                            
                            {maskUrl ? (
                                <img src={maskUrl} alt="Mask" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-neutral-600 text-xs uppercase tracking-widest text-center px-4">
                                    <p className="mb-2">Waiting for Processing</p>
                                    <div className="h-1 w-12 bg-neutral-700 mx-auto rounded-full"></div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VisualAI;