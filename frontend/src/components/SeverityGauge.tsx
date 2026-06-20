const SeverityGauge = () => {
  const risk = 82;

  return (
    <div className="border border-red-500/30 rounded-sm p-6 bg-gradient-to-br from-red-950/10 to-black">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-red-500 font-black tracking-widest uppercase">
          Threat Severity Index
        </h3>

        <span className="text-xs text-red-400 animate-pulse">
          LIVE
        </span>
      </div>

      <div className="flex justify-center">
        <div className="relative w-52 h-52">
          
          <div className="absolute inset-0 rounded-full border-[14px] border-neutral-800"></div>

          <div className="absolute inset-0 rounded-full border-[14px] border-red-500 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.6)]"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-black text-white">
              {risk}%
            </div>

            <div className="mt-2 text-red-500 font-bold tracking-widest">
              CRITICAL
            </div>

            <div className="mt-1 text-xs opacity-50">
              AI GENERATED
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8 text-center">
        <div>
          <p className="text-red-500 text-xl font-black">87</p>
          <p className="text-xs opacity-60">Alerts</p>
        </div>

        <div>
          <p className="text-yellow-500 text-xl font-black">34</p>
          <p className="text-xs opacity-60">Teams</p>
        </div>

        <div>
          <p className="text-cyan-500 text-xl font-black">12</p>
          <p className="text-xs opacity-60">Zones</p>
        </div>
      </div>
    </div>
  );
};

export default SeverityGauge;