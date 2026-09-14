import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiFetch } from "../api/client";
import type { Category } from "../types/category";
import type { Product, ProductsResponse } from "../types/product";

interface CategoriesResponse {
  categories: Category[];
}


function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [categoriesData, productsData] = await Promise.all([
          apiFetch<CategoriesResponse>("/categories"),
          apiFetch<ProductsResponse>("/products?limit=4&sort=newest"),
        ]);

        setCategories(categoriesData.categories);
        setProducts(productsData.products);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "No se pudo cargar la información"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeData();
  }, []);


  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-800 via-blue-700 to-blue-500 px-8 py-16 text-white shadow-lg md:px-12">
        <div className="max-w-2xl">
          <p className="mb-3 font-medium text-blue-100">
            Todo lo que necesitas
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Encuentra tus productos favoritos
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-blue-100">
            Descubre nuestra selección de productos y encuentra lo que estás
            buscando de forma rápida y sencilla.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
          >
            Ver productos
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Explora
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Categorías
            </h2>
          </div>

          <Link
            to="/products"
            className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
          >
            Ver productos →
          </Link>
        </div>

        {categories.length === 0 ? (
          <p className="text-slate-500">
            No hay categorías disponibles.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?categoryId=${category.id}`}
                className="group rounded-xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-600 transition group-hover:bg-blue-100">
                  ◈
                </div>

                <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">
                  {category.name}
                </h3>

                {category.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Products */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Descubre
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Productos recientes
            </h2>
          </div>

          <Link
            to="/products"
            className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
          >
            Ver todos →
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-slate-500">
            No hay productos disponibles.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                {/* Product image */}
                <div className="flex h-48 items-center justify-center bg-blue-50">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-sm text-blue-300">
                      Sin imagen
                    </span>
                  )}
                </div>

                {/* Product information */}
                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                    {product.categories[0]?.name ?? "Producto"}
                  </p>

                  <h3 className="mt-2 line-clamp-2 font-semibold text-slate-900 group-hover:text-blue-700">
                    {product.name}
                  </h3>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-700">
                      ${product.price}
                    </span>

                    <span className="text-xs text-slate-500">
                      {product.stock > 0
                        ? `${product.stock} disponibles`
                        : "Agotado"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Call to action */}
      <section className="rounded-2xl border border-blue-100 bg-white px-8 py-10 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          ¿Buscas algo en particular?
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-slate-500">
          Explora todo nuestro catálogo y utiliza nuestros filtros para
          encontrar exactamente lo que necesitas.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Explorar catálogo
        </Link>
      </section>
    </div>
  );
}

export default HomePage;