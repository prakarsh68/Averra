type Props = {
  region: string;
  disasterStats: any[];
  riskLevel: string;
  confidence: number;
  latestDamage: string;
};

const RiskInfoPanel = ({
  region,
  disasterStats,
  riskLevel,
  confidence,
  latestDamage,
}: Props) => {
  return (
    <div className="border border-cyan-500/20 bg-cyan-950/5 rounded-sm p-5">
      <h3 className="text-cyan-400 font-black tracking-widest uppercase mb-4">
        Regional Intelligence
      </h3>

      <div className="space-y-3">
        <p>
          <span className="font-bold text-white">
            Region:
          </span>{" "}
          {region}
        </p>

        <p>
          <span className="font-bold text-white">
            Risk Score:
          </span>{" "}
          <span className="text-red-500 font-bold">
 {confidence.toFixed(2)} / 100
</span>
        </p>

        <p>
  <span className="font-bold text-white">
    Flood Risk:
  </span>{" "}
  <span className="text-red-500 font-bold">
   {riskLevel.toUpperCase()}
  </span>
</p>

        <p>
  <span className="font-bold text-white">
    Cyclone Risk:
  </span>{" "}
  <span className="text-yellow-500 font-bold">
    {riskLevel === "Flood" ? "LOW" : "MEDIUM"}
  </span>
</p>

<p>
  <span className="font-bold text-white">
    Fire Risk:
  </span>{" "}
  <span className="text-green-500 font-bold">
    {latestDamage === "Destroyed" ? "HIGH" : "LOW"}
  </span>
</p>

        <p>
          <span className="font-bold text-white">
            Population Impact:
          </span>{" "}
          {Math.floor(confidence * 12000).toLocaleString()}
        </p>

        <div className="pt-3 border-t border-white/10">
          <p className="font-bold text-white mb-2">
            Recommendations
          </p>

          <div className="pt-4 border-t border-white/10">
  <p className="font-bold text-white mb-2">
    Disaster Distribution
  </p>

  {disasterStats.map((d, i) => (
    <div
      key={i}
      className="flex justify-between text-sm mb-1"
    >
      <span>{d.name}</span>
      <span>{d.count}</span>
    </div>
  ))}
</div>

          <ul className="list-disc ml-5 text-sm">
            <li>
  {riskLevel === "Flood"
    ? "Deploy flood response teams"
    : "Deploy emergency response teams"}
</li>

<li>
  {latestDamage === "Destroyed"
    ? "Immediate evacuation recommended"
    : "Increase monitoring"}
</li>

<li>
  {confidence > 80
    ? "Prepare evacuation routes"
    : "Continue surveillance"}
</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RiskInfoPanel;