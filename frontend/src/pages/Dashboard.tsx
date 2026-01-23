import React, { useEffect, useState } from "react";

interface Disaster {
  id: string;
  type: string;
  severity: string;
  description: string;
  location: [number, number];
  timestamp?: string; // Added for the list view
}

const Dashboard = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());

  // Simulation of fetching data
  const fetchData = () => {
    fetch("http://127.0.0.1:8000/disasters")
      .then((res) => res.json())
      .then((data) => {
        setDisasters(data);
        setLoading(false);
        setLastUpdated(new Date().toLocaleTimeString());
      })
      .catch((err) => {
        console.error("Error loading dashboard:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const countBySeverity = (level: string) =>
    disasters.filter((d) => d.severity.toLowerCase() === level.toLowerCase()).length;

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-8 font-sans">
      
      {/* --- Header --- */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-end border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            📊 Mission Control
          </h2>
          <p className="text-neutral-500 text-sm uppercase tracking-widest mt-1">
            Global Situational Awareness
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM ONLINE
          </div>
          <div>LAST SYNC: {lastUpdated}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* --- KPI HUD --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            label="Total Incidents" 
            value={disasters.length} 
            color="border-neutral-700 text-white" 
            icon="🌐"
          />
          <StatCard 
            label="Critical Threats" 
            value={countBySeverity("critical")} 
            color="border-red-900/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
            icon="🚨"
          />
          <StatCard 
            label="High Priority" 
            value={countBySeverity("high")} 
            color="border-orange-900/50 text-orange-500" 
            icon="⚠"
          />
          <StatCard 
            label="Low Priority" 
            value={countBySeverity("low")} 
            color="border-emerald-900/50 text-emerald-500" 
            icon="🛡"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* --- Main Feed (Table) --- */}
            <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <span className="text-amber-500">📡</span> Live Incident Feed
                    </h3>
                    <button onClick={fetchData} className="text-xs text-amber-500 hover:text-amber-400 uppercase font-bold">
                        Refresh Data
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-neutral-500 uppercase bg-neutral-950 border-b border-neutral-800">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Severity</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-neutral-500 animate-pulse">
                                        Acquiring satellite feed...
                                    </td>
                                </tr>
                            ) : disasters.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                                        No active incidents reported.
                                    </td>
                                </tr>
                            ) : (
                                disasters.map((d) => (
                                    <tr key={d.id} className="hover:bg-neutral-800/50 transition duration-150">
                                        <td className="px-6 py-4 font-mono text-neutral-400">#{d.id}</td>
                                        <td className="px-6 py-4 font-bold text-white">{d.type.toUpperCase()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${getSeverityBadge(d.severity)}`}>
                                                {d.severity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-emerald-500 font-mono text-xs">
                                            ACTIVE
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Side Panel: Activity Graph (Visual Only) --- */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col">
                <h3 className="font-bold text-white mb-6">Activity Volume</h3>
                
                {/* Simulated Bar Chart */}
                <div className="flex items-end justify-between h-40 gap-2 mb-4">
                    {[40, 70, 30, 85, 50, 65, 90].map((h, i) => (
                        <div key={i} className="w-full bg-neutral-800 rounded-t hover:bg-amber-600 transition-colors duration-300 relative group">
                             <div 
                                style={{ height: `${h}%` }} 
                                className={`w-full absolute bottom-0 rounded-t ${h > 80 ? 'bg-red-500' : 'bg-amber-500'}`}
                             ></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-neutral-500 font-mono uppercase">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-800">
                     <h4 className="text-xs text-neutral-400 uppercase mb-2">System Resources</h4>
                     <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-neutral-500">AI MODEL LOAD</span>
                                <span className="text-emerald-500">32%</span>
                            </div>
                            <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-1/3"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-neutral-500">BANDWIDTH</span>
                                <span className="text-amber-500">68%</span>
                            </div>
                            <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 w-2/3"></div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ label, value, color, icon }: { label: string, value: number, color: string, icon: string }) => (
  <div className={`p-6 bg-neutral-900 border rounded-xl flex items-center justify-between ${color}`}>
    <div>
        <h4 className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-1">{label}</h4>
        <p className="text-3xl font-extrabold">{value}</p>
    </div>
    <div className="text-4xl opacity-20 grayscale grayscale-0 transition">
        {icon}
    </div>
  </div>
);

const getSeverityBadge = (s: string) => {
    const sev = s.toLowerCase();
    if (sev === 'critical') return 'bg-red-900/20 text-red-500 border-red-900';
    if (sev === 'high') return 'bg-orange-900/20 text-orange-500 border-orange-900';
    return 'bg-emerald-900/20 text-emerald-500 border-emerald-900';
};

export default Dashboard;