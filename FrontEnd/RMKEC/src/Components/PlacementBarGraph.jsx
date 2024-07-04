
import React from 'react';
import './PlacementBarGraph.css'
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


const Details = [
  {
    status: 'Placed',
    students: 83,

  },
  {
    status: 'Yet to be Placed',
    students: 20,

  },
  {
    status: 'HS',
    students: 25,

  },
];

const PlacementBarGraph = () => {
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
        <Bar type="monotone" dataKey="students" fill="#8b5cf6" barSize={50} animationBegin={0} animationDuration={2000}/>
      </BarChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-revenue">
          No. of Students: <span className="tooltip-value">{payload[0].value}</span>
        </p>
      </div>
    );
  }

  return null;
};

export default PlacementBarGraph;
