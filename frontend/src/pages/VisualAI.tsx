import React, { useState, useRef } from "react";

interface IntelResult {
  area_type: string;
  confidence: number;
}

const VisualIntel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<IntelResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return alert("Upload satellite image first");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/visual-intel", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Visual Intel Error", error);
      alert("Failed to analyze satellite image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="border-b border-neutral-800 pb-6 mb-8">
          <h2 className="text-3xl font-bold text-white">
            🛰 Visual Intel – Land Classification
          </h2>
          <p className="text-neutral-500 text-sm uppercase tracking-widest">
            EuroSAT Satellite Intelligence Unit
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Upload */}
          <div className="space-y-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer h-80 bg-neutral-900 border-2 border-dashed border-neutral-700 rounded-xl flex items-center justify-center"
            >
              {preview ? (
                <img src={preview} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-center">
                  <div className="text-5xl mb-3">🛰</div>
                  <p className="font-bold">Upload Satellite Image</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={`w-full py-4 rounded-lg font-bold text-lg transition
                ${!file ? "bg-neutral-800 text-neutral-600" :
                  loading ? "bg-neutral-800 text-purple-500" :
                  "bg-purple-600 hover:bg-purple-500 text-white"}`}
            >
              {loading ? "ANALYZING..." : "ANALYZE TERRAIN"}
            </button>
          </div>

          {/* Result */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Terrain Analysis
            </h3>

            {result ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Area Type</span>
                  <span className="text-purple-400 font-bold text-lg">
                    {result.area_type}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-neutral-500 mb-1">
                    <span>AI CONFIDENCE</span>
                    <span>{Math.round(result.confidence * 100)}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-neutral-600">Awaiting satellite input...</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default VisualIntel;
