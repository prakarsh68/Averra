import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

// Define interface matching your Firestore 'user_reports' schema
interface DisasterReport {
  id: string;
  reporterName: string;
  reporterPhone: string;
  type: string;
  description: string;
  lat: number;
  lng: number;
  status: string;
  verified: boolean;
  timestamp: Timestamp;
  imageUrl?: string;
}

const Dashboard = () => {
  const [reports, setReports] = useState<DisasterReport[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Real-time Firestore Listener ---
  useEffect(() => {
    const q = query(collection(db, "user_reports"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DisasterReport[];

      setReports(fetchedReports);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Stats Calculation ---
  const stats = {
    total: reports.length,
    verified: reports.filter((r) => r.verified).length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-8 font-sans">
      
      {/* Page Title */}
      <div className="max-w-7xl mx-auto mb-8 border-b border-neutral-800 pb-4">
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            📊 Mission Control
          </h2>
          <p className="text-neutral-500 text-sm uppercase tracking-widest mt-1">
            Global Incident Command Center
          </p>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* --- LIVE STATS HUD (3 Key Metrics) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <StatCard 
            label="Total Intel" 
            value={stats.total} 
            color="bg-neutral-900 border-neutral-800 text-white" 
            icon="📝" 
          />
          
          <StatCard 
            label="Verified" 
            value={stats.verified} 
            color="bg-emerald-900/10 border-emerald-900 text-emerald-500" 
            icon="✅" 
          />

          <StatCard 
            label="Resolved" 
            value={stats.resolved} 
            color="bg-blue-900/10 border-blue-900 text-blue-500" 
            icon="🏁" 
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* --- Main Feed (Table) --- */}
            <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <span className="text-amber-500">📡</span> Incoming Reports
                    </h3>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-neutral-500 uppercase bg-neutral-950 border-b border-neutral-800">
                            <tr>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Coordinates</th>
                                <th className="px-6 py-3">Reporter</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-neutral-500 animate-pulse">
                                        Syncing Firestore Data...
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                                        No active reports in database.
                                    </td>
                                </tr>
                            ) : (
                                reports.map((r) => (
                                    <tr key={r.id} className="hover:bg-neutral-800/50 transition duration-150">
                                        <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                                            <span className="text-xl">{getIcon(r.type)}</span> 
                                            <span className="uppercase tracking-wide text-xs">{r.type}</span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-neutral-400 text-xs">
                                            <div>{r.lat.toFixed(4)}, {r.lng.toFixed(4)}</div>
                                            {r.description && <div className="text-[10px] text-neutral-600 truncate max-w-[150px] mt-1">{r.description}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-300">
                                            <div className="font-bold text-xs">{r.reporterName}</div>
                                            <div className="text-[10px] text-neutral-600 font-mono">{r.reporterPhone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {r.verified ? (
                                                <span className="text-emerald-500 text-[10px] font-bold border border-emerald-900 bg-emerald-900/20 px-2 py-1 rounded tracking-widest">VERIFIED</span>
                                            ) : (
                                                <span className="text-amber-500 text-[10px] font-bold border border-amber-900 bg-amber-900/20 px-2 py-1 rounded tracking-widest">PENDING</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Side Panel --- */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-white mb-6">Database Health</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs mb-2 text-neutral-500 uppercase font-bold">
                                <span>Report Volume</span>
                                <span>{stats.total} Active</span>
                            </div>
                            <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 w-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-black rounded border border-neutral-800 text-xs text-neutral-500 font-mono">
                    <p className="border-b border-neutral-800 pb-2 mb-2">SYSTEM LOG:</p>
                    <p className="text-emerald-500"> &gt; Firestore Listener: ACTIVE</p>
                    <p className="text-emerald-500"> &gt; Auth Module: SECURE</p>
                    <p className="text-amber-500 animate-pulse"> &gt; Waiting for new alerts...</p>
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
    switch(type) {
        case 'Fire': return '🔥';
        case 'Flood': return '🌊';
        case 'Earthquake': return '📉';
        case 'Storm': return '🌪';
        case 'Accident': return '🚑';
        default: return '⚠';
    }
}

export default Dashboard;