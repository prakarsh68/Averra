export default function RiskAssessment() {
  return (
    <div className="border border-red-500/20 p-4 rounded-sm">
      <h3 className="text-red-400 font-bold mb-4">
        RISK ASSESSMENT
      </h3>

      <div className="space-y-2 text-sm">
        <div>Flood Risk: 82%</div>
        <div>Earthquake Risk: 41%</div>
        <div>Cyclone Risk: 68%</div>
      </div>
    </div>
  );
}