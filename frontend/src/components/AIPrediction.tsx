const AIPrediction = () => {
    const predictions = [
  {
    disaster: "Flood",
    probability: 87,
    region: "Chennai",
    timeframe: "Next 24 Hours",
  },
  {
    disaster: "Cyclone",
    probability: 72,
    region: "Odisha Coast",
    timeframe: "48 Hours",
  },
  {
    disaster: "Heatwave",
    probability: 65,
    region: "Rajasthan",
    timeframe: "3 Days",
  },
];
  return (
  <div className="border border-fuchsia-500/30 bg-fuchsia-500/5 rounded-sm p-5">

    <div className="flex justify-between mb-4">
      <h3 className="text-fuchsia-400 font-bold tracking-widest">
        AI RISK FORECAST
      </h3>

      <span className="text-xs text-fuchsia-300">
        NEXT 72 HOURS
      </span>
    </div>

    <div className="space-y-3">
      {predictions.map((p, index) => (
        <div
          key={index}
          className="border border-fuchsia-500/20 p-3 rounded-sm"
        >
          <div className="flex justify-between">
            <span>{p.disaster}</span>
            <span className="text-fuchsia-400 font-bold">
              {p.probability}%
            </span>
          </div>

          <div className="text-xs opacity-70 mt-1">
            {p.region}
          </div>

          <div className="w-full h-2 bg-black mt-2 rounded">
            <div
              className="h-2 bg-fuchsia-500 rounded"
              style={{ width: `${p.probability}%` }}
            />
          </div>

          <div className="text-xs text-gray-400 mt-2">
            {p.timeframe}
          </div>
        </div>
      ))}
    </div>

  </div>
);
}

export default AIPrediction;