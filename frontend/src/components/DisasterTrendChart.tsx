import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Props = {
  terrainCounts: Record<string, number>;
};

export default function DisasterTrendChart({
  terrainCounts,
}: Props) {

  const data = Object.entries(terrainCounts || {}).map(
    ([terrain, count]) => ({
      disaster: terrain,
      incidents: count,
    })
  );

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
  <BarChart
    data={data}
    margin={{
      top: 20,
      right: 20,
      left: 10,
      bottom: 40,
    }}
    barCategoryGap="25%"
  >
    <CartesianGrid
      stroke="#222"
      strokeDasharray="3 3"
    />

    <XAxis
      dataKey="disaster"
      interval={0}
      angle={-15}
      textAnchor="end"
      tick={{
        fill: "#9ca3af",
        fontSize: 12,
      }}
    />

    <YAxis
      allowDecimals={false}
      tick={{
        fill: "#9ca3af",
      }}
    />

    <Tooltip
      cursor={{ fill: "#111827" }}
      contentStyle={{
        background: "#111827",
        border: "1px solid #f59e0b",
        color: "#fff",
      }}
    />

    <Bar
      dataKey="incidents"
      fill="#f59e0b"
      radius={[6, 6, 0, 0]}
      maxBarSize={40}
    />
  </BarChart>
</ResponsiveContainer>
    </div>
  );
}