import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export interface Disaster {
  id: string;
  type: string;
  severity: string;
  description: string;
  location?: string;
  date?: string;
}

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [disasters, setDisasters] = useState<Disaster[]>([]);

  useEffect(() => {
    const q = query(collection(db, "disasters"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Disaster[];
      setDisasters(data);
    });

    return () => unsub();
  }, []);

  const filteredDisasters = disasters.filter((d) =>
    d.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-8 font-sans">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2">
            <span className="text-amber-500">⚠</span> Intelligence Reports
          </h2>
          <p className="text-neutral-500 text-sm uppercase tracking-widest">
            Real-time Disaster Analysis & Severity Logs
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search reports (e.g., 'Fire', 'High')..."
            className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-4 top-3.5 text-neutral-600">🔍</div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDisasters.length > 0 ? (
          filteredDisasters.map((d) => (
            <ReportCard key={d.id} data={d} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-neutral-600">
            <p className="text-xl">No reports found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface ReportCardProps {
  data: Disaster;
}

const ReportCard = ({ data }: ReportCardProps) => {
  const { type, severity, description, location, date } = data;

  const getSeverityStyle = (sev: string) => {
    const level = sev.toLowerCase();
    if (level.includes("critical") || level.includes("destroy"))
      return "bg-red-900/30 text-red-400 border-red-800";
    if (level.includes("high"))
      return "bg-orange-900/30 text-orange-400 border-orange-800";
    return "bg-amber-900/20 text-amber-400 border-amber-800";
  };

  const getIcon = (t: string) => {
    const typeLower = t.toLowerCase();
    if (typeLower.includes("fire")) return "🔥";
    if (typeLower.includes("flood")) return "💧";
    if (typeLower.includes("quake")) return "📉";
    if (typeLower.includes("storm")) return "🌪";
    return "⚠";
  };

  return (
    <div className="group relative bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-amber-500/50 transition duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] flex flex-col justify-between">

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl bg-neutral-800 p-2 rounded-lg border border-neutral-700">
            {getIcon(type)}
          </span>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">{type}</h3>
            <span className="text-xs text-neutral-500 font-mono">
              ID: #{data.id.slice(0, 6)}
            </span>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-widest ${getSeverityStyle(severity)}`}>
          {severity}
        </span>
      </div>

      <div className="mb-6">
        <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
      </div>

      <div className="pt-4 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-500 font-mono">
        <div className="flex gap-4">
          <span>📍 {location || "Unknown"}</span>
          <span>🕒 {date || "Just Now"}</span>
        </div>

        <button className="text-amber-500 hover:text-amber-300 transition font-bold">
          VIEW DATA →
        </button>
      </div>
    </div>
  );
};

export default Reports;
