import React from "react";
import Loading from "../../componenets/Loading";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

// Utility for week end date: add 6 days to start date
function getEndDate(startDateStr) {
  const start = new Date(startDateStr);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
}
// Format: "Aug 1"
function formatShortDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
// Tooltip shows "<Month Day> – <Month Day>" range
function CommitTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const { week, total } = payload[0].payload;
    const endDate = getEndDate(week);
    const range = `${formatShortDate(week)} – ${formatShortDate(endDate)}`;
    return (
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "none",
          borderRadius: "var(--radius)",
          color: "var(--text-primary)",
          fontSize: "1rem",
          boxShadow: "var(--shadow)",
          minWidth: 120,
          padding: "10px 18px",
          lineHeight: 1.6,
        }}
      >
        <div style={{ color: "var(--primary)", fontWeight: 600 }}>
          {range}
        </div>
        <div>
          <span style={{ color: "var(--text-secondary)" }}>Commits:</span> {total}
        </div>
      </div>
    );
  }
  return null;
}

export default function CommitHistoryChart({ data = [], isLoading, isError }) {
  // Check if data has any commits
   if (isLoading || !data) {
    return <Loading />;
  }

if (isError) {
    return (
      <div style={{
        height: 200, width: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg-tertiary)", color: "var(--text-muted)",
        borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)",
        fontSize: "1.1rem"
      }}>
        Unable to fetch commit history.
      </div>
    );
  }

  const hasCommits =
    data.length > 0 && data.some((item) => (item.total ?? 0) > 0);

  if (!hasCommits) {
    return (
      <div
        style={{
          height: 200,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-tertiary)",
          color: "var(--text-muted)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          fontSize: "1.1rem",
        }}
      >
        No commits in the past year.
      </div>
    );
  }

  // Precalculate week index: left most is 1
  const chartData = data.map((item, idx) => ({
    ...item,
    weekIdx: idx + 1,
  }));
  // Find max Y for "nicely" spaced ticks
  const maxY = Math.max(...data.map(d => d.total ?? 0));
  // Round up to next multiple of 5 for Y axis domain
  const yMax = Math.ceil((maxY + 1) / 5) * 5;
  // X axis ticks: show all week numbers from 1 to N
  const xTicks = chartData.map(d => d.weekIdx);

  return (
    <div style={{ width: "100%" }}>
      <h3
        style={{
          color: "var(--text-primary)",
          fontWeight: 600,
          fontSize: "1.22rem",
          margin: "0 0 16px 0",
          letterSpacing: "0.01em",
        }}
      >
        Weekly Commits in the Past Year
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 32, right: 20, left: 32, bottom: 64 }}
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <XAxis
            dataKey="weekIdx"
            ticks={xTicks}
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={{ stroke: "var(--border)" }}
            interval={0}
          >
            <Label
              value="Week"
              offset={16} // less space between label and axis
              position="bottom"
              style={{
                fill: "var(--text-secondary)",
                fontSize: "1.05rem",
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            />
          </XAxis>
          <YAxis
            domain={[0, yMax]}
            tickCount={Math.floor(yMax / 5) + 1}
            interval="preserveEnd"
            tickFormatter={v => v}
            ticks={Array.from({ length: yMax / 5 + 1 }, (_, i) => i * 5)}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={{ stroke: "var(--border)" }}
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          >
            <Label
              value="Commits"
              angle={-90}
              position="center"
              dx={-26} // moves label left toward y axis edge
              style={{
                fill: "var(--text-secondary)",
                fontSize: "1.05rem",
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            />
          </YAxis>
          <Tooltip
            content={<CommitTooltip />}
            cursor={{ fill: "var(--primary-light)", opacity: 0.09 }}
          />
          <Bar
            dataKey="total"
            fill="var(--primary)"
            radius={[4, 4, 0, 0]}
            barSize={20}
            activeBar={{ fill: "var(--primary-hover)" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

