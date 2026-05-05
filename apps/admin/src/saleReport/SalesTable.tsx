import { useState } from "react";
import "./SalesTable.css";
import type { SalesSummaryRow } from '../types';

interface SalesTableProps {
  data: SalesSummaryRow[]
  loading: boolean
}

export default function SalesTable({ data, loading }: SalesTableProps) {
  const [sortKey, setSortKey] = useState<keyof SalesSummaryRow | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>("asc");

  const handleSort = (key: keyof SalesSummaryRow) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const va = a[sortKey], vb = b[sortKey];
    const dir = sortDir === "asc" ? 1 : -1;
    return typeof va === "string" ? va.localeCompare(vb as string) * dir : ((va as number) - (vb as number)) * dir;
  });

  return (
    <div className="sales-table-wrap">
      {loading ? (
        <div className="table-loading">
          <span className="spinner" />
          Loading…
        </div>
      ) : (
        <table className="sales-table">
          <thead>
            <tr>
              {([
                { key: "product" as const, label: "Product" },
                { key: "name" as const, label: "NAME" },
                { key: "quantity" as const, label: "Quantity" },
                { key: "revenue" as const, label: "Total Revenue" },
              ]).map(({ key, label }) => (
                <th key={key} onClick={() => handleSort(key)} className={key === "revenue" ? "align-right" : ""}>
                  {label}
                  <span className="sort-icon">
                    {sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : " ▲"}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.product}>
                <td className="cell-id">{row.product}</td>
                <td>{row.name}</td>
                <td className="cell-qty">{row.quantity.toLocaleString()}</td>
                <td className="cell-rev">{row.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}