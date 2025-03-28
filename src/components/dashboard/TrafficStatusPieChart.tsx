
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface TrafficStatusData {
  smooth: number;
  moderate: number;
  heavy: number;
}

interface TrafficStatusPieChartProps {
  data: TrafficStatusData;
  isLoading?: boolean;
}

const TrafficStatusPieChart = ({ data, isLoading = false }: TrafficStatusPieChartProps) => {
  const chartData = [
    { name: "Smooth", value: data.smooth, color: "#4CAF50" },
    { name: "Moderate", value: data.moderate, color: "#FFC107" },
    { name: "Heavy", value: data.heavy, color: "#F44336" }
  ];

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
          <Tooltip formatter={(value) => [`${value} locations`, ""]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrafficStatusPieChart;
