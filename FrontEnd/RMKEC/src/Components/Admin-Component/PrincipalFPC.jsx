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
    const { name, PG_Staff, Pursuing_PG, Asst_Prof, Non_Technical } = payload[0].payload;
    return (
      <div className="custom-tooltip-pfp">
        <div className="tooltip-value-pfp">
          <p style={{ color: payload[0].fill }}>{name}</p>
          <p style={{ color: payload[0].fill }}>PG Staff: {PG_Staff}</p>
          <p style={{ color: payload[0].fill }}>Pursuing PG: {Pursuing_PG}</p>
          <p style={{ color: payload[0].fill }}>Asst Prof: {Asst_Prof}</p>
          <p style={{ color: payload[0].fill }}>Non Technical: {Non_Technical}</p>
        </div>
      </div>
    );
  }
  return null;
};

const PrincipalFPC = ({data}) => (
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
