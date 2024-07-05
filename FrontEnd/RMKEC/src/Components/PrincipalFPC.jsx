import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import "./PrincipalFPC.css";

const data = [
  { name: "IT", value: 35 },
  { name: "Cs", value: 81 },
  { name: "AD", value: 87 },
  { name: "Me", value: 17 },
  { name: "CB", value: 27 },
  { name: "CD", value: 37 },
  { name: "EI", value: 57 },
  { name: "CI", value: 54 },
  { name: "EEE",value: 37 },
  { name: "SH", value: 60},
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042","#77D8FF","#6EBE64","#F7D154","#B291E5","#FFA02D","#FF6666"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={15}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip-pfp">
        <div className="tooltip-value-pfp">
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="intro" style={{ color: entry.payload.fill }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
        </div>
      </div>
    );
  }
  return null;
};

const PrincipalFPC = () => (
  <ResponsiveContainer >
    <div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}}>
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
        animationDuration={1000}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend />
    </PieChart>      
    </div>

  </ResponsiveContainer>
);

export default PrincipalFPC;
