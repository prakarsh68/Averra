import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../firebase";

interface Alert {
  id: string;
  type: string;
  description: string;
  severity: string;
  timestamp: any;
}

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to the latest 5 reports from 'user_reports'
    const q = query(
      collection(db, "user_reports"), 
      orderBy("timestamp", "desc"), 
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedAlerts = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type || "Unknown",
          description: data.description || "No details provided.",
          // If verified, mark as Critical, otherwise Warning
          severity: data.verified ? "critical" : "warning", 
          timestamp: data.timestamp
        };
      });
      
      setAlerts(fetchedAlerts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getColor = (severity: string) => {
    switch (severity) {
      case "critical": return "border-l-4 border-red-600 bg-red-900/10 text-red-400";
      case "warning": return "border-l-4 border-amber-500 bg-amber-900/10 text-amber-400";
      default: return "border-l-4 border-green-500 bg-green-900/10 text-green-400";
    }
  };

  return (
    <div className="h-full bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex justify-between items-center">
        <h3 className="font-bold text-white flex items-center gap-2">
           <span className="animate-pulse text-red-500">🚨</span> Live Feed
        </h3>
        <span className="text-[10px] uppercase font-mono text-neutral-500">Real-time</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {loading ? (
           <div className="text-center text-xs text-neutral-500 py-4">Syncing with satellite...</div>
        ) : alerts.length === 0 ? (
           <div className="text-center text-xs text-neutral-600 py-4">No active threats detected.</div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={`p-3 rounded text-sm ${getColor(alert.severity)}`}>
              <div className="flex justify-between items-start mb-1">
                 <span className="font-bold uppercase tracking-wider text-xs">{alert.type}</span>
                 <span className="text-[10px] opacity-70 font-mono">
                    {alert.timestamp?.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </span>
              </div>
              <p className="text-xs opacity-90 truncate">{alert.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;