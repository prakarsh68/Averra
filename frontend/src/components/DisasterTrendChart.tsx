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
          <XAxis dataKey="disaster" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="incidents" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
