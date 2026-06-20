const AIPrediction = () => {
  return (
    <div className="border border-purple-500/30 bg-purple-500/5 rounded-sm p-5">

      <div className="flex justify-between mb-4">
        <h3 className="text-purple-400 font-bold tracking-widest">
          AI PREDICTION ENGINE
        </h3>

        <span className="text-xs text-purple-300">
          NEXT 72 HOURS
        </span>
      </div>

      <div className="space-y-3">

        <div className="border border-red-500/20 p-3 rounded-sm">
          <div className="flex justify-between">
            <span>Chennai Flood Probability</span>
            <span className="text-red-400 font-bold">
              82%
            </span>
          </div>
        </div>

        <div className="border border-yellow-500/20 p-3 rounded-sm">
          <div className="flex justify-between">
            <span>Odisha Cyclone Activity</span>
            <span className="text-yellow-400 font-bold">
              64%
            </span>
          </div>
        </div>

        <div className="border border-cyan-500/20 p-3 rounded-sm">
          <div className="flex justify-between">
            <span>Assam River Overflow</span>
            <span className="text-cyan-400 font-bold">
              71%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIPrediction;