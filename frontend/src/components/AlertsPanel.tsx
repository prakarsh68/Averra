import { useEffect, useState } from "react";

interface Alert {
  id: string;
  message: string;
  severity: string;
}

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/alerts")
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error("Error loading alerts:", err));
  }, []);

  const getColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600";
      case "high": return "text-orange-500";
      case "medium": return "text-yellow-500";
      default: return "text-green-500";
    }
  };

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="font-bold mb-2">🚨 Live Alerts</h3>
      {alerts.map(alert => (
        <div key={alert.id} className={`mb-2 ${getColor(alert.severity)}`}>
          {alert.message}
        </div>
      ))}
    </div>
  );
};

export default AlertsPanel;
