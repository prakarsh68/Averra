import React, { useState, useEffect } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

const Alerts = () => {
  // --- Form State ---
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  // --- Image State ---
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- UI/Auth State ---
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [verificationResult, setVerificationResult] = useState<ConfirmationResult | null>(null);

  const auth = getAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // --- 1. ROBUST RECAPTCHA SETUP ---
  useEffect(() => {
    // Cleanup function to prevent "element has been removed" error
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.warn("Recaptcha clear error", e);
        }
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const setupRecaptcha = () => {
    // If it exists, clear it first
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }

    // Create new instance
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => console.log("Recaptcha Solved"),
      "expired-callback": () => {
         console.log("Recaptcha Expired");
         window.recaptchaVerifier?.clear();
         window.recaptchaVerifier = null;
      }
    });
  };

  // --- 2. LOCATION ACQUISITION ---
  const handleGetLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setLocationLoading(false);
      },
      (err) => {
        alert("Location access denied.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // --- 3. IMAGE HANDLER ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // --- 4. SEND OTP ---
  const handleSendOtp = async () => {
    if (!name || !phone || !type || !description || !lat || !lng) {
      alert("Please fill all required fields and ACQUIRE GPS LOCK.");
      return;
    }

    if (!phone.startsWith("+") || phone.length < 10) {
      alert("Phone format invalid. Use Country Code (e.g. +919999999999)");
      return;
    }

    setLoading(true);

    try {
      // Initialize reCAPTCHA just before sending
      if (!window.recaptchaVerifier) {
        setupRecaptcha();
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setVerificationResult(confirmation);
      setStep("otp");
    } catch (error: any) {
      console.error("SMS Error:", error);
      alert(`SMS Failed: ${error.message}`);
      
      // If error occurs, assume captcha is dead and clear it
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    }
    setLoading(false);
  };

  // --- 5. VERIFY & SUBMIT ---
  const handleVerifyAndSubmit = async () => {
    if (!otp || !verificationResult) return alert("Enter Verification Code.");
    setLoading(true);

    try {
      await verificationResult.confirm(otp);

      let downloadUrl = "";
      if (imageFile) {
        const storageRef = ref(storage, `evidence/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        downloadUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "user_reports"), {
        reporterName: name,
        reporterPhone: phone,
        type,
        description,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        imageUrl: downloadUrl || null,
        verified: false,
        status: "pending",
        source: "User (Verified)",
        timestamp: Timestamp.now(),
      });

      alert("✅ Transmission Successful. Help is on the way.");
      
      // Reset
      setStep("form");
      setName(""); setPhone(""); setOtp(""); setType(""); setDescription("");
      setLat(""); setLng(""); setImageFile(null); setImagePreview(null);
      setVerificationResult(null);

    } catch (error) {
      console.error("Submit Error:", error);
      alert("Verification Failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-4 md:p-8 flex justify-center items-center font-sans">
      
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden">
        
        {/* Decorative Line */}
        <div className="h-1 w-full bg-gradient-to-r from-neutral-800 via-amber-600 to-neutral-800"></div>

        <div className="p-6 md:p-10">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    {step === "form" ? (
                        <><span className="text-red-500 animate-pulse">●</span> LIVE REPORT</>
                    ) : (
                        <><span className="text-green-500">🔒</span> SECURE LINK</>
                    )}
                </h2>
                <p className="text-neutral-500 text-sm font-mono mt-1 uppercase tracking-widest">
                    {step === "form" ? "Civilian Intelligence Interface" : "Identity Verification Protocol"}
                </p>
            </div>
            <div className="hidden md:flex gap-2">
                <div className={`h-2 w-8 rounded-full ${step === "form" ? "bg-amber-500" : "bg-neutral-800"}`}></div>
                <div className={`h-2 w-8 rounded-full ${step === "otp" ? "bg-amber-500" : "bg-neutral-800"}`}></div>
            </div>
          </div>

          {/* --- STAGE 1: DATA ENTRY --- */}
          {step === "form" && (
            <div className="space-y-6 animate-fade-in-up">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase ml-1">Reporter Name</label>
                    <input 
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg p-3 text-white placeholder-neutral-700 outline-none transition" 
                        placeholder="EX: JOHN DOE" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase ml-1">Contact (Mobile)</label>
                    <input 
                        type="tel" 
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg p-3 text-white placeholder-neutral-700 outline-none transition" 
                        placeholder="+91..." 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                    />
                </div>
              </div>

              <div className="space-y-1">
                 <label className="text-xs font-bold text-neutral-500 uppercase ml-1">Incident Classification</label>
                 <div className="grid grid-cols-3 gap-2">
                    {["Fire", "Flood", "Storm", "Earthquake", "Accident", "Other"].map((t) => (
                        <button 
                            key={t}
                            onClick={() => setType(t)}
                            className={`p-2 rounded border text-sm font-bold transition duration-200 ${type === t ? "bg-amber-500 border-amber-500 text-black" : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-600"}`}
                        >
                            {t}
                        </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-1">
                 <label className="text-xs font-bold text-neutral-500 uppercase ml-1">Situation Report</label>
                 <textarea 
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg p-3 text-white placeholder-neutral-700 outline-none h-24 transition resize-none" 
                    placeholder="Describe severity, casualties, and immediate threats..." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                 />
              </div>

              <div className={`p-4 rounded-xl border transition-colors duration-300 ${lat ? "bg-emerald-900/10 border-emerald-500/30" : "bg-neutral-950 border-neutral-800"}`}>
                 <div className="flex justify-between items-center">
                    <div>
                        <div className="text-xs font-bold text-neutral-500 uppercase mb-1">GPS Coordinates</div>
                        <div className="font-mono text-sm tracking-wide">
                            {lat ? (
                                <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                                    {lat} N / {lng} E
                                </span>
                            ) : (
                                <span className="text-neutral-600">--.------ / --.------</span>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={handleGetLocation} 
                        disabled={locationLoading}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-2
                            ${lat ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"}
                        `}
                    >
                        {locationLoading ? (
                            <span className="flex items-center gap-2"><span className="animate-spin">◌</span> Acquiring...</span>
                        ) : (
                            <>{lat ? "Update Signal" : "📡 Acquire Lock"}</>
                        )}
                    </button>
                 </div>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group relative h-32 rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                    ${imagePreview ? "border-amber-500 bg-black" : "border-neutral-700 bg-neutral-950 hover:bg-neutral-900 hover:border-neutral-500"}
                `}
              >
                 {imagePreview ? (
                    <>
                        <img src={imagePreview} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition" />
                        <div className="absolute inset-0 flex items-center justify-center">
                             <span className="bg-black/80 text-white px-3 py-1 rounded text-xs uppercase font-bold backdrop-blur-sm border border-neutral-700">Change Evidence</span>
                        </div>
                    </>
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-500 group-hover:text-neutral-300">
                        <span className="text-3xl mb-2">📷</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Upload Visual Intel</span>
                    </div>
                 )}
                 <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden accept="image/*" />
              </div>

              <button 
                onClick={handleSendOtp} 
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-500 text-black font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(217,119,6,0.2)] hover:shadow-[0_0_30px_rgba(217,119,6,0.4)] transition transform active:scale-[0.98] uppercase tracking-widest"
              >
                {loading ? "Establishing Uplink..." : "Verify & Transmit Alert"}
              </button>

            </div>
          )}

          {/* --- STAGE 2: OTP VERIFICATION --- */}
          {step === "otp" && (
            <div className="space-y-8 animate-fade-in-up text-center py-8">
               
               <div className="mx-auto w-20 h-20 bg-neutral-900 border border-neutral-700 rounded-full flex items-center justify-center mb-4 relative">
                   <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-ping"></div>
                   <span className="text-3xl">🔐</span>
               </div>

               <div>
                   <h3 className="text-xl font-bold text-white mb-2">Authentication Required</h3>
                   <p className="text-neutral-400 text-sm">Enter the 6-digit secure code sent to <br/><span className="text-amber-500 font-mono">{phone}</span></p>
               </div>

               <div className="flex justify-center">
                   <input 
                      type="text" 
                      maxLength={6} 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="• • • • • •"
                      className="bg-black border-b-2 border-amber-500 text-center text-4xl text-white tracking-[0.5em] w-64 py-2 focus:outline-none focus:border-amber-400 placeholder-neutral-800 font-mono"
                   />
               </div>

               <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setStep("form")}
                    className="flex-1 py-3 bg-neutral-800 text-neutral-400 font-bold rounded-lg hover:bg-neutral-700 transition"
                  >
                    ABORT
                  </button>
                  <button 
                    onClick={handleVerifyAndSubmit}
                    disabled={loading}
                    className="flex-[2] py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition shadow-lg shadow-green-900/30"
                  >
                    {loading ? "Verifying..." : "CONFIRM IDENTITY"}
                  </button>
               </div>
            </div>
          )}

        </div>
        
        {/* RECAPTCHA CONTAINER - ALWAYS RENDERED, NEVER CONDITIONALLY HIDDEN */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default Alerts;