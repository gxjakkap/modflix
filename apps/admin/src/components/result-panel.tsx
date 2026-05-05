import SalesTable from "./sales-table";
import SalesChart from "./sales-chart";
import "./result-panel.css";
import type { SalesSummaryRow, SalesChartDataPoint, ChartSeries } from '../types';

const SERIES: ChartSeries[] = [
  { key: "Avatar1", label: "Avatar 1 (P01)", color: "#e8620a", total: 300 },
  { key: "Avatar2", label: "Avatar 2 (P02)", color: "#4a80c4", dash: true, total: 350 },
];

interface ResultPanelProps {
  tableData: SalesSummaryRow[]
  chartData: SalesChartDataPoint[]
  loading: boolean
  refreshing: boolean
  dateFrom: string
  dateTo: string
  onRefresh: () => void
  onBack: () => void
  onExport: () => void
}

export default function ResultPanel({
  tableData, chartData, loading, refreshing,
  dateFrom, dateTo, onRefresh, onBack, onExport,
}: ResultPanelProps) {
  return (
    <section className="result-panel">
      <div className="result-topbar">
        <button className={`btn-refresh ${refreshing ? "btn-refresh--spin" : ""}`} onClick={onRefresh} disabled={refreshing}>
          <svg className="refresh-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <SalesTable data={tableData} loading={loading} />
      <SalesChart data={chartData} dateFrom={dateFrom} dateTo={dateTo} series={SERIES} />
      <div className="result-actions">
        <button className="btn-back" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <button className="btn-export" onClick={onExport}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
          </svg>
          Export
        </button>
      </div>
    </section>
  );
}
