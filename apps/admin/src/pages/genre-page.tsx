import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import TempPage from "./temp-page";

const columns = [
  { key: "slug", label: "SLUG" },
  { key: "name", label: "NAME" },
];

interface GenrePageProps {
  pic?: string;
  username?: string;
}

interface Genre {
  id: string;
  name: string;
  slug: string;
}

export default function GenrePage({ pic, username }: GenrePageProps) {
  const [data, setData] = useState<Genre[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const PER_PAGE = 5;

  const fetchGenres = () => {
    api.admin.genres.list
      .get({ query: { search, limit: PER_PAGE, page } })
      .then((res) => {
        if (res.status !== 200 || !res.data) return;
        setData(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      });
  };

  useEffect(() => {
    fetchGenres();
  }, [search, page]);

  return (
    <TempPage
      pic={pic}
      username={username}
      title="Genres"
      columns={columns}
      data={data}
      showCreateButton={true}
      onCreate={() => navigate("/genres/create")}
      onEdit={(row) => navigate(`/genres/edit/${row.id}`)}
      search={search}
      setSearch={setSearch}
      currentPage={page}
      setPage={setPage}
      totalPages={totalPages}
      deleteButtonText={() => "Delete"}
      onDelete={(row) => {
        if (
          window.confirm(
            `Are you sure you want to delete the genre "${row.name}"?`,
          )
        ) {
          api.admin
            .genres({ id: row.id })
            .delete()
            .then((res) => {
              if (res.status !== 200) {
                window.alert(
                  `Error: [${res.error?.status}] ${res.error?.value}`,
                );
                return;
              }
              fetchGenres();
            });
        }
      }}
    />
  );
}
