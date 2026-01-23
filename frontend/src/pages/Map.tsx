import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import AlertsPanel from "../components/AlertsPanel";

// --- Types ---
interface Disaster {
  id: string;
  type: string;
  severity: string;
  description: string;
  location: [number, number];
  source: string;
  reporter?: string;
  image?: string;
}

const center: LatLngExpression = [20.5937, 78.9629]; // India Center

const Map = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);

  // 🔥 Real-time Firestore Sync
  useEffect(() => {
    const q = query(collection(db, "user_reports"), orderBy("timestamp", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => {
          const d = doc.data();
          if (!d.lat || !d.lng) return null;

          // --- 🔧 FIX: COORDINATE JITTER ---
          // Add a tiny random offset (approx 10-50m) so markers don't stack perfectly
          const jitter = 0.0005; 
          const lat = parseFloat(d.lat) + (Math.random() - 0.5) * jitter;
          const lng = parseFloat(d.lng) + (Math.random() - 0.5) * jitter;

          return {
            id: doc.id,
            type: d.type || "Unknown",
            severity: d.verified ? "High" : "Unverified",
            description: d.description || "No description provided.",
            location: [lat, lng], // Use jittered coordinates
            source: d.source || "User Report",
            reporter: d.reporterName || "Anonymous",
            image: d.imageUrl || null
          };
        })
        .filter(Boolean) as Disaster[];

      console.log("🔥 Map Reports Loaded:", data.length); // Check console to verify count
      setDisasters(data);
    });

    return () => unsub();
  }, []);

  // --- Custom Tactical Icons ---
  const getCustomIcon = (type: string, severity: string) => {
    const t = type.toLowerCase();
    const s = severity.toLowerCase();

    let emoji = "⚠";
    if (t.includes("fire")) emoji = "🔥";
    else if (t.includes("flood")) emoji = "💧";
    else if (t.includes("storm") || t.includes("cyclone")) emoji = "🌪";
    else if (t.includes("quake")) emoji = "📉";
    else if (t.includes("accident")) emoji = "🚑";

    // Dynamic Colors
    let colorClass = "border-emerald-500 shadow-emerald-500/50";
    let pulseClass = "bg-emerald-500";

    if (s.includes("critical") || s.includes("high")) {
      colorClass = "border-red-600 shadow-red-600/50";
      pulseClass = "bg-red-600";
    } else if (s.includes("unverified")) {
      colorClass = "border-amber-500 shadow-amber-500/50";
      pulseClass = "bg-amber-500";
    }

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="relative w-10 h-10 flex items-center justify-center group">
          <div class="absolute w-full h-full rounded-full animate-ping opacity-75 ${pulseClass}"></div>
          <div class="relative z-10 w-10 h-10 bg-black/80 rounded-full border-2 ${colorClass} flex items-center justify-center text-xl backdrop-blur-sm transition-transform group-hover:scale-110">
            ${emoji}
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-6 font-sans flex flex-col gap-6">

      {/* Header + Alerts */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold text-white tracking-wide flex items-center gap-3">
            <span className="text-amber-500 animate-pulse">📡</span> Live Geospatial Intelligence
          </h2>
          <p className="text-neutral-500 text-sm uppercase tracking-widest mt-1">
            Real-time Disaster Tracking & Zone Analysis
          </p>
        </div>
        <div className="flex-1">
          <AlertsPanel />
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[75vh] bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl shadow-black/50">

        {/* HUD Overlay */}
        <div className="absolute top-4 left-4 z-[400] bg-black/80 backdrop-blur border border-neutral-700 px-4 py-2 rounded text-xs font-mono text-emerald-400 pointer-events-none">
          ● SYSTEM ONLINE <span className="text-neutral-500 ml-2">LIVE FEED: {disasters.length} REPORTS</span>
        </div>

        <div className="absolute bottom-4 left-4 z-[400] pointer-events-none">
          <div className="text-[10px] text-neutral-500 uppercase font-mono bg-black/50 px-2 py-1 rounded">
            Map Source: CartoDB Dark Matter
          </div>
        </div>

        <MapContainer
          center={center}
          zoom={5}
          style={{ height: "100%", width: "100%", background: "#1a1a1a" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {disasters.map((d) => (
            <Marker
              key={d.id}
              position={d.location}
              icon={getCustomIcon(d.type, d.severity)}
            >
              <Popup className="tactical-popup">
                <div className="p-1 min-w-[200px]">
                  {/* Image Preview if available */}
                  {d.image && (
                    <div className="mb-2 rounded overflow-hidden h-32 w-full">
                       <img src={d.image} alt="Evidence" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-2 border-b border-neutral-200 pb-1">
                    <strong className="uppercase text-sm tracking-widest text-neutral-800">{d.type}</strong>
                    <span className={`text-xs font-bold uppercase ${d.severity === 'Unverified' ? 'text-amber-600' : 'text-red-600'}`}>
                        {d.severity}
                    </span>
                  </div>
                  
                  <p className="text-xs text-neutral-600 leading-relaxed mb-2">{d.description}</p>
                  
                  <div className="bg-neutral-100 p-2 rounded text-[10px] text-neutral-500 font-mono space-y-1">
                    <div>COORD: {d.location[0].toFixed(4)}, {d.location[1].toFixed(4)}</div>
                    <div>SOURCE: {d.reporter} ({d.source})</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
};

export default Map;