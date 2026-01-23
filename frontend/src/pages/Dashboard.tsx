import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase"; // Ensure this path matches your file structure

// 1. Interface for Satellite AI Reports
interface AIReport {
  id: string;
  type: string;
  severity: string;
  confidence: number;
  imageUrl: string;
  status: string;
  timestamp: any;
  location?: string;
}

// 2. New Interface for Human SOS Alerts
interface FieldAlert {
  id: string;
  reporterName: string;
  phone: string;
  type: string;
  lat: number;
  lng: number;
  timestamp: any;
  message: string;
}

const Dashboard = () => {
  const [reports, setReports] = useState<AIReport[]>([]);
  const [alerts, setAlerts] = useState<FieldAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Real-time Firestore Listeners ---
  useEffect(() => {
    // Stream A: AI Reports
    const q1 = query(collection(db, "reports"), orderBy("timestamp", "desc"));
    const unsub1 = onSnapshot(q1, (snapshot) => {
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AIReport)));
    });

    // Stream B: SOS Alerts (New)
    const q2 = query(collection(db, "user_reports"), orderBy("timestamp", "desc"));
    const unsub2 = onSnapshot(q2, (snapshot) => {
      setAlerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FieldAlert)));
      setLoading(false);
    });

    return () => { unsub1(); unsub2(); };
  }, []);

  // --- Handle Delete Logic ---
  const handleDeleteReport = async (id: string) => {
    if (window.confirm("Delete this AI report?")) await deleteDoc(doc(db, "reports", id));
  };

  const handleDeleteAlert = async (id: string) => {
    if (window.confirm("Resolve and clear this SOS Alert?")) await deleteDoc(doc(db, "user_reports", id));
  };

  // --- Stats Calculation ---
  const stats = {
    total: reports.length + alerts.length,
    critical: reports.filter((r) => r.severity && (r.severity.toLowerCase().includes("critical") || r.severity.toLowerCase().includes("high"))).length + alerts.length, // Alerts are always critical
    safe: reports.filter((r) => r.severity && (r.severity.toLowerCase().includes("safe") || r.severity.toLowerCase().includes("normal"))).length,
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-8 font-sans">
      
      {/* Page Title */}
      <div className="max-w-7xl mx-auto mb-8 border-b border-neutral-800 pb-4 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-wide">
              📊 Mission Control
            </h2>
            <p className="text-neutral-500 text-sm uppercase tracking-widest mt-1">
              AI Surveillance Command Center
            </p>
          </div>
          {/* Database Connection Status Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 bg-emerald-900/10 px-3 py-1 rounded-full border border-emerald-900/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            DATABASE LIVE
          </div>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* --- LIVE STATS HUD --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Intel Events" value={stats.total} color="bg-neutral-900 border-neutral-800 text-white" icon="📡" />
          <StatCard label="Critical Threats" value={stats.critical} color="bg-red-900/10 border-red-900 text-red-500" icon="⚠️" />
          <StatCard label="Cleared / Safe" value={stats.safe} color="bg-emerald-900/10 border-emerald-900 text-emerald-500" icon="🛡" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* --- Main Feed Column --- */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* 1. SOS ALERTS SECTION (NEW) */}
                {alerts.length > 0 && (
                    <div className="bg-red-950/20 border border-red-900/50 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-red-900/30 flex justify-between items-center bg-red-950/30">
                            <h3 className="font-bold text-red-500 flex items-center gap-2 animate-pulse">
                                <span>🚨</span> ACTIVE SOS SIGNALS ({alerts.length})
                            </h3>
                            <span className="text-xs text-red-400 font-mono">PRIORITY: HIGH</span>
                        </div>
                        <div className="p-4 space-y-3">
                            {alerts.map((alert) => (
                                <div key={alert.id} className="bg-black/40 border border-red-900/30 p-4 rounded-lg flex justify-between items-start group">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-white uppercase">{alert.type || "EMERGENCY"}</span>
                                            <span className="text-xs text-red-400 font-mono">
                                                {alert.timestamp?.seconds ? new Date(alert.timestamp.seconds * 1000).toLocaleTimeString() : "Now"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-neutral-300 mb-2">"{alert.message || "Requesting immediate assistance."}"</p>
                                        <div className="text-xs text-neutral-500 font-mono flex gap-3">
                                            <span>📍 {alert.lat?.toFixed(4)}, {alert.lng?.toFixed(4)}</span>
                                            <span>📞 {alert.phone || "Unknown ID"}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteAlert(alert.id)}
                                        className="text-neutral-600 hover:text-red-500 p-2 opacity-50 group-hover:opacity-100 transition"
                                        title="Resolve Alert"
                                    >✓</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. AI INTELLIGENCE TABLE (EXISTING) */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <span className="text-amber-500">👁‍🗨</span> Incoming Satellite Intel
                        </h3>
                        <span className="text-xs text-neutral-600 font-mono">LIVE FEED</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-neutral-500 uppercase bg-neutral-950 border-b border-neutral-800">
                                <tr>
                                    <th className="px-6 py-3">Snapshot</th>
                                    <th className="px-6 py-3">Classification</th>
                                    <th className="px-6 py-3">Severity</th>
                                    <th className="px-6 py-3">Confidence</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 animate-pulse">Syncing...</td>
                                    </tr>
                                ) : reports.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-neutral-600">No AI reports found.</td>
                                    </tr>
                                ) : (
                                    reports.map((r) => (
                                        <tr key={r.id} className="hover:bg-neutral-800/50 transition duration-150 group">
                                            <td className="px-6 py-4">
                                              <div className="h-12 w-16 bg-neutral-800 rounded overflow-hidden border border-neutral-700 relative">
                                                {r.imageUrl ? (
                                                  <img src={r.imageUrl} alt="scan" className="h-full w-full object-cover" />
                                                ) : <div className="h-full w-full flex items-center justify-center text-xs text-neutral-600">N/A</div>}
                                              </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-white">
                                                <div className="flex items-center gap-2">
                                                  <span>{getIcon(r.type)}</span>
                                                  <span>{r.type}</span>
                                                </div>
                                                <div className="text-[10px] text-neutral-500 font-mono mt-1">
                                                  {r.timestamp?.seconds ? new Date(r.timestamp.seconds * 1000).toLocaleString() : "Syncing..."}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                              <span className={`text-[10px] font-bold border px-2 py-1 rounded tracking-widest uppercase ${getSeverityStyle(r.severity)}`}>
                                                {r.severity}
                                              </span>
                                            </td>
                                            <td className="px-6 py-4 min-w-[140px]">
                                                <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                                                  <span>Probability</span>
                                                  <span>{Math.round(r.confidence * 100)}%</span>
                                                </div>
                                                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                                                  <div className={`h-full ${r.confidence > 0.6 ? 'bg-amber-500' : 'bg-neutral-600'}`} style={{ width: `${r.confidence * 100}%` }}></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                               <button onClick={() => handleDeleteReport(r.id)} className="text-neutral-600 hover:text-red-500 transition p-2 rounded hover:bg-red-900/20">🗑</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- Side Panel --- */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col justify-between h-fit">
                <div>
                    <h3 className="font-bold text-white mb-6">System Status</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs mb-2 text-neutral-500 uppercase font-bold">
                                <span>Storage Used</span>
                                <span>{(stats.total * 1.2).toFixed(1)} MB</span>
                            </div>
                            <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-600" style={{ width: `${Math.min(stats.total * 2, 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-black rounded border border-neutral-800 text-xs text-neutral-500 font-mono">
                    <p className="border-b border-neutral-800 pb-2 mb-2">LIVE LOGS:</p>
                    <p className="text-emerald-500"> &gt; Firestore: CONNECTED</p>
                    <p className="text-emerald-500"> &gt; Sync: REAL-TIME</p>
                    {stats.critical > 0 && (
                      <p className="text-red-500 animate-pulse font-bold"> &gt; ALERT: {stats.critical} THREATS FOUND</p>
                    )}
                     <p className="text-amber-500 mt-2"> &gt; Listening for incoming streams...</p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

// --- Helper Functions ---

const StatCard = ({ label, value, color, icon }: { label: string, value: number, color: string, icon: string }) => (
  <div className={`p-6 border rounded-xl flex items-center justify-between ${color} shadow-lg`}>
    <div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">{label}</h4>
        <p className="text-4xl font-extrabold">{value}</p>
    </div>
    <div className="text-4xl opacity-80">{icon}</div>
  </div>
);

const getIcon = (type: string) => {
    if (!type) return '❓';
    if (type.includes("Fire")) return '🔥';
    if (type.includes("Flood")) return '🌊';
    if (type.includes("Cyclone") || type.includes("Storm")) return '🌪';
    if (type.includes("Earthquake") || type.includes("Building")) return '📉';
    if (type.includes("Normal") || type.includes("Safe")) return '✅';
    return '⚠️';
}

const getSeverityStyle = (severity: string) => {
  if (!severity) return "text-neutral-500 border-neutral-800";
  const s = severity.toLowerCase();
  if (s.includes("critical")) return "text-red-500 border-red-900 bg-red-900/10";
  if (s.includes("high")) return "text-orange-500 border-orange-900 bg-orange-900/10";
  if (s.includes("safe") || s.includes("normal")) return "text-emerald-500 border-emerald-900 bg-emerald-900/10";
  return "text-amber-400 border-amber-900 bg-amber-900/10";
};

export default Dashboard;