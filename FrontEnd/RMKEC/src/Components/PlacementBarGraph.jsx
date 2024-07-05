
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './PlacementBarGraph.css'

const PlacementBarGraph = ({ Details }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width="100"
        height="150"
        data={Details}
        margin={{
          right: 30,
        }}
      >
        <CartesianGrid stroke="white" strokeDasharray="3 3" />
        <XAxis dataKey="status" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar type="monotone" dataKey="students" fill="#9CDBA6" barSize={40} animationBegin={0} animationDuration={2400}/>
      </BarChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload,}) => {
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

export default PlacementBarGraph;
