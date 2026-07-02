type Props = {
  resources: {
    ambulances: number;
    fire_units: number;
    helicopters: number;
    medical_teams: number;
  };
};

const ResourceTracker = ({ resources }: Props) => {
  const resourceList = [
  {
    name: "Ambulances",
    total: 42,
    available: resources.ambulances,
    icon: "🚑",
  },
  {
    name: "Fire Units",
    total: 18,
    available: resources.fire_units,
    icon: "🚒",
  },
  {
    name: "Helicopters",
    total: 6,
    available: resources.helicopters,
    icon: "🚁",
  },
  {
    name: "Medical Teams",
    total: 23,
    available: resources.medical_teams,
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
        {resourceList.map((resource, index) => (
          <div
            key={index}
            className="border border-white/5 rounded p-3"
          >
            <div className="flex justify-between items-center">
              <div className="font-semibold text-white">
                {resource.icon} {resource.name}
              </div>

              <div className="text-sm text-emerald-400">
                {resource.available}/{resource.total}
              </div>
            </div>

            <div className="mt-2 h-2 bg-neutral-800 rounded">
              <div
                className="h-2 bg-emerald-500 rounded"
                style={{
                width: `${(resource.available / resource.total) * 100}%`,
              }}
              /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceTracker;