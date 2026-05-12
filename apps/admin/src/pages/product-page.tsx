import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import TempPage from "./temp-page";

const columns = [
  { key: "name", label: "NAME" },
  { key: "price", label: "PRICE" },
  { key: "type", label: "TYPE" },
];

interface ProductPageProps {
  pic?: string;
  username?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  type: string;
  price: string | null;
}

export default function ProductPage({ pic, username }: ProductPageProps) {
  const [data, setData] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const PER_PAGE = 5;

  const fetchProducts = () => {
    api.admin.products.list
      .get({ query: { search, limit: PER_PAGE, page } })
      .then((res) => {
        if (res.status !== 200 || !res.data) return;
        setData(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  return (
    <TempPage
      pic={pic}
      username={username}
      title="Products"
      columns={columns}
      data={data}
      showCreateButton={true}
      onCreate={() => navigate("/products/create")}
      onEdit={(row) => navigate(`/products/edit/${row.id}`)}
      search={search}
      setSearch={setSearch}
      currentPage={page}
      setPage={setPage}
      totalPages={totalPages}
      deleteButtonText={() => "Delete"}
      onDelete={(row) => {
        if (
          window.confirm(
            `Are you sure you want to delete the product "${row.name}"?`,
          )
        ) {
          api.admin
            .products({ id: row.id })
            .delete()
            .then((res) => {
              if (res.status !== 200) {
                window.alert(
                  `Error: [${res.error?.status}] ${res.error?.value}`,
                );
                return;
              }
              fetchProducts();
            });
        }
      }}
    />
  );
}
