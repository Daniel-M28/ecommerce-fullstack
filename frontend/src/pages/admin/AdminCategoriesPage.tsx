import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import { apiFetch } from "../../api/client";
import type { Category } from "../../types/category";

interface CategoriesResponse {
  categories: Category[];
}

interface CategoryResponse {
  message: string;
  category: Category;
}

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
}

function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );

  const [changingStatusId, setChangingStatusId] = useState<number | null>(
    null
  );

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
  });

  async function loadCategories() {
    try {
      setError("");

      const data = await apiFetch<CategoriesResponse>("/categories/admin", {
  token: localStorage.getItem("token") ?? undefined,
});

      setCategories(data.categories);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las categorías."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openCreateForm() {
    setFormData({
      name: "",
      slug: "",
      description: "",
    });

    setEditingCategoryId(null);
    setError("");
    setIsFormOpen(true);
  }

  function openEditForm(category: Category) {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
    });

    setEditingCategoryId(category.id);
    setError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    if (isCreating) {
      return;
    }

    setIsFormOpen(false);
    setEditingCategoryId(null);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const name = formData.name.trim();
    const slug = formData.slug.trim();
    const description = formData.description.trim();

    if (!name) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }

    if (!slug) {
      setError("El slug de la categoría es obligatorio.");
      return;
    }

    setIsCreating(true);

    try {
      if (editingCategoryId === null) {
        await apiFetch<CategoryResponse>("/categories", {
          method: "POST",
          token: localStorage.getItem("token") ?? undefined,
          body: JSON.stringify({
            name,
            slug,
            description: description || undefined,
          }),
        });
      } else {
        await apiFetch<CategoryResponse>(
          `/categories/${editingCategoryId}`,
          {
            method: "PUT",
            token: localStorage.getItem("token") ?? undefined,
            body: JSON.stringify({
              name,
              slug,
              description: description || undefined,
            }),
          }
        );
      }

      setFormData({
        name: "",
        slug: "",
        description: "",
      });

      setIsFormOpen(false);
      setEditingCategoryId(null);

      await loadCategories();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : editingCategoryId === null
            ? "No se pudo crear la categoría."
            : "No se pudo actualizar la categoría."
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleToggleStatus(category: Category) {
    setError("");
    setChangingStatusId(category.id);

    try {
      if (category.active) {
        await apiFetch<CategoryResponse>(
          `/categories/${category.id}`,
          {
            method: "DELETE",
            token: localStorage.getItem("token") ?? undefined,
          }
        );
      } else {
        await apiFetch<CategoryResponse>(
          `/categories/${category.id}/activate`,
          {
            method: "PATCH",
            token: localStorage.getItem("token") ?? undefined,
          }
        );
      }

      await loadCategories();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : category.active
            ? "No se pudo desactivar la categoría."
            : "No se pudo activar la categoría."
      );
    } finally {
      setChangingStatusId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">Cargando categorías...</p>
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
            Categorías
          </h1>

          <p className="mt-2 text-slate-500">
            Administra las categorías de productos de tu tienda.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          disabled={changingStatusId !== null}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          + Nueva categoría
        </button>
      </div>

      {isFormOpen && (
        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {editingCategoryId === null
                ? "Nueva categoría"
                : "Editar categoría"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingCategoryId === null
                ? "Completa los datos para crear una nueva categoría."
                : "Modifica los datos de la categoría seleccionada."}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
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
                placeholder="Ej. Tecnología"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Slug *
              </label>

              <input
                id="slug"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={handleChange}
                disabled={isCreating}
                placeholder="Ej. tecnologia"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

              <p className="mt-1 text-xs text-slate-400">
                Usa letras minúsculas, números y guiones.
              </p>
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
                placeholder="Descripción opcional de la categoría"
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
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
                  ? "Guardando..."
                  : editingCategoryId === null
                    ? "Crear categoría"
                    : "Guardar cambios"}
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

      {!error && categories.length === 0 && (
        <div className="rounded-2xl border border-blue-100 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            No hay categorías
          </h2>

          <p className="mt-2 text-slate-500">
            Todavía no existen categorías registradas.
          </p>
        </div>
      )}

      {categories.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="border-b border-blue-100 bg-blue-50/60">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Nombre
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Slug
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Descripción
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Estado
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    ID
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {categories.map((category) => {
                  const isChangingStatus =
                    changingStatusId === category.id;

                  return (
                    <tr
                      key={category.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">
                          {category.name}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-sm text-slate-600">
                          {category.slug}
                        </span>
                      </td>

                      <td className="max-w-xs px-6 py-4 text-sm text-slate-500">
                        {category.description || "Sin descripción"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            category.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {category.active ? "Activa" : "Inactiva"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-500">
                        #{category.id}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(category)}
                            disabled={
                              changingStatusId !== null ||
                              isCreating
                            }
                            className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStatus(category)
                            }
                            disabled={
                              changingStatusId !== null ||
                              isCreating
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              category.active
                                ? "border border-red-200 text-red-600 hover:bg-red-50"
                                : "border border-green-200 text-green-600 hover:bg-green-50"
                            }`}
                          >
                            {isChangingStatus
                              ? "Guardando..."
                              : category.active
                                ? "Desactivar"
                                : "Activar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategoriesPage;