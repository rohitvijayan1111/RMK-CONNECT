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

const data = [
  {
    name: "A",
    pv: 2400,
    amt: 2400,
  },
  {
    name: "B",
    pv: 1398,
    amt: 2210,
  },
  {
    name: "C",
    pv: 9800,
    amt: 2290,
  },
  {
    name: "D",
    pv: 3908,
    amt: 2000,
  },
  {
    name: "E",
    pv: 4800,
    amt: 2181,
  },
  {
    name: "F",
    pv: 3800,
    amt: 2500,
  },
  {
    name: "G",
    pv: 4300,
    amt: 2100,
  },
];
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

export default function LineCharts() {
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
        dataKey="pv"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
        animationBegin={0} animationDuration={1400}
      />
    </LineChart>    
    </ResponsiveContainer>
  );
}
