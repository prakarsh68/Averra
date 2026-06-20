import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { disaster: "Flood", incidents: 45 },
  { disaster: "Cyclone", incidents: 32 },
  { disaster: "Earthquake", incidents: 18 },
  { disaster: "Wildfire", incidents: 12 },
];

export default function DisasterTrendChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="disaster" stroke="#9ca3af" />
<YAxis stroke="#9ca3af" />
          <Tooltip
  contentStyle={{
    background: "#111827",
    border: "1px solid #f59e0b",
    color: "white",
  }}
/>
          <Bar
  dataKey="incidents"
  fill="#f59e0b"
  radius={[4, 4, 0, 0]}
/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
