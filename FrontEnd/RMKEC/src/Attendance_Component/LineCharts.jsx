import "./LineChart.css";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip-pbg">
        <p className="tooltip-value-pbg">
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="intro" style={{ color: entry.color }}>
            {`${entry.value}`}
          </p>
        ))}
        </p>
      </div>
    );
  }

  return null;
};

export default function LineCharts({data}) {
  return (
    <ResponsiveContainer>
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid stroke="white" strokeDasharray="3 3" />
      <XAxis dataKey="name"  />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Line
        type="monotone"
        dataKey="absent"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
        animationBegin={0} animationDuration={1400}
      />
    </LineChart>    
    </ResponsiveContainer>
  );
}
