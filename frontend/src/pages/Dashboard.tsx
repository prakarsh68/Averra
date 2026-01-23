import { useEffect, useState } from "react";

interface Disaster {
  id: string;
  type: string;
  severity: string;
  description: string;
  location: [number, number];
}

const Dashboard = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/disasters")
      .then(res => res.json())
      .then(data => setDisasters(data))
      .catch(err => console.error("Error loading dashboard:", err));
  }, []);

  const countBySeverity = (level: string) =>
    disasters.filter(d => d.severity === level).length;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📊 Admin Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 border rounded">
          <h4>Total Disasters</h4>
          <p className="text-2xl font-bold">{disasters.length}</p>
        </div>
        <div className="p-4 border rounded text-green-600">
          Low: {countBySeverity("low")}
        </div>
        <div className="p-4 border rounded text-orange-500">
          High: {countBySeverity("high")}
        </div>
        <div className="p-4 border rounded text-red-600">
          Critical: {countBySeverity("critical")}
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3">Disaster List</h3>
      <ul className="space-y-2">
        {disasters.map(d => (
          <li key={d.id} className="p-3 border rounded">
            <strong>{d.type.toUpperCase()}</strong> | {d.severity} | {d.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
