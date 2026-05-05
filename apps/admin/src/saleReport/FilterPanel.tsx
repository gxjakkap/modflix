import { useState } from "react";
import LovModal from "./LovModal";
import "./FilterPanel.css";
import type { LovProduct } from '../types';

interface FilterPanelProps {
  product: string
  setProduct: (value: string) => void
  dateFrom: string
  setDateFrom: (value: string) => void
  dateTo: string
  setDateTo: (value: string) => void
  status: string
  setStatus: (value: string) => void
  onApply: () => void
  onReset: () => void
}

export default function FilterPanel({
  product, setProduct,
  dateFrom, setDateFrom,
  dateTo, setDateTo,
  status, setStatus,
  onApply, onReset,
}: FilterPanelProps) {
  const [lovOpen, setLovOpen] = useState(false);

  const handleSelectProduct = (selectedArray: LovProduct[]) => {
    if (selectedArray && selectedArray.length > 0) {
      const count = selectedArray.length;
      let displayString = "";
      if (count <= 3) {
        displayString = selectedArray.map((item) => item.name).join(", ");
      } else {
        displayString = `${selectedArray[0].name}, ${selectedArray[1].name} and other ${count - 2} items`;
      }
      setProduct(displayString);
    } else {
      setProduct("");
    }
  };

  return (
    <>
      <section className="filter-panel">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Product</label>
            <div className="filter-input-wrap">
              <input className="filter-input" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Select Product" readOnly />
              <button className="lov-btn" onClick={() => setLovOpen(true)}>LoV</button>
            </div>
          </div>
          <div className="filter-group filter-group--date">
            <label className="filter-label">Date Range</label>
            <div className="date-row">
              <input type="date" className="filter-input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              <span className="date-sep">to</span>
              <input type="date" className="filter-input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="filter-row filter-row--status">
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <div className="select-wrap">
              <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>All</option><option>Paid</option><option>Pending</option><option>Cancelled</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>
        </div>
        <hr className="filter-divider" />
        <div className="filter-actions">
          <button className="btn-reset" onClick={onReset}>RESET</button>
          <button className="btn-apply" onClick={onApply}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Apply Filters
          </button>
        </div>
      </section>
      <LovModal open={lovOpen} onSelect={handleSelectProduct} onClose={() => setLovOpen(false)} />
    </>
  );
}