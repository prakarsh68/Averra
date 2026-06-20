import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase"; 
import { Link } from "react-router-dom";
import Map from "./Map"; // Integrating your existing Map component
import DisasterTrendChart from "../components/DisasterTrendChart";
import RiskAssessment from "../components/RiskAssessment";

const Dashboard = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'standard' | 'hazard'>('standard');
  const [isPanic, setIsPanic] = useState(false);
  const disasterStats = [
  { name: "Flood", count: 45 },
  { name: "Earthquake", count: 18 },
  { name: "Cyclone", count: 32 },
  { name: "Wildfire", count: 12 },
];

const riskLevel = "HIGH";

  useEffect(() => {
    const q1 = query(collection(db, "reports"), orderBy("timestamp", "desc"));
    const unsub1 = onSnapshot(q1, (snapshot) => {
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const q2 = query(collection(db, "user_reports"), orderBy("timestamp", "desc"));
    const unsub2 = onSnapshot(q2, (snapshot) => {
      setAlerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => { unsub1(); unsub2(); };
  }, []);

  const isHazard = theme === 'hazard';

  // Dynamic Theme Logic
  const colors = isPanic 
    ? { bg: "bg-[#1a0000]", accent: "text-red-500", border: "border-red-600", panel: "bg-red-950/20", mapRing: "ring-red-600/50" }
    : isHazard 
    ? { bg: "bg-[#0f0f00]", accent: "text-yellow-500", border: "border-yellow-600/40", panel: "bg-yellow-600/5", mapRing: "ring-yellow-500/20" }
    : { bg: "bg-[#050505]", accent: "text-white", border: "border-white/10", panel: "bg-white/[0.02]", mapRing: "ring-white/5" };

  return (
    <div className={`min-h-screen ${colors.bg} text-neutral-400 font-mono transition-all duration-500 relative overflow-hidden`}>
      
      {/* GLOBAL HUD OVERLAYS */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]" />
      {isPanic && <div className="fixed inset-0 pointer-events-none z-40 animate-[pulse_0.8s_infinite] bg-red-600/5" />}

      {/* TOP NAVIGATION */}
      <nav className={`flex justify-between items-center px-6 py-3 border-b ${colors.border} backdrop-blur-md sticky top-0 z-50`}>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-[10px] tracking-[0.4em] font-black hover:text-white transition-colors">← RETURN_BASE</Link>
          <button 
            onClick={() => setIsPanic(!isPanic)} 
            className={`px-3 py-1 text-[9px] font-black tracking-tighter border transition-all ${isPanic ? 'bg-red-600 text-white animate-pulse' : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'}`}
          >
            {isPanic ? "SYSTEM_RECOVERY" : "SIGNAL_PANIC"}
          </button>
        </div>
        
        <div className="flex bg-black border border-white/10 p-1">
          <button onClick={() => setTheme('standard')} className={`px-4 py-1 text-[9px] font-bold ${!isHazard && !isPanic ? 'bg-white text-black' : ''}`}>COBALT</button>
          <button onClick={() => setTheme('hazard')} className={`px-4 py-1 text-[9px] font-bold ${isHazard && !isPanic ? 'bg-yellow-500 text-black' : ''}`}>HAZARD</button>
        </div>
      </nav>

      <main className="max-w-[1800px] mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

  <div className="p-4 border border-red-500/30 bg-red-500/5 rounded">
    <p className="text-xs opacity-60">Active Alerts</p>
    <h2 className="text-3xl font-bold text-red-500">
      {alerts.length}
    </h2>
  </div>

  <div className="p-4 border border-yellow-500/30 bg-yellow-500/5 rounded">
    <p className="text-xs opacity-60">Reports</p>
    <h2 className="text-3xl font-bold text-yellow-500">
      {reports.length}
    </h2>
  </div>

  <div className="p-4 border border-green-500/30 bg-green-500/5 rounded">
    <p className="text-xs opacity-60">Resolved Cases</p>
    <h2 className="text-3xl font-bold text-green-500">
      91
    </h2>
  </div>

  <div className="p-4 border border-blue-500/30 bg-blue-500/5 rounded">
    <p className="text-xs opacity-60">Risk Level</p>
    <h2 className="text-3xl font-bold text-blue-500">
      HIGH
    </h2>
  </div>

</div>
        
        {/* DASHBOARD GRID */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* LEFT: LIVE MAP (THE HEART OF THE DASHBOARD) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <section className={`relative h-[600px] rounded-sm border ${colors.border} overflow-hidden ring-1 ${colors.mapRing}`}>
                {/* Tactical Frame Overlays */}
                <div className="absolute top-4 left-4 z-10 bg-black/80 p-2 border border-white/10 text-[9px] font-bold">
                    GRID_REF: 44.192.00.1
                </div>
                <div className={`absolute inset-0 z-[5] pointer-events-none border-[20px] border-transparent ${isPanic ? 'shadow-[inset_0_0_100px_rgba(220,38,38,0.2)]' : ''}`} />
                
                {/* YOUR MAP COMPONENT */}
                <Map />
            </section>
            <section className={`${colors.panel} border ${colors.border} rounded-sm p-4`}>
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-white font-bold tracking-wider">
      DISASTER ANALYTICS
    </h3>

    <span className="text-xs opacity-60">
      LIVE DATA OVERVIEW
    </span>
  </div>

  <DisasterTrendChart />
  <RiskAssessment />
</section>

            {/* SECONDARY INTEL TABLE */}
            <section className={`${colors.panel} border ${colors.border} rounded-sm overflow-hidden`}>
               <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02] flex justify-between">
                  <span className="text-[9px] font-black tracking-widest uppercase opacity-40">Satellite_Imagery_Logs</span>
                  <span className="text-[9px] font-bold uppercase">{reports.length} ACTIVE_FRAMES</span>
               </div>
               <div className="max-h-[300px] overflow-y-auto">
                 <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-white/5">
                      {reports.map((r) => (
                        <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 w-16">
                            <div className={`h-10 w-14 border ${colors.border} bg-neutral-900 overflow-hidden`}>
                              {r.imageUrl && <img src={r.imageUrl} className="object-cover h-full w-full grayscale contrast-125" />}
                            </div>
                          </td>
                          <td className="p-4 font-bold text-white uppercase">{r.type}</td>
                          <td className="p-4 text-[9px] opacity-40 font-mono text-right">{r.timestamp?.seconds ? new Date(r.timestamp.seconds * 1000).toLocaleTimeString() : 'SYNC'}</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </section>
          </div>

          {/* RIGHT: SOS FEED & TELEMETRY */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            
            {/* PRIORITY SOS FEED */}
            <section className={`flex-grow border ${isPanic ? 'border-red-600 bg-red-600/5' : colors.border} rounded-sm overflow-hidden`}>
              <div className={`p-3 text-[10px] font-black tracking-widest ${isPanic ? 'bg-red-600 text-white' : 'bg-white/5 text-neutral-400'}`}>
                PRIORITY_SOS_INTERCEPT
              </div>
              <div className="p-4 space-y-4 max-h-[450px] overflow-y-auto">
                {alerts.length === 0 ? (
                    <p className="text-[10px] text-center opacity-20 py-10 tracking-widest uppercase italic">No active distress signals</p>
                ) : (
                    alerts.map(alert => (
                        <div key={alert.id} className={`p-3 border-l-2 ${isPanic ? 'border-red-600 bg-red-950/20' : 'border-white/20 bg-black/40'} space-y-2`}>
                            <div className="flex justify-between items-start">
                                <span className={`text-[11px] font-black ${isPanic ? 'text-red-500' : 'text-white'}`}>{alert.type || "DISTRESS"}</span>
                                <button onClick={() => deleteDoc(doc(db, "user_reports", alert.id))} className="text-[9px] hover:text-white transition-colors uppercase font-bold">Resolve</button>
                            </div>
                            <p className="text-[11px] leading-tight text-neutral-300 italic">"{alert.message}"</p>
                            <div className="text-[9px] opacity-40 font-mono">ID: {alert.phone || 'UNKNOWN'}</div>
                        </div>
                    ))
                )}
              </div>
            </section>

            {/* SYSTEM PERFORMANCE */}
            <div className={`p-6 border ${colors.border} rounded-sm`}>
               <h4 className="text-[10px] font-black tracking-widest mb-6 uppercase opacity-40">Telemetry</h4>
               <div className="space-y-4">
                  <div className="flex justify-between text-[9px] font-black uppercase"><span>CPU_LOAD</span><span>{isPanic ? '99%' : '34%'}</span></div>
                  <div className="h-[2px] bg-white/5 w-full"><div className={`h-full ${isPanic ? 'bg-red-600 animate-pulse' : 'bg-white'} transition-all`} style={{ width: isPanic ? '99%' : '34%' }} /></div>
                  
                  <div className="flex justify-between text-[9px] font-black uppercase"><span>UPSTREAM</span><span>{isPanic ? '0.2MB/S' : '45.1MB/S'}</span></div>
                  <div className="h-[2px] bg-white/5 w-full"><div className="h-full bg-emerald-500 transition-all" style={{ width: isPanic ? '5%' : '88%' }} /></div>
               </div>
            </div>

            <footer className="text-[9px] opacity-20 text-center uppercase tracking-widest py-4">
               Averra Intel-Core v4.2.0
            </footer>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
