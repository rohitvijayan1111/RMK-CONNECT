import React, { useCallback, useState } from "react";
import { PieChart, Pie, Cell, Tooltip,ResponsiveContainer, Legend} from "recharts";
import './StudentCountPieChart.css'
const data = [
  { name: "2nd Year", value: 125 },
  { name: "3rd Year", value: 83 },
  { name: "4th Year", value: 67 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" >
        <p>{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default function StudentCountPieChart() {
  return (
    <ResponsiveContainer width="100%" height="120%" className="container">
      <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={120}
        fill="#8884d8"
        dataKey="value"
        animationBegin={0}
        animationDuration={2800}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend/>
    </PieChart>
    </ResponsiveContainer>
    
  );
}
