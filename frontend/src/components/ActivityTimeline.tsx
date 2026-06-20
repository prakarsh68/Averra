const ActivityTimeline = () => {
  const activities = [
    {
      time: "16:21",
      event: "Flood Alert Issued",
      location: "Chennai"
    },
    {
      time: "16:28",
      event: "Earthquake Detected",
      location: "Nepal"
    },
    {
      time: "16:34",
      event: "Emergency Request",
      location: "Delhi"
    },
    {
      time: "16:42",
      event: "Rescue Team Deployed",
      location: "Assam"
    }
  ];

  return (
    <div className="border border-white/10 rounded-sm p-4">
      <h3 className="text-amber-400 font-bold tracking-widest mb-4">
        LIVE ACTIVITY FEED
      </h3>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="border-l-2 border-amber-500 pl-4 py-2"
          >
            <div className="text-xs opacity-60">
              {activity.time}
            </div>

            <div className="text-white font-semibold">
              {activity.event}
            </div>

            <div className="text-sm opacity-70">
              {activity.location}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;