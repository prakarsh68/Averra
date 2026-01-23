import React, { useState, useRef } from "react";
import { storage, db } from "../firebase"; // Import your firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface DetectionResult {
  detected: boolean;
  type: string;
  severity: string;
  confidence: number;
}

const CONFIDENCE_THRESHOLD = 0.60;

const AIDetect = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false); // New state for saving
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
      const res = await fetch("http://127.0.0.1:8000/detect", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const isConfident = data.confidence >= CONFIDENCE_THRESHOLD;
      
      if (isConfident && data.detected) {
        setResult({
          detected: true,
          type: formatType(data.type),
          severity: data.severity,
          confidence: data.confidence
        });
      } else {
        setResult({
          detected: false,
          type: "Normal Activity",
          severity: "Safe",
          confidence: data.confidence
        });
      }

    } catch (error) {
      console.error("AI Error", error);
      alert("Unable to connect to AI Engine.");
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: SAVE TO FIREBASE LOGIC ---
  const handleSaveReport = async () => {
    if (!file || !result) return;
    setSaving(true);

    try {
      // 1. Upload Image to Storage
      const storageRef = ref(storage, `reports/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      // 2. Save Data to Firestore
      await addDoc(collection(db, "reports"), {
        type: result.type,
        severity: result.severity,
        confidence: result.confidence,
        imageUrl: imageUrl,
        timestamp: serverTimestamp(),
        status: "Pending Review", // Default status for dashboard
        location: "Unknown (Satellite)" // Placeholder
      });

      alert("Report filed successfully! Redirecting to Dashboard...");
      navigate("/dashboard"); // Go to dashboard after saving

    } catch (error) {
      console.error("Error saving report:", error);
      alert("Failed to save report.");
    } finally {
      setSaving(false);
    }
  };
  // -----------------------------------

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
              <span className="text-amber-500">👁‍🗨</span> AVERRA AI Vision
            </h2>
            <p className="text-neutral-500 text-sm uppercase tracking-widest">
              Disaster Recognition Engine
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
                  {!loading && !saving && (
                    <button onClick={clearScan} className="absolute top-2 right-2 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full">
                      ✕
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center cursor-pointer p-10" onClick={() => fileInputRef.current?.click()}>
                  <div className="text-5xl mb-4 opacity-50">🛰</div>
                  <p className="font-bold">Upload Disaster Image</p>
                  <p className="text-xs text-neutral-500">Satellite / Drone / Mobile</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            <button
              onClick={handleDetect}
              disabled={!file || loading || saving}
              className={`w-full py-4 rounded-lg font-bold text-lg transition
                ${!file ? "bg-neutral-800 text-neutral-600" :
                  loading ? "bg-neutral-800 text-amber-500" :
                  "bg-amber-600 hover:bg-amber-500 text-black"}`}
            >
              {loading ? "PROCESSING..." : "INITIATE SCAN"}
            </button>
          </div>

          {/* Results */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-6 border-b border-neutral-800 pb-2">
                AI Analysis
              </h3>

              {result ? (
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Threat Status</span>
                    <span className={result.detected ? "text-red-500 font-bold" : "text-emerald-500 font-bold"}>
                      {result.detected ? "⚠️ THREAT DETECTED" : "✅ NO THREAT"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-400">Classification</span>
                    <span className={`font-bold ${result.detected ? "text-white" : "text-neutral-500"}`}>
                      {result.type}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block mb-1">Severity Assessment</span>
                    <span className={`text-2xl font-bold ${getSeverityColor(result.severity)}`}>
                      {result.severity}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-neutral-500 mb-1">
                      <span>AI CONFIDENCE</span>
                      <span>{Math.round(result.confidence * 100)}%</span>
                    </div>
                    
                    <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${result.confidence < CONFIDENCE_THRESHOLD ? "bg-neutral-600" : "bg-amber-500"}`} 
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                    
                    {result.confidence < CONFIDENCE_THRESHOLD && (
                       <p className="text-xs text-neutral-600 mt-2">
                         * Confidence too low to confirm disaster. Marked as safe.
                       </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-neutral-700">
                  <div className="text-4xl mb-2 animate-pulse">📡</div>
                  <p>Waiting for satellite data...</p>
                </div>
              )}
            </div>

            {/* SAVE BUTTON - Only shows if a result exists */}
            {result && (
              <button
                onClick={handleSaveReport}
                disabled={saving}
                className={`w-full mt-6 py-3 rounded-lg border font-bold text-sm tracking-widest uppercase transition
                  ${saving 
                    ? "bg-neutral-800 border-neutral-700 text-neutral-500 cursor-wait" 
                    : "border-white/20 hover:bg-white hover:text-black text-white"}`}
              >
                {saving ? "UPLOADING TO HQ..." : "📄 FILE OFFICIAL REPORT"}
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

// Beautify labels
const formatType = (raw: string) => {
  return raw.replaceAll("_", " ").replace("Disaster", "").trim();
};

// Safe severity color handler
const getSeverityColor = (severity?: string) => {
  if (!severity) return "text-neutral-500";
  const s = severity.toLowerCase();
  if (s.includes("critical")) return "text-red-500";
  if (s.includes("high")) return "text-orange-500";
  if (s.includes("medium")) return "text-amber-400";
  if (s.includes("safe") || s.includes("normal")) return "text-emerald-500";
  return "text-emerald-400";
};

export default AIDetect;