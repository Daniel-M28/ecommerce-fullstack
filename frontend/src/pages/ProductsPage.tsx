import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { apiFetch } from "../api/client";
import type { Category } from "../types/category";
import type { Product, ProductsResponse } from "../types/product";

interface CategoriesResponse {
  categories: Category[];
}

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<ProductsResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );
  const [categoryId, setCategoryId] = useState(
    searchParams.get("categoryId") ?? ""
  );
  const [sort, setSort] = useState(
    searchParams.get("sort") ?? "newest"
  );

const [minPrice, setMinPrice] = useState(
  searchParams.get("minPrice") ?? ""
);

const [maxPrice, setMaxPrice] = useState(
  searchParams.get("maxPrice") ?? ""
);

const [inStock, setInStock] = useState(
  searchParams.get("inStock") === "true"
);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData = await apiFetch<CategoriesResponse>(
          "/categories"
        );

        setCategories(categoriesData.categories);
      } catch {
        // Los filtros siguen funcionando aunque las categorías fallen.
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setData(null);
      setError("");

      try {
        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (categoryId) {
          params.set("categoryId", categoryId);
        }

        if (sort) {
          params.set("sort", sort);
        }

        params.set("page", "1");
        params.set("limit", "12");

        const productsData = await apiFetch<ProductsResponse>(
          `/products?${params.toString()}`
        );

        setData(productsData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los productos"
        );
      }
    }

    loadProducts();
  }, [searchParams]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const params = new URLSearchParams(searchParams);

  if (search.trim()) {
    params.set("search", search.trim());
  } else {
    params.delete("search");
  }

  params.set("page", "1");

  setSearchParams(params);
}

  function handleCategoryChange(value: string) {
    setCategoryId(value);

    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("categoryId", value);
    } else {
      params.delete("categoryId");
    }

    params.set("page", "1");

    setSearchParams(params);
  }

  function handleSortChange(value: string) {
    setSort(value);

    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    params.set("page", "1");

    setSearchParams(params);
  }

  function handlePageChange(page: number) {
  const params = new URLSearchParams(searchParams);

  params.set("page", page.toString());

  setSearchParams(params);
}

  function clearFilters() {
  setSearch("");
  setCategoryId("");
  setSort("newest");
  setMinPrice("");
  setMaxPrice("");
  setInStock(false);

  setSearchParams({
    sort: "newest",
    page: "1",
    limit: "12",
  });
}

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Catálogo
        </p>

        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Productos
            </h1>

            <p className="mt-2 text-slate-500">
              Encuentra el producto que estás buscando.
            </p>
          </div>

          {data && (
            <p className="text-sm text-slate-500">
              {data.pagination.total} productos encontrados
            </p>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
        <div className="space-y-4">
  {/* Búsqueda */}
  <form onSubmit={handleSearch}>
    <label
      htmlFor="search"
      className="mb-1.5 block text-sm font-medium text-slate-700"
    >
      Buscar
    </label>

    <div className="flex gap-2">
      <input
        id="search"
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar productos..."
        className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
      >
        Buscar
      </button>
    </div>
  </form>

  {/* Filtros */}
  <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_1fr_1fr_auto]">
    {/* Categoría */}
    <div>
      <label
        htmlFor="category"
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        Categoría
      </label>

      <select
        id="category"
        value={categoryId}
        onChange={(event) =>
          handleCategoryChange(event.target.value)
        }
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">Todas las categorías</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>

    {/* Ordenar */}
    <div>
      <label
        htmlFor="sort"
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        Ordenar por
      </label>

      <select
        id="sort"
        value={sort}
        onChange={(event) =>
          handleSortChange(event.target.value)
        }
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="newest">Más recientes</option>
        <option value="oldest">Más antiguos</option>
        <option value="price_asc">Precio: menor a mayor</option>
        <option value="price_desc">Precio: mayor a menor</option>
      </select>
    </div>

    {/* Precio mínimo */}
    <div>
      <label
        htmlFor="minPrice"
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        Precio mínimo
      </label>

      <input
        id="minPrice"
        type="number"
        min="0"
        value={minPrice}
        onChange={(event) => setMinPrice(event.target.value)}
        placeholder="Ej. 50000"
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    {/* Precio máximo */}
    <div>
      <label
        htmlFor="maxPrice"
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        Precio máximo
      </label>

      <input
        id="maxPrice"
        type="number"
        min="0"
        value={maxPrice}
        onChange={(event) => setMaxPrice(event.target.value)}
        placeholder="Ej. 500000"
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    {/* Stock + botón */}
    <div className="flex items-end gap-3">
      <label className="flex cursor-pointer items-center gap-2 pb-2.5">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(event) => setInStock(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />

        <span className="whitespace-nowrap text-sm font-medium text-slate-700">
          Solo disponibles
        </span>
      </label>

      <button
        type="button"
        onClick={() => {
          const params = new URLSearchParams(searchParams);

          if (minPrice) {
            params.set("minPrice", minPrice);
          } else {
            params.delete("minPrice");
          }

          if (maxPrice) {
            params.set("maxPrice", maxPrice);
          } else {
            params.delete("maxPrice");
          }

          if (inStock) {
            params.set("inStock", "true");
          } else {
            params.delete("inStock");
          }

          params.set("page", "1");

          setSearchParams(params);
        }}
        className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
      >
        Aplicar filtros
      </button>
    </div>
  </div>
</div>

        {/* Clear */}
        <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      {/* Loading */}
      {!data && !error && (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-slate-500">Cargando productos...</p>
        </div>
      )}

      {/* Products */}
      {data && (
        <>
          {data.products.length === 0 ? (
            <div className="rounded-xl border border-blue-100 bg-white p-12 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-slate-800">
                No encontramos productos
              </h2>

              <p className="mt-2 text-slate-500">
                Intenta cambiar los filtros de búsqueda.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          {/* Pagination */}
         {data.pagination.totalPages > 1 && (
  <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
    {/* Página anterior */}
    <button
      type="button"
      disabled={data.pagination.page === 1}
      onClick={() =>
        handlePageChange(data.pagination.page - 1)
      }
      className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Anterior
    </button>

    {/* Números de página */}
    {Array.from(
      { length: data.pagination.totalPages },
      (_, index) => index + 1
    ).map((page) => (
      <button
        key={page}
        type="button"
        onClick={() => handlePageChange(page)}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
          page === data.pagination.page
            ? "bg-blue-600 text-white"
            : "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
        }`}
      >
        {page}
      </button>
    ))}

    {/* Página siguiente */}
    <button
      type="button"
      disabled={
        data.pagination.page === data.pagination.totalPages
      }
      onClick={() =>
        handlePageChange(data.pagination.page + 1)
      }
      className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Siguiente
    </button>
  </div>

  )};
 
    </>
  )}
  </div>
  );
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const hasStock = product.stock > 0;
  const image = product.images[0];

  return (
    <Link
      to={`/products/${product.id}`}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
    >
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-blue-50">
        {image ? (
          <img
            src={image.url}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-blue-300">
            <span className="text-3xl">▧</span>
            <span className="text-sm">Sin imagen</span>
          </div>
        )}

        {!hasStock && (
          <div className="absolute left-3 top-3 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-white">
            Agotado
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          {product.categories[0]?.name ?? "Producto"}
        </p>

        <h2 className="mt-2 line-clamp-2 min-h-12 font-semibold text-slate-900 transition group-hover:text-blue-700">
          {product.name}
        </h2>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-500">
            {product.description}
          </p>
        )}

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-blue-700">
              ${product.price}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              SKU: {product.sku}
            </p>
          </div>

          {hasStock && (
            <span className="text-xs font-medium text-slate-500">
              {product.stock} disponibles
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductsPage;