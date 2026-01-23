import { disasters } from "../data/disasters";

const Reports = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Disaster Reports</h2>

      <ul>
        {disasters.map(d => (
          <li key={d.id}>
            {d.type.toUpperCase()} | Severity: {d.severity} | {d.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reports;
