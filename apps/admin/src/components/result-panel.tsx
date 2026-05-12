import { useMemo } from "react";
import SalesTable from "./sales-table";
import SalesChart from "./sales-chart";
import "./result-panel.css";
import type {
  SalesSummaryRow,
  SalesChartDataPoint,
  ChartSeries,
} from "../types";

const COLORS = ["#e8620a", "#4a80c4", "#70AD47", "#FF4444", "#9B59B6", "#F39C12", "#1ABC9C"];

interface ResultPanelProps {
  tableData: SalesSummaryRow[];
  chartData: SalesChartDataPoint[];
  loading: boolean;
  refreshing: boolean;
  dateFrom: string;
  dateTo: string;
  onRefresh: () => void;
  onBack: () => void;
}

export default function ResultPanel({
  tableData,
  chartData,
  loading,
  refreshing,
  dateFrom,
  dateTo,
  onRefresh,
  onBack,
}: ResultPanelProps) {
  const series = useMemo<ChartSeries[]>(() => {
    if (!chartData.length) return [];
    return Object.keys(chartData[0])
      .filter((k) => k !== "date")
      .map((key, i) => ({
        key,
        label: key.replace(/_/g, " "),
        color: COLORS[i % COLORS.length],
      }));
  }, [chartData]);

  return (
    <section className="result-panel">
      <div className="result-topbar">
        <button
          className={`btn-refresh ${refreshing ? "btn-refresh--spin" : ""}`}
          onClick={onRefresh}
          disabled={refreshing}
        >
          <svg
            className="refresh-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <SalesTable data={tableData} loading={loading} />
      <SalesChart
        data={chartData}
        dateFrom={dateFrom}
        dateTo={dateTo}
        series={series}
      />
      <div className="result-actions">
        <button className="btn-back" onClick={onBack}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      </div>
    </section>
  );
}
