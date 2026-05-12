import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import ReportPage from "./report-page";

const columns = [
  { key: "segment", label: "Users Segment" },
  { key: "views", label: "Views" },
  { key: "avgWatch", label: "Avg Watch Time" },
  { key: "completion", label: "Completion Rate" },
  { key: "dropoff", label: "Drop-off Rate" },
];

interface SegmentRow {
  segment: string;
  views: string;
  avgWatch: string;
  completion: string;
  dropoff: string;
}

interface Metric {
  label: string;
  value: string;
  sub: string;
  bars: number[];
  bg: string;
  color: string;
}

interface Genre {
  id: string;
  name: string;
}

interface UserBehaviorPageProps {
  pic?: string;
  username?: string;
}

export default function UserBehaviorPage({
  pic,
  username,
}: UserBehaviorPageProps) {
  const [duration, setDuration] = useState("0 - 30 min");
  const [category, setCategory] = useState("");
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [tableData, setTableData] = useState<SegmentRow[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    api.admin.genres.list.get({ query: { page: 1, limit: 1000 } }).then((res) => {
      if (res.status === 200 && res.data) {
        setGenres(res.data.data);
      }
    });
  }, []);

  const fetchData = useCallback(async () => {
    const res = await api.admin.reports["user-behavior"].get({
      query: {
        duration,
        category: category || undefined,
        dateRange,
      },
    });
    if (res.status === 200 && res.data) {
      setTableData(res.data.table);
      setMetrics(res.data.metrics as Metric[]);
    }
  }, [duration, category, dateRange]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ReportPage
      pic={pic}
      username={username}
      title="User Behavior"
      filterContent={
        <div>
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            <Sel
              label="Watch Duration"
              value={duration}
              onChange={setDuration}
              opts={["0 - 30 min", "30 - 60 min", "1h+"]}
            />
            <div>
              <p style={{ fontWeight: "700", marginBottom: "6px" }}>
                Content Category
              </p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "none",
                  minWidth: "150px",
                  fontSize: "14px",
                }}
              >
                <option value="">All</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            <Sel
              label="Date Range"
              value={dateRange}
              onChange={setDateRange}
              opts={["Last 7 Days", "Last 30 Days", "Last 3 Months"]}
            />
          </div>
        </div>
      }
      onReset={() => {
        setDuration("0 - 30 min");
        setCategory("");
        setDateRange("Last 7 Days");
      }}
      onApply={fetchData}
      columns={columns}
      tableData={tableData as unknown as Record<string, unknown>[]}
    >
      {metrics.length > 0 && (
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {metrics.map((m, i) => {
            const max = Math.max(...m.bars, 1);
            const min = Math.min(...m.bars);
            return (
              <div
                key={m.label}
                style={{
                  display: "flex",
                  gap: "24px",
                  alignItems: "center",
                  borderBottom:
                    i < metrics.length - 1 ? "1px solid #ddd" : "none",
                  paddingBottom: "24px",
                }}
              >
                <div style={{ minWidth: "180px" }}>
                  <p
                    style={{
                      fontWeight: "700",
                      fontSize: "16px",
                      margin: "0 0 4px",
                    }}
                  >
                    {m.label}
                  </p>
                  <p
                    style={{
                      fontSize: "40px",
                      fontWeight: "800",
                      color: "#e85d00",
                      margin: "0",
                    }}
                  >
                    {m.value}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#555",
                      margin: "4px 0 0",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {m.sub}
                  </p>
                </div>
                <div
                  style={{
                    flex: 1,
                    background: m.bg,
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "6px",
                    height: "80px",
                  }}
                >
                  {m.bars.map((v, j) => (
                    <div
                      key={j}
                      style={{
                        flex: 1,
                        height: `${max === min ? 50 : ((v - min) / (max - min)) * 100}%`,
                        minHeight: "4px",
                        background: m.color,
                        borderRadius: "3px 3px 0 0",
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ReportPage>
  );
}

interface SelProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  opts: string[];
}

function Sel({ label, value, onChange, opts }: SelProps) {
  return (
    <div>
      <p style={{ fontWeight: "700", marginBottom: "6px" }}>{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          border: "none",
          minWidth: "150px",
          fontSize: "14px",
        }}
      >
        {opts.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
