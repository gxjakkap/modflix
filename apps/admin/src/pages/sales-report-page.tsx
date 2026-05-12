import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/navbar";
import FilterPanel from "../components/filter-panel";
import ResultPanel from "../components/result-panel";
import { api } from "../lib/api";
import type { SalesSummaryRow, SalesChartDataPoint } from "../types";

interface SalesReportPageProps {
  pic?: string;
  username?: string;
}

function SalesReportPage({ pic, username }: SalesReportPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();

  // Filter state
  const [product, setProduct] = useState("Select Product");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("");

  // Data state
  const [tableData, setTableData] = useState<SalesSummaryRow[]>([]);
  const [chartData, setChartData] = useState<SalesChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const res = await api.admin.reports.sales.get({
          query: {
            product: product !== "Select Product" ? product : undefined,
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
            status: status || undefined,
          },
        });
        if (res.status === 200 && res.data) {
          setTableData(res.data.summary as SalesSummaryRow[]);
          setChartData(res.data.chart as SalesChartDataPoint[]);
        }
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [product, dateFrom, dateTo, status],
  );

  // Load on mount
  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line

  const handleReset = () => {
    setProduct("");
    setDateFrom("");
    setDateTo("");
    setStatus("");
  };

  return (
    <>
      <Navbar pic={pic} username={username} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "2rem",
        }}
      ></div>
      <main className="main" style={{ marginBottom: "24px" }}>
        {/* Page header */}
        <header className="page-header" style={{ color: "white" }}>
          <div>
            <h1
              style={{
                color: "white",
                marginLeft: "9%",
                marginTop: "-40px",
                fontSize: "40px",
                marginBottom: 0,
              }}
            >
              Sales Performance
            </h1>
            <p
              className="page-sub"
              style={{
                color: "#D9D9D9",
                marginLeft: "9%",
                marginTop: 0,
                marginBottom: "24px",
                fontSize: "20px",
              }}
            >
              revenue breakdown by product
            </p>
          </div>
        </header>

        {/* Filter section */}
        <FilterPanel
          product={product}
          setProduct={setProduct}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          status={status}
          setStatus={setStatus}
          onApply={() => loadData(false)}
          onReset={handleReset}
        />

        {/* Result section */}
        <ResultPanel
          tableData={tableData}
          chartData={chartData}
          loading={loading}
          refreshing={refreshing}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onRefresh={() => loadData(true)}
          onBack={() => window.history.back()}
        />
      </main>
    </>
  );
}

export default SalesReportPage;
