const MissionStatus = () => {
  return (
    <div className="border border-emerald-500/20 bg-emerald-950/5 rounded-sm p-5">

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-emerald-400 font-black tracking-widest uppercase">
          Mission Status
        </h3>

        <span className="text-xs text-emerald-400 animate-pulse">
          ONLINE
        </span>
      </div>

      <div className="space-y-3">

        <div className="flex justify-between">
          <span>SYSTEM HEALTH</span>
          <span className="text-emerald-400 font-bold">
            98%
          </span>
        </div>

        <div className="flex justify-between">
          <span>AI ENGINE</span>
          <span className="text-emerald-400 font-bold">
            ACTIVE
          </span>
        </div>

        <div className="flex justify-between">
          <span>SATELLITE FEED</span>
          <span className="text-cyan-400 font-bold">
            LIVE
          </span>
        </div>

        <div className="flex justify-between">
          <span>ALERT NETWORK</span>
          <span className="text-yellow-400 font-bold">
            OPERATIONAL
          </span>
        </div>

        <div className="flex justify-between">
          <span>RESPONSE GRID</span>
          <span className="text-red-400 font-bold">
            STANDBY
          </span>
        </div>

      </div>
    </div>
  );
};

export default MissionStatus;