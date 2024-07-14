
import React from "react";
import './PrincipalBC.css'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


function PrincipalBC({data}) {
  console.log(data);
  return (
    <>
    <ResponsiveContainer>
    <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid stroke="white" strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip content={<CustomTooltip />}/>
        <Legend />
        <Bar dataKey="Placed" barSize={15} stackId="a" fill="#82ca9d" animationDuration={1500}/>
        <Bar dataKey="NotPlaced" stackId="a" fill="#8884d8" animationDuration={1500} />
        <Bar dataKey="HS" stackId="a" fill="pink" animationDuration={1500}/>
      </BarChart>
    </ResponsiveContainer>
      
    </>
  );
}
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip-pbc">
          <p className="tooltip-value-pbc">
          {payload.map((entry, index) => (
          <p key={`item-${index}`} className="intro" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
          </p>
        </div>
      );
    }
  
    return null;
  };

  export default PrincipalBC;
