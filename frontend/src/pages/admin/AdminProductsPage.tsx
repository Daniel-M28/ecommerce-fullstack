import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { apiFetch } from "../../api/client";
import type { Category } from "../../types/category";
import type {
  Product,
  ProductsResponse,
} from "../../types/product";

interface CategoriesResponse {
  categories: Category[];
}

interface ProductResponse {
  message: string;
  product: Product;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  sku: string;
  categoryId: string;
}

function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(
    null
  );
  const [changingStatusId, setChangingStatusId] = useState<number | null>(
    null
  );

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    categoryId: "",
  });

  async function loadProducts() {
    try {
      setError("");

      const data = await apiFetch<ProductsResponse>(
        "/products/admin",
        {
          token: localStorage.getItem("token") ?? undefined,
        }
      );

      setProducts(data.products);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los productos."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const data = await apiFetch<CategoriesResponse>(
        "/categories"
      );

      setCategories(data.categories);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las categorías."
      );
    }
  }

  useEffect(() => {
    async function loadData() {
      await Promise.all([
        loadProducts(),
        loadCategories(),
      ]);
    }

    loadData();
  }, []);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openCreateForm() {
    setEditingProductId(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      sku: "",
      categoryId: "",
    });

    setError("");
    setIsFormOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingProductId(product.id);

    setFormData({
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      stock: String(product.stock),
      sku: product.sku,
      categoryId: product.categories[0]
        ? String(product.categories[0].id)
        : "",
    });

    setError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    if (isCreating) {
      return;
    }

    setIsFormOpen(false);
    setEditingProductId(null);
    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const name = formData.name.trim();
    const description = formData.description.trim();
    const sku = formData.sku.trim();

    if (!name) {
      setError("El nombre del producto es obligatorio.");
      return;
    }

    if (!formData.price) {
      setError("El precio es obligatorio.");
      return;
    }

    if (!formData.stock) {
      setError("El stock es obligatorio.");
      return;
    }

    if (!sku) {
      setError("El SKU es obligatorio.");
      return;
    }

    if (!formData.categoryId) {
      setError("Debes seleccionar una categoría.");
      return;
    }

    const price = Number(formData.price);
    const stock = Number(formData.stock);
    const categoryId = Number(formData.categoryId);

    if (!Number.isFinite(price) || price <= 0) {
      setError("El precio debe ser mayor que 0.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError(
        "El stock debe ser un número entero mayor o igual a 0."
      );
      return;
    }

    setIsCreating(true);

    try {
      if (editingProductId !== null) {
        await apiFetch<ProductResponse>(
          `/products/${editingProductId}`,
          {
            method: "PATCH",
            token: localStorage.getItem("token") ?? undefined,
            body: JSON.stringify({
              name,
              description: description || undefined,
              price,
              stock,
              sku,
              categories: [categoryId],
            }),
          }
        );
      } else {
        await apiFetch<ProductResponse>("/products", {
          method: "POST",
          token: localStorage.getItem("token") ?? undefined,
          body: JSON.stringify({
            name,
            description: description || undefined,
            price,
            stock,
            sku,
            categories: [categoryId],
          }),
        });
      }

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        sku: "",
        categoryId: "",
      });

      setIsFormOpen(false);
      setEditingProductId(null);

      await loadProducts();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : editingProductId !== null
            ? "No se pudo actualizar el producto."
            : "No se pudo crear el producto."
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleToggleStatus(product: Product) {
    setError("");
    setChangingStatusId(product.id);

    try {
      if (product.active) {
        await apiFetch(`/products/${product.id}`, {
          method: "DELETE",
          token: localStorage.getItem("token") ?? undefined,
        });
      } else {
        await apiFetch<ProductResponse>(
          `/products/${product.id}/activate`,
          {
            method: "PATCH",
            token: localStorage.getItem("token") ?? undefined,
          }
        );
      }

      await loadProducts();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : product.active
            ? "No se pudo desactivar el producto."
            : "No se pudo activar el producto."
      );
    } finally {
      setChangingStatusId(null);
    }
  }

  function formatPrice(price: string) {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
      return price;
    }

    return new Intl.NumberFormat("es-CO", {
      maximumFractionDigits: 0,
    }).format(numericPrice);
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">
          Cargando productos...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Administración
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Productos
          </h1>

          <p className="mt-2 text-slate-500">
            Administra los productos de tu tienda.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          disabled={isCreating || changingStatusId !== null}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          + Nuevo producto
        </button>
      </div>

      {isFormOpen && (
        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {editingProductId !== null
                ? "Editar producto"
                : "Nuevo producto"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingProductId !== null
                ? "Modifica los datos del producto."
                : "Completa los datos para crear un nuevo producto."}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nombre *
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isCreating}
                  placeholder="Ej. Laptop Lenovo"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="sku"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  SKU *
                </label>

                <input
                  id="sku"
                  name="sku"
                  type="text"
                  value={formData.sku}
                  onChange={handleChange}
                  disabled={isCreating}
                  placeholder="Ej. LENOVO-001"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Descripción
              </label>

              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                disabled={isCreating}
                placeholder="Descripción opcional del producto"
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Precio *
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={isCreating}
                  placeholder="Ej. 250000"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Stock *
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={handleChange}
                  disabled={isCreating}
                  placeholder="Ej. 10"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="categoryId"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Categoría *
                </label>

                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  disabled={isCreating}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                >
                  <option value="">
                    Selecciona una categoría
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeForm}
                disabled={isCreating}
                className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isCreating}
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isCreating
                  ? editingProductId !== null
                    ? "Guardando..."
                    : "Creando..."
                  : editingProductId !== null
                    ? "Guardar cambios"
                    : "Crear producto"}
              </button>
            </div>
          </form>
        </section>
      )}

      {error && !isFormOpen && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {!error && products.length === 0 && (
        <div className="rounded-2xl border border-blue-100 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            No hay productos
          </h2>

          <p className="mt-2 text-slate-500">
            Todavía no existen productos registrados.
          </p>
        </div>
      )}

      {products.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-left">
              <thead className="border-b border-blue-100 bg-blue-50/60">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Producto
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    SKU
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Precio
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Categorías
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Estado
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                    ID
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">
                        {product.name}
                      </p>

                      {product.description && (
                        <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                          {product.description}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-sm text-slate-600">
                        {product.sku}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                      ${formatPrice(product.price)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-semibold ${
                          product.stock > 0
                            ? "text-slate-700"
                            : "text-red-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.categories.map(
                          (category) => (
                            <span
                              key={category.id}
                              className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700"
                            >
                              {category.name}
                            </span>
                          )
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.active
                          ? "Activo"
                          : "Inactivo"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-medium text-slate-500">
                      #{product.id}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {product.active && (
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            disabled={
                              isCreating ||
                              changingStatusId !== null
                            }
                            className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Editar
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(product)
                          }
                          disabled={
                            isCreating ||
                            changingStatusId !== null
                          }
                          className={`rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            product.active
                              ? "border border-red-200 text-red-600 hover:bg-red-50"
                              : "border border-green-200 text-green-700 hover:bg-green-50"
                          }`}
                        >
                          {changingStatusId === product.id
                            ? "Procesando..."
                            : product.active
                              ? "Desactivar"
                              : "Activar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;