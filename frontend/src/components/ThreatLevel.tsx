const ThreatLevel = () => {
  return (
    <div className="border border-red-500/30 bg-red-950/10 rounded-sm p-6 mb-6">
      <div className="flex justify-between items-center">
        <h3 className="text-red-500 font-black tracking-widest uppercase">
          Threat Level
        </h3>

        <div className="text-red-500 text-3xl font-black animate-pulse">
          🔴 CRITICAL
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <p className="text-3xl text-white font-bold">12</p>
          <p className="text-xs opacity-60">Affected Zones</p>
        </div>

        <div className="text-center">
          <p className="text-3xl text-white font-bold">34</p>
          <p className="text-xs opacity-60">Response Teams</p>
        </div>

        <div className="text-center">
          <p className="text-3xl text-white font-bold">87</p>
          <p className="text-xs opacity-60">Active Alerts</p>
        </div>
      </div>
    </div>
  );
};

export default ThreatLevel;