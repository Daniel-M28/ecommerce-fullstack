import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Order, OrderStatus } from "../types/order";

interface OrdersResponse {
  orders: Order[];
}

function OrdersPage() {
  const { token } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      if (!token) {
        setError("Debes iniciar sesión para consultar tus pedidos.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiFetch<OrdersResponse>("/orders", {
          token,
        });

        setOrders(data.orders);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar tus pedidos."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [token]);

  function getStatusLabel(status: OrderStatus) {
    const labels: Record<OrderStatus, string> = {
      PENDING: "Pendiente",
      PAID: "Pagada",
      PROCESSING: "En preparación",
      SHIPPED: "Enviada",
      DELIVERED: "Entregada",
      CANCELLED: "Cancelada",
    };

    return labels[status];
  }

  function getStatusClasses(status: OrderStatus) {
    const classes: Record<OrderStatus, string> = {
      PENDING: "bg-amber-100 text-amber-700",
      PAID: "bg-blue-100 text-blue-700",
      PROCESSING: "bg-indigo-100 text-indigo-700",
      SHIPPED: "bg-purple-100 text-purple-700",
      DELIVERED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
    };

    return classes[status];
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          No se pudieron cargar tus pedidos
        </h1>

        <p className="mt-3 text-sm text-red-600">{error}</p>

        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Mis pedidos
        </h1>

        <p className="mt-3 text-slate-500">
          Todavía no has realizado ningún pedido.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Explorar productos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Mis pedidos
        </h1>

        <p className="mt-2 text-slate-500">
          Consulta el estado y los detalles de tus pedidos.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Orden #{order.id}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString(
                    "es-CO",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClasses(
                  order.status
                )}`}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>

            <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Productos
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {order.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Destino
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {order.shippingCity}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total
                </p>

                <p className="mt-1 font-bold text-blue-700">
                  ${Number(order.total).toLocaleString("es-CO")}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <Link
                to={`/orders/${order.id}`}
                className="inline-block rounded-lg border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Ver detalles
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default OrdersPage;