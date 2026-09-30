import { useEffect, useState } from "react";

import { apiFetch } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

interface ProductsResponse {
  products: unknown[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CategoriesResponse {
  categories: unknown[];
}

interface UsersResponse {
  users: unknown[];
}

interface OrdersResponse {
  orders: unknown[];
}

function AdminDashboardPage() {
  const { token } = useAuth();

  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      if (!token) return;

      try {
        setIsLoading(true);
        setError("");

        const [
          productsData,
          categoriesData,
          usersData,
          ordersData,
        ] = await Promise.all([
          apiFetch<ProductsResponse>("/products/admin?limit=1", {
            token,
          }),

          apiFetch<CategoriesResponse>("/categories/admin", {
            token,
          }),

          apiFetch<UsersResponse>("/users", {
            token,
          }),

          apiFetch<OrdersResponse>("/orders/admin", {
            token,
          }),
        ]);

        setProductsCount(productsData.pagination.total);
        setCategoriesCount(categoriesData.categories.length);
        setUsersCount(usersData.users.length);
        setOrdersCount(ordersData.orders.length);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar las estadísticas del dashboard.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [token]);

  const stats = [
    {
      title: "Productos",
      value: productsCount,
    },
    {
      title: "Categorías",
      value: categoriesCount,
    },
    {
      title: "Pedidos",
      value: ordersCount,
    },
    {
      title: "Usuarios",
      value: usersCount,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-blue-600">
          Panel administrativo
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Desde aquí podrás administrar tu tienda.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {stat.title}
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {isLoading ? "..." : stat.value}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Total registrado
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Bienvenido al panel de administración
        </h2>

        <p className="mt-2 max-w-2xl text-slate-500">
          Aquí podrás gestionar los productos, categorías, pedidos
          y usuarios de tu tienda.
        </p>
      </section>
    </div>
  );
}

export default AdminDashboardPage;