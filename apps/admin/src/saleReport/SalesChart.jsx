import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./SalesChart.css";

// Custom tooltip popup
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="tooltip-val">
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function SalesChart({ data, dateFrom, dateTo, series }) {
  // series = [{ key, label, color, dash? }, ...]

  const title = `Sales Quantity Comparison: ${series.map((s) => s.label).join(" vs ")}`;
  const subtitle =
    dateFrom && dateTo
      ? `${dateFrom} – ${dateTo}`
      : "1 Jan 2568 – 1 Mar 2568";

  return (
    <div className="sales-chart">
      <div className="chart-header">
        <p className="chart-title">{title}</p>
        <p className="chart-subtitle">{subtitle}</p>
      </div>

      {/* Custom legend */}
      <div className="chart-legend">
        {series.map((s) => (
          <span key={s.key} className="legend-item">
            <span
              className="legend-line"
              style={{
                background: s.color,
                borderTop: s.dash ? `2px dashed ${s.color}` : undefined,
                height: s.dash ? "0" : "3px",
              }}
            />
            {s.label}
            {s.total !== undefined && (
              <span className="legend-total"> — Total {s.total}</span>
            )}
          </span>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 24, left: -10, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0dcc8" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#888" }}
            tickFormatter={(v) => v.slice(5)}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#888" }}
            domain={[30, 100]}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray={s.dash ? "6 3" : undefined}
              dot={{ r: 4, fill: s.color, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}