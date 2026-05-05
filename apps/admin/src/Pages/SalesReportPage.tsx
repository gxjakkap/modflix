import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../navbar/Navbar.tsx";
import FilterPanel from "../saleReport/FilterPanel.tsx";
import ResultPanel from "../saleReport/ResultPanel.tsx";
import type { SalesSummaryRow, SalesChartDataPoint } from '../types';

interface FetchParams {
  product: string
  dateFrom: string
  dateTo: string
  status: string
}

interface FetchResult {
  summary: SalesSummaryRow[]
  chartData: SalesChartDataPoint[]
}

async function fetchSalesData(_params: FetchParams): Promise<FetchResult> {
  await new Promise((r) => setTimeout(r, 700));
  return {
    summary: [
      { product: "P01", name: "Avatar 1", quantity: 300, revenue: 60000 },
      { product: "P02", name: "Avatar 2", quantity: 350, revenue: 70000 },
    ],
    chartData: [
      { date: "2025-01-01", Avatar1: 40, Avatar2: 50 },
      { date: "2025-01-08", Avatar1: 50, Avatar2: 60 },
      { date: "2025-01-15", Avatar1: 50, Avatar2: 70 },
      { date: "2025-01-22", Avatar1: 60, Avatar2: 70 },
      { date: "2025-02-01", Avatar1: 80, Avatar2: 80 },
      { date: "2025-02-08", Avatar1: 82, Avatar2: 85 },
      { date: "2025-02-15", Avatar1: 90, Avatar2: 88 },
      { date: "2025-02-22", Avatar1: 80, Avatar2: 80 },
      { date: "2025-03-01", Avatar1: 45, Avatar2: 60 },
    ],
  };
}

interface SalesReportPageProps {
  pic?: string
  username?: string
}

function SalesReportPage({ pic, username }: SalesReportPageProps) {
  const navigate = useNavigate();

   // Filter state
  const [product, setProduct] = useState("Select Product");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("Paid");
 
  // Data state
  const [tableData, setTableData] = useState<SalesSummaryRow[]>([]);
  const [chartData, setChartData] = useState<SalesChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
 
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
 
    try {
      const data = await fetchSalesData({ product, dateFrom, dateTo, status });
      setTableData(data.summary);
      setChartData(data.chartData);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [product, dateFrom, dateTo, status]);
 
  // Load on mount
  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line
 
  const handleReset = () => {
    setProduct("");
    setDateFrom("");
    setDateTo("");
    setStatus("Paid");
  };
 
  const handleExport = () => {
    // TODO: implement CSV/PDF export
    alert("Export triggered — implement as needed.");
  };

  return (
    <>
      <Navbar pic={pic} username={username} />
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "2rem",
        }}>
        </div>
      <main className="main" style={{marginBottom:'24px'}}>
        {/* Page header */}
        <header className="page-header" style={{ color: "white" }}>
          <div>
            <h1 style={{ color: 'white', marginLeft: '9%', marginTop: '-40px', fontSize: '40px',marginBottom: 0, }}>Sales Performance</h1>
            <p className="page-sub" style={{  color: '#D9D9D9', marginLeft: '9%', marginTop: 0, marginBottom: "24px" , fontSize: '20px',}}>revenue breakdown by product</p>
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
          onExport={handleExport}
        />
        
        
      </main>
    </>
  );
}

export default SalesReportPage;