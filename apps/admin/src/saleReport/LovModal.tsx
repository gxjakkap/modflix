import { useState, useEffect, useMemo } from "react";
import "./LovModal.css";
import type { LovProduct } from '../types';

interface FetchResult {
  total: number
  items: LovProduct[]
}

async function fetchProducts({ search, page, pageSize }: { search: string; page: number; pageSize: number }): Promise<FetchResult> {
  await new Promise((r) => setTimeout(r, 300));
  const ALL: LovProduct[] = [
    { code: "P01", name: "Avatar 1",  price: "100" },
    { code: "P02", name: "Avatar 2",  price: "200" },
    { code: "P03", name: "Avatar 3",  price: "300" },
    { code: "P04", name: "Avatar 4",  price: "100" },
    { code: "P05", name: "Avatar 5",  price: "100" },
    { code: "P06", name: "Avatar 6",  price: "100" },
    { code: "P07", name: "Avatar 7",  price: "100" },
    { code: "P08", name: "Avatar 8",  price: "100" },
    { code: "P09", name: "Avatar 9",  price: "100" },
    { code: "P10", name: "Avatar 10", price: "100" },
    { code: "P11", name: "Avatar 11", price: "100" },
    { code: "P12", name: "Avatar 12", price: "100" },
  ];
  const filtered = ALL.filter(
    (p) => p.code.toLowerCase().includes(search.toLowerCase()) || p.name.toLowerCase().includes(search.toLowerCase())
  );
  const start = (page - 1) * pageSize;
  return { total: filtered.length, items: filtered.slice(start, start + pageSize) };
}

const PAGE_SIZE_OPTIONS = [5, 10, 20];

interface LovModalProps {
  open: boolean
  onSelect: (selected: LovProduct[]) => void
  onClose: () => void
}

export default function LovModal({ open, onSelect, onClose }: LovModalProps) {
  const [search, setSearch]     = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [items, setItems]       = useState<LovProduct[]>([]);
  const [total, setTotal]       = useState(0);
  const [sortKey, setSortKey]   = useState<keyof LovProduct>("code");
  const [sortDir, setSortDir]   = useState<'asc' | 'desc'>("asc");
  const [selected, setSelected] = useState<Record<string, LovProduct>>({});

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const selectedCount = Object.keys(selected).length;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts({ search, page, pageSize });
        if (!cancelled) { setItems(data.items); setTotal(data.total); }
      } finally { if (!cancelled) setLoading(false); }
    };
    const timer = setTimeout(load, 200);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [open, search, page, pageSize]);

  useEffect(() => { setPage(1); }, [search, pageSize]);

  useEffect(() => {
    if (open) { setSearch(""); setPage(1); setPageSize(10); setSelected({}); }
  }, [open]);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      const dir = sortDir === "asc" ? 1 : -1;
      return va.localeCompare(vb) * dir;
    });
  }, [items, sortKey, sortDir]);

  const handleSort = (key: keyof LovProduct) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const toggleRow = (row: LovProduct) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[row.code]) delete next[row.code];
      else next[row.code] = row;
      return next;
    });
  };

  const isAllOnPageSelected = sorted.length > 0 && sorted.every((r) => selected[r.code]);

  const toggleAllOnPage = () => {
    setSelected((prev) => {
      const next = { ...prev };
      if (isAllOnPageSelected) sorted.forEach((r) => delete next[r.code]);
      else sorted.forEach((r) => { next[r.code] = r; });
      return next;
    });
  };

  const handleConfirm = () => {
    onSelect(Object.values(selected));
    onClose();
  };

  const selectedItems = Object.values(selected);

  let displayTitle = "Select Product";
  if (selectedCount > 0) {
    if (selectedCount <= 3) {
      displayTitle = selectedItems.map((item) => item.name).join(", ");
    } else {
      displayTitle = `${selectedItems[0].name}, ${selectedItems[1].name} and other ${selectedCount - 2} items`;
    }
  }

  if (!open) return null;

  return (
    <div className="lov-backdrop" onClick={onClose}>
      <div className="lov-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lov-header">
          <h2 className="lov-title" title={selectedItems.map((i) => i.name).join(", ")}>{displayTitle}</h2>
          <div className="lov-header-right">
            <div className="lov-search-wrap">
              <svg className="lov-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input className="lov-search" placeholder="Search code, name" value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
            </div>
            <div className="lov-pagesize-wrap">
              <select className="lov-pagesize" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                {PAGE_SIZE_OPTIONS.map((n) => (<option key={n} value={n}>{n} / page</option>))}
              </select>
              <svg className="lov-select-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="lov-selected-bar">
            <span className="lov-selected-count">{selectedCount} selected</span>
            <button className="lov-clear-btn" onClick={() => setSelected({})}>Clear all</button>
          </div>
        )}

        <div className="lov-table-wrap">
          <table className="lov-table">
            <colgroup>
              <col className="col-code" /><col className="col-name" /><col className="col-price" /><col className="col-check" />
            </colgroup>
            <thead>
              <tr>
                {([
                  { key: "code" as const,  label: "CODE" },
                  { key: "name" as const,  label: "NAME" },
                  { key: "price" as const, label: "PRICE" },
                ]).map(({ key, label }) => (
                  <th key={key} onClick={() => handleSort(key)}>
                    {label}<span className="th-sort">{sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : " ▲"}</span>
                  </th>
                ))}
                <th className="th-check">
                  <label className="select-all-label">
                    <span>Select all</span>
                    <input type="checkbox" className="lov-checkbox" checked={isAllOnPageSelected} onChange={toggleAllOnPage} />
                  </label>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="lov-loading"><span className="lov-spinner" /> Loading…</td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={4} className="lov-empty">No results found</td></tr>
              ) : (
                sorted.map((row) => {
                  const isChecked = !!selected[row.code];
                  return (
                    <tr key={row.code} className={isChecked ? "tr-selected" : ""} onClick={() => toggleRow(row)}>
                      <td className="td-code">{row.code}</td>
                      <td>{row.name}</td>
                      <td>{row.price}</td>
                      <td className="td-check" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="lov-checkbox" checked={isChecked} onChange={() => toggleRow(row)} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="lov-footer">
          <span className="lov-total">{total} products · Page {page} of {totalPages}</span>
          <div className="lov-pagination">
            <button className="pg-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
            <button className="pg-btn" onClick={() => setPage((p) => p-1)} disabled={page === 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | string)[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`e${i}`} className="pg-ellipsis">…</span>
                ) : (
                  <button key={p} className={`pg-btn ${p === page ? "pg-btn--active" : ""}`} onClick={() => setPage(p as number)}>
                    {p}
                  </button>
                )
              )}
            <button className="pg-btn" onClick={() => setPage((p) => p+1)} disabled={page === totalPages}>›</button>
            <button className="pg-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
          </div>
          <div className="lov-footer-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-confirm" onClick={handleConfirm} disabled={selectedCount === 0}>Confirm ({selectedCount})</button>
          </div>
        </div>
      </div>
    </div>
  );
}