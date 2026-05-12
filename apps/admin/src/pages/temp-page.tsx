import { useState } from "react";
import searchIcon from "../assets/search.png";
import Navbar from "../components/navbar";
import Pagination from "../components/pagination";
import type { Column } from "../types";
import styles from "./temp-page.module.css";

interface TempPageProps<T extends object> {
  pic?: string;
  username?: string;
  title?: string;
  columns?: Column[];
  data?: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onCreate?: () => void;
  deleteButtonText?: (row: T) => string;
  showCreateButton?: boolean;
  search?: string;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  currentPage?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  totalPages?: number;
}

export default function TempPage<T extends object>({
  pic,
  username = "Guest",
  title = "Template",
  columns = [],
  data = [],
  onEdit,
  onDelete,
  onCreate,
  showCreateButton,
  search = "",
  setSearch,
  currentPage = 1,
  setPage,
  totalPages = 1,
  deleteButtonText = (_row) => "Delete",
}: TempPageProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const arrow = (key: string) =>
    sortKey === key ? (sortAsc ? " ▲" : " ▼") : " ▲";

  return (
    <>
      <Navbar pic={pic} username={username} />
      <h1 className={styles.titleText}>{title}</h1>
      <div className={styles.reportContainer}>
        <div className={styles.topbar}>
          <div className={styles.searchBox}>
            <img src={searchIcon} className={styles.searchIcon} />
            <input
              type="search"
              placeholder="BY NAME, EMAIL"
              className={styles.searchbar}
              value={search}
              onChange={(e) => {
                setSearch?.(e.target.value);
                setPage?.(1);
              }}
            />
          </div>
          {showCreateButton && (
            <button className={styles.createBtn} onClick={onCreate}>
              + CREATE NEW
            </button>
          )}
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} onClick={() => handleSort(col.key)}>
                    {col.label}
                    {arrow(col.key)}
                  </th>
                ))}
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {columns.map((col, j) => (
                    <td
                      key={col.key}
                      className={j === 0 ? styles.codeCell : ""}
                    >
                      {String((row as Record<string, unknown>)[col.key])}
                    </td>
                  ))}
                  <td className={styles.actionCell}>
                    <button
                      className={styles.editBtn}
                      onClick={() => onEdit?.(row)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => onDelete?.(row)}
                    >
                      {deleteButtonText(row)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <Pagination
            current={currentPage}
            total={totalPages}
            onChange={(p) => setPage?.(p)}
          />
        )}
      </div>
    </>
  );
}
