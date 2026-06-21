type Props = {
  region: string;
};

const RiskInfoPanel = ({ region }: Props) => {
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
  84 / 100
</span>
        </p>

        <p>
  <span className="font-bold text-white">
    Flood Risk:
  </span>{" "}
  <span className="text-red-500 font-bold">
    HIGH
  </span>
</p>

        <p>
  <span className="font-bold text-white">
    Cyclone Risk:
  </span>{" "}
  <span className="text-yellow-500 font-bold">
    MEDIUM
  </span>
</p>

<p>
  <span className="font-bold text-white">
    Fire Risk:
  </span>{" "}
  <span className="text-green-500 font-bold">
    LOW
  </span>
</p>

        <p>
          <span className="font-bold text-white">
            Population Impact:
          </span>{" "}
          1.2M
        </p>

        <div className="pt-3 border-t border-white/10">
          <p className="font-bold text-white mb-2">
            Recommendations
          </p>

          <ul className="list-disc ml-5 text-sm">
            <li>Deploy emergency teams</li>
            <li>Increase monitoring</li>
            <li>Prepare evacuation routes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RiskInfoPanel;