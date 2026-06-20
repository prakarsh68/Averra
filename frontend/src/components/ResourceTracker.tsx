const ResourceTracker = () => {
  const resources = [
    {
      name: "Ambulances",
      available: 42,
      deployed: 11,
      icon: "🚑",
    },
    {
      name: "Fire Units",
      available: 18,
      deployed: 4,
      icon: "🚒",
    },
    {
      name: "Helicopters",
      available: 6,
      deployed: 1,
      icon: "🚁",
    },
    {
      name: "Medical Teams",
      available: 23,
      deployed: 7,
      icon: "👨‍⚕️",
    },
  ];

  return (
    <div className="border border-emerald-500/20 bg-emerald-950/5 rounded-sm p-5">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-emerald-400 font-black tracking-widest uppercase">
          Resource Tracker
        </h3>

        <span className="text-xs text-emerald-400 animate-pulse">
          OPERATIONAL
        </span>
      </div>

      <div className="space-y-4">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="border border-white/5 rounded p-3"
          >
            <div className="flex justify-between items-center">
              <div className="font-semibold text-white">
                {resource.icon} {resource.name}
              </div>

              <div className="text-sm text-emerald-400">
                {resource.available - resource.deployed}/
                {resource.available}
              </div>
            </div>

            <div className="mt-2 h-2 bg-neutral-800 rounded">
              <div
                className="h-2 bg-emerald-500 rounded"
                style={{
                  width: `${
                    ((resource.available -
                      resource.deployed) /
                      resource.available) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceTracker;