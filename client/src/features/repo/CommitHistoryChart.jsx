import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CommitHistoryChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        
        <XAxis dataKey="week" />
<YAxis />
<Tooltip />
<Bar dataKey="total" fill="#8884d8" />

      </BarChart>
    </ResponsiveContainer>
  );
}
