import { useState, useEffect, useMemo } from "react";
import "./lov-modal.css";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export interface LovColumnDef<T> {
  key: keyof T;
  label: string;
}

export interface LovModalProps<T> {
  open: boolean;
  data: T[];
  columns: LovColumnDef<T>[];
  idKey: keyof T;
  displayKey: keyof T;
  title?: string;
  onSelect: (selected: T[]) => void;
  onClose: () => void;
}

export default function LovModal<T extends Record<string, any>>({
  open,
  data,
  columns,
  idKey,
  displayKey,
  title = "Select Item",
  onSelect,
  onClose,
}: LovModalProps<T>) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T>(columns[0]?.key || idKey);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Record<string, T>>({});

  // Client-side filtering
  const filtered = useMemo(() => {
    if (!search) return data;
    const lowerSearch = search.toLowerCase();
    return data.filter((item) =>
      columns.some((col) =>
        String(item[col.key] || "")
          .toLowerCase()
          .includes(lowerSearch),
      ),
    );
  }, [data, search, columns]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Client-side sorting
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const va = String(a[sortKey] || "");
      const vb = String(b[sortKey] || "");
      const dir = sortDir === "asc" ? 1 : -1;
      return va.localeCompare(vb) * dir;
    });
  }, [filtered, sortKey, sortDir]);

  // Client-side pagination
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const selectedCount = Object.keys(selected).length;

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  useEffect(() => {
    if (open) {
      setSearch("");
      setPage(1);
      setPageSize(10);
      setSelected({});
    }
  }, [open]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleRow = (row: T) => {
    setSelected((prev) => {
      const next = { ...prev };
      const id = String(row[idKey]);
      if (next[id]) delete next[id];
      else next[id] = row;
      return next;
    });
  };

  const isAllOnPageSelected =
    paginatedItems.length > 0 &&
    paginatedItems.every((r) => selected[String(r[idKey])]);

  const toggleAllOnPage = () => {
    setSelected((prev) => {
      const next = { ...prev };
      if (isAllOnPageSelected)
        paginatedItems.forEach((r) => delete next[String(r[idKey])]);
      else
        paginatedItems.forEach((r) => {
          next[String(r[idKey])] = r;
        });
      return next;
    });
  };

  const handleConfirm = () => {
    onSelect(Object.values(selected));
    onClose();
  };

  const selectedItems = Object.values(selected);

  let displayTitle = title;
  if (selectedCount > 0) {
    if (selectedCount <= 3) {
      displayTitle = selectedItems
        .map((item) => String(item[displayKey]))
        .join(", ");
    } else {
      displayTitle = `${String(selectedItems[0][displayKey])}, ${String(selectedItems[1][displayKey])} and other ${selectedCount - 2} items`;
    }
  }

  if (!open) return null;

  return (
    <div className="lov-backdrop" onClick={onClose}>
      <div className="lov-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lov-header">
          <h2
            className="lov-title"
            title={selectedItems.map((i) => String(i[displayKey])).join(", ")}
          >
            {displayTitle}
          </h2>
          <div className="lov-header-right">
            <div className="lov-search-wrap">
              <svg
                className="lov-search-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="lov-search"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="lov-pagesize-wrap">
              <select
                className="lov-pagesize"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
              <svg
                className="lov-select-arrow"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="lov-selected-bar">
            <span className="lov-selected-count">{selectedCount} selected</span>
            <button className="lov-clear-btn" onClick={() => setSelected({})}>
              Clear all
            </button>
          </div>
        )}

        <div className="lov-table-wrap">
          <table className="lov-table">
            <colgroup>
              {columns.map((col) => (
                <col key={String(col.key)} />
              ))}
              <col className="col-check" />
            </colgroup>
            <thead>
              <tr>
                {columns.map(({ key, label }) => (
                  <th key={String(key)} onClick={() => handleSort(key)}>
                    {label}
                    <span className="th-sort">
                      {sortKey === key
                        ? sortDir === "asc"
                          ? " ▲"
                          : " ▼"
                        : " ▲"}
                    </span>
                  </th>
                ))}
                <th className="th-check">
                  <label className="select-all-label">
                    <span>Select all</span>
                    <input
                      type="checkbox"
                      className="lov-checkbox"
                      checked={isAllOnPageSelected}
                      onChange={toggleAllOnPage}
                    />
                  </label>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="lov-empty">
                    No results found
                  </td>
                </tr>
              ) : (
                paginatedItems.map((row) => {
                  const rowId = String(row[idKey]);
                  const isChecked = !!selected[rowId];
                  return (
                    <tr
                      key={rowId}
                      className={isChecked ? "tr-selected" : ""}
                      onClick={() => toggleRow(row)}
                    >
                      {columns.map((col) => (
                        <td key={String(col.key)}>{String(row[col.key])}</td>
                      ))}
                      <td
                        className="td-check"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="lov-checkbox"
                          checked={isChecked}
                          onChange={() => toggleRow(row)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="lov-footer">
          <span className="lov-total">
            {total} items · Page {page} of {totalPages}
          </span>
          <div className="lov-pagination">
            <button
              className="pg-btn"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              «
            </button>
            <button
              className="pg-btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce<(number | string)[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                  acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`e${i}`} className="pg-ellipsis">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`pg-btn ${p === page ? "pg-btn--active" : ""}`}
                    onClick={() => setPage(p as number)}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              className="pg-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
            >
              ›
            </button>
            <button
              className="pg-btn"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              »
            </button>
          </div>
          <div className="lov-footer-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-confirm"
              onClick={handleConfirm}
              disabled={selectedCount === 0}
            >
              Confirm ({selectedCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
