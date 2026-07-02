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
  const [isDeepScan, setIsDeepScan] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    if (preview) URL.revokeObjectURL(preview);

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("deep_scan", String(isDeepScan));

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/visual-intel",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (    
  <div
      className={`min-h-screen transition-colors duration-700 font-mono p-4 md:p-8 ${
        isDeepScan ? "bg-[#05010a]" : "bg-[#02040a]"
      } text-slate-300`}
    >
      {/* Background Grid */}
      <div
        className={`fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:40px_40px] transition-colors duration-700 ${
          isDeepScan ? "text-purple-900" : "text-cyan-900"
        }`}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <header className="flex justify-between items-center border-b border-white/10 pb-6 mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              AVERRA INTEL
            </h1>

            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 mt-2">
              EuroSAT Satellite Intelligence Module
            </p>
          </div>

          <div className="flex items-center gap-4">

            <span
              className={`text-[10px] tracking-[0.3em] font-bold ${
                isDeepScan ? "text-purple-400" : "text-slate-500"
              }`}
            >
              {isDeepScan ? "NEURAL OVERDRIVE" : "STANDARD SCAN"}
            </span>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isDeepScan}
                onChange={() => {
                  setIsDeepScan(!isDeepScan);
                  setResult(null);
                }}
              />

              <div className="w-11 h-6 rounded-full bg-slate-700 peer-checked:bg-purple-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">

          {/* LEFT SIDE */}
          <div className="lg:col-span-7 space-y-6">

            <div
              className={`relative aspect-video rounded border overflow-hidden ${
                isDeepScan
                  ? "border-purple-500/40"
                  : "border-slate-700"
              }`}
            >

              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full flex flex-col justify-center items-center cursor-pointer opacity-40 hover:opacity-100"
                >
                  <span className="text-5xl mb-4">🛰️</span>

                  <p className="tracking-[0.4em] text-xs uppercase">
                    Inject Visual Data
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={`w-full py-5 font-black uppercase tracking-[0.35em]
              ${
                !file || loading
                  ? "bg-slate-900 text-slate-600"
                  : isDeepScan
                  ? "bg-purple-600 hover:bg-purple-500"
                  : "bg-cyan-500 hover:bg-cyan-400 text-black"
              }`}
            >
              {loading
                ? "ANALYZING..."
                : isDeepScan
                ? "EXECUTE DEEP SCAN"
                : "START ANALYSIS"}
            </button>
          </div>
          {/* RIGHT SIDE */}
          <div className="lg:col-span-5">

            <div
              className={`h-full p-8 rounded border ${
                isDeepScan
                  ? "border-purple-500/30 bg-purple-500/5"
                  : "border-slate-800 bg-slate-900/20"
              }`}
            >

              <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 mb-8">
                Analysis Module
              </p>

              {result ? (

                <div className="space-y-8 animate-in fade-in">

                  {/* Area */}
                  <div>

                    <h2
                      className={`text-5xl font-black ${
                        isDeepScan
                          ? "text-purple-400"
                          : "text-cyan-300"
                      }`}
                    >
                      {result.area_type
                        .replace(/([a-z])([A-Z])/g, "$1 $2")
                        .replaceAll("_", " ")
                        .toUpperCase()}
                    </h2>

                    <p className="mt-3 text-xs uppercase tracking-[0.3em] text-slate-500">
                      Classified using{" "}
                      {isDeepScan
                        ? "Neural Overdrive"
                        : "Standard Core"}
                    </p>

                    <p className="mt-3 text-lg font-bold text-cyan-400">
                      Confidence: {(result.confidence * 100).toFixed(2)}%
                    </p>

                  </div>

                  {/* AI Status */}

                  <div className="rounded border border-cyan-500/20 p-4">

                    <p className="text-cyan-400 text-xs uppercase tracking-[0.4em] mb-4">
                      AI STATUS
                    </p>

                    <div className="space-y-2 text-sm">

                      <div className="flex justify-between">
                        <span>Model</span>
                        <span className="text-green-400">
                          ONLINE
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Image Processing</span>
                        <span className="text-green-400">
                          COMPLETE
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Terrain Analysis</span>
                        <span className="text-green-400">
                          COMPLETE
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Risk Engine</span>
                        <span className="text-green-400">
                          READY
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* Risk Analysis */}

                  <div>

                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-5">
                      Risk Analysis
                    </p>

                    <div className="space-y-5">

                      {/* Flood */}

                      <div>

                        <div className="flex justify-between mb-2">

                          <span>Flood</span>

                          <span className="text-red-400 font-bold">
                            {result.risks.flood_risk}%
                          </span>

                        </div>

                        <div className="w-full h-2 rounded bg-slate-800">

                          <div
                            className="h-2 rounded bg-red-500"
                            style={{
                              width: `${result.risks.flood_risk}%`,
                            }}
                          />

                        </div>

                      </div>

                      {/* Wildfire */}

                      <div>

                        <div className="flex justify-between mb-2">

                          <span>Wildfire</span>

                          <span className="text-orange-400 font-bold">
                            {result.risks.wildfire_risk}%
                          </span>

                        </div>

                        <div className="w-full h-2 rounded bg-slate-800">

                          <div
                            className="h-2 rounded bg-orange-500"
                            style={{
                              width: `${result.risks.wildfire_risk}%`,
                            }}
                          />

                        </div>

                      </div>

                      {/* Landslide */}

                      <div>

                        <div className="flex justify-between mb-2">

                          <span>Landslide</span>

                          <span className="text-yellow-400 font-bold">
                            {result.risks.landslide_risk}%
                          </span>

                        </div>

                        <div className="w-full h-2 rounded bg-slate-800">

                          <div
                            className="h-2 rounded bg-yellow-500"
                            style={{
                              width: `${result.risks.landslide_risk}%`,
                            }}
                          />

                        </div>

                      </div>

                    </div>

                  </div>
                  {/* Deep Scan Logs */}
                  {isDeepScan && result.metadata && (
                    <div className="border-t border-purple-500/20 pt-6">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400 mb-4">
                        Neural Log
                      </p>

                      <div className="space-y-2">
                        {result.metadata.map((log, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-xs text-purple-300"
                          >
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer Message */}
                  <div className="pt-6 border-t border-white/10">

                    <p className="text-xs italic text-slate-400 leading-relaxed">
                      {isDeepScan
                        ? "> Neural analysis complete. Terrain and environmental anomalies processed successfully."
                        : "> Standard satellite analysis completed successfully."}
                    </p>

                  </div>

                </div>

              ) : (

                <div className="h-72 flex items-center justify-center border border-dashed border-slate-700 rounded">

                  <p className="text-xs uppercase tracking-[0.4em] text-slate-600">
                    Awaiting Visual Input
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

      <style>{`
        @keyframes scan {
          0% {
            top: 0%;
          }

          100% {
            top: 100%;
          }
        }

        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>

    </div>
  );
};

export default VisualIntel;