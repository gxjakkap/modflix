import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import ReportPage from "./report-page";

const columns = [
  { key: "genre", label: "Genre" },
  { key: "views", label: "Views" },
  { key: "purchase", label: "Total Purchase" },
];

interface PopularityRow {
  genre: string;
  views: number;
  purchase: number;
}

interface ChartPoint {
  month: string;
  [key: string]: string | number;
}

interface PopularityPageProps {
  pic?: string;
  username?: string;
}

export default function PopularityPage({ pic, username }: PopularityPageProps) {
  const [type, setType] = useState("Movie");
  const [sortBy, setSortBy] = useState("Genre");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tableData, setTableData] = useState<PopularityRow[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  const sortKeyMap: Record<string, string> = {
    Genre: "genre",
    Views: "views",
    "Total Purchase": "purchase",
  };

  const fetchData = useCallback(async () => {
    const res = await api.admin.reports.popularity.get({
      query: {
        type: type === "Movie" ? "MOVIE" : "SERIES",
        dateFrom: from || undefined,
        dateTo: to || undefined,
        sortBy: sortKeyMap[sortBy] ?? "genre",
      },
    });
    if (res.status === 200 && res.data) {
      setTableData(res.data.table);
      setChartData(res.data.chart as ChartPoint[]);
    }
  }, [type, from, to, sortBy]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleReset = () => {
    setType("Movie");
    setSortBy("Genre");
    setFrom("");
    setTo("");
  };

  const genreKeys = Array.from(new Set(chartData.flatMap((d) => Object.keys(d).filter((k) => k !== "month"))));

  const barColors = ["#4472C4", "#ED7D31", "#70AD47", "#FF4444", "#9B59B6", "#1ABC9C"];

  return (
    <ReportPage
      pic={pic}
      username={username}
      title="Popularity Metrics"
      filterContent={
        <div>
          <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
            <div>
              <p style={label}>Type</p>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={sel}
              >
                <option>Movie</option>
                <option>Series</option>
              </select>
            </div>
            <div>
              <p style={label}>Date Range</p>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  style={inp}
                />
                <span>to</span>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  style={inp}
                />
              </div>
            </div>
          </div>
          <div style={{ marginTop: "16px" }}>
            <p style={label}>Sort by</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={sel}
            >
              <option>Genre</option>
              <option>Views</option>
              <option>Total Purchase</option>
            </select>
          </div>
        </div>
      }
      onReset={handleReset}
      onApply={fetchData}
      columns={columns}
      tableData={tableData as unknown as Record<string, unknown>[]}
    >
      {chartData.length > 0 && (
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "16px",
            marginTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "24px",
              height: "120px",
            }}
          >
            {chartData.map((d) => {
              const max = Math.max(...genreKeys.map((k) => Number(d[k] ?? 0)), 1);
              return (
                <div
                  key={d.month}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "3px",
                      alignItems: "flex-end",
                      width: "100%",
                      height: "100px",
                    }}
                  >
                    {genreKeys.map((key, i) => (
                      <div
                        key={key}
                        style={{
                          flex: 1,
                          height: `${(Number(d[key] ?? 0) / max) * 100}%`,
                          minHeight: "2px",
                          background: barColors[i % barColors.length],
                          borderRadius: "3px 3px 0 0",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "11px", color: "#666" }}>{d.month}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "16px", marginTop: "12px", fontSize: "12px" }}>
            {genreKeys.map((key, i) => (
              <span key={key}>
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    background: barColors[i % barColors.length],
                    marginRight: "4px",
                    borderRadius: "2px",
                  }}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
            ))}
          </div>
        </div>
      )}
    </ReportPage>
  );
}

const label: React.CSSProperties = { fontWeight: "700", marginBottom: "6px" };
const sel: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "none",
  minWidth: "180px",
  fontSize: "14px",
};
const inp: React.CSSProperties = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  fontSize: "14px",
};
