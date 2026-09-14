import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Order, OrderStatus } from "../types/order";

interface OrderResponse {
  order: Order;
}

function OrderDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!token) {
        setError("Debes iniciar sesión para consultar esta orden.");
        setIsLoading(false);
        return;
      }

      if (!id || Number.isNaN(Number(id))) {
        setError("El ID de la orden no es válido.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiFetch<OrderResponse>(
          `/orders/${id}`,
          {
            token,
          }
        );

        setOrder(data.order);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "No se pudo cargar la orden."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [id, token]);

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
        <p className="text-slate-500">Cargando orden...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          No se pudo cargar la orden
        </h1>

        <p className="mt-3 text-sm text-red-600">
          {error || "La orden no existe."}
        </p>

        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <Link
          to="/products"
          className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
        >
          ← Volver a productos
        </Link>

        <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Orden #{order.id}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Realizada el{" "}
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
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Productos */}
        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Productos
          </h2>

          <div className="mt-6 divide-y divide-slate-100">
            {order.items.map((item) => {
              const itemTotal =
                Number(item.price) * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {item.productName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Cantidad: {item.quantity}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Precio unitario: $
                      {Number(item.price).toLocaleString(
                        "es-CO"
                      )}
                    </p>
                  </div>

                  <p className="font-bold text-slate-900">
                    ${itemTotal.toLocaleString("es-CO")}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-5">
            <span className="text-lg font-semibold text-slate-900">
              Total
            </span>

            <span className="text-2xl font-bold text-blue-700">
              ${Number(order.total).toLocaleString("es-CO")}
            </span>
          </div>
        </section>

        {/* Información de envío */}
        <aside className="h-fit space-y-6">
          <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Datos de envío
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Nombre
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {order.shippingName}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Dirección
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {order.shippingAddress}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Ciudad
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {order.shippingCity}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Departamento
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {order.shippingDepartment}
                </p>
              </div>

              {order.shippingPostalCode && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Código postal
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {order.shippingPostalCode}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Teléfono
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {order.shippingPhone}
                </p>
              </div>
            </div>
          </section>

          <Link
            to="/products"
            className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default OrderDetailPage;