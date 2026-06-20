import LiveClock from "./LiveClock";

const CommandHeader = ({
  alertsCount,
  reportsCount,
}: {
  alertsCount: number;
  reportsCount: number;
}) => {
  return (
    <div className="mb-6 border border-amber-500/20 bg-gradient-to-r from-black via-amber-950/10 to-black rounded-sm p-6">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-black tracking-widest text-white">
            AVERRA COMMAND CENTER
          </h1>

          <p className="text-xs text-amber-500 mt-2 tracking-[0.3em] uppercase">
            Disaster Intelligence Network
          </p>
        </div>

        <LiveClock />
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">

        <div className="border border-red-500/20 p-3 rounded-sm">
          <p className="text-xs opacity-60 uppercase">Status</p>
          <p className="text-red-500 font-black mt-1 animate-pulse">
            🔴 Critical
          </p>
        </div>

        <div className="border border-cyan-500/20 p-3 rounded-sm">
          <p className="text-xs opacity-60 uppercase">
            Satellites Online
          </p>
          <p className="text-cyan-400 font-black mt-1">
            14
          </p>
        </div>

        <div className="border border-yellow-500/20 p-3 rounded-sm">
          <p className="text-xs opacity-60 uppercase">
            Active Alerts
          </p>
         <p className="text-yellow-400 font-black mt-1">
  {alertsCount}
</p>
        </div>

        <div className="border border-emerald-500/20 p-3 rounded-sm">
          <p className="text-xs opacity-60 uppercase">
            Response Teams
          </p>
          <p className="text-emerald-400 font-black mt-1">
  {reportsCount}
</p>
        </div>

      </div>
    </div>
  );
};

export default CommandHeader;