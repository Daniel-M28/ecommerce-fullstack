import { useEffect, useState } from "react";

import { apiFetch } from "../../api/client";
import type {
  Order,
  OrdersResponse,
  OrderResponse,
  OrderStatus,
} from "../../types/order";

function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  async function loadOrders() {
    setError("");

    try {
      const data = await apiFetch<OrdersResponse>("/orders/admin", {
        token: localStorage.getItem("token") ?? undefined,
      });

      setOrders(data.orders);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los pedidos."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function formatPrice(price: string) {
    return Number(price).toLocaleString("es-CO");
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getStatusLabel(status: OrderStatus) {
    const labels: Record<OrderStatus, string> = {
      PENDING: "Pendiente",
      PAID: "Pagado",
      PROCESSING: "Procesando",
      SHIPPED: "Enviado",
      DELIVERED: "Entregado",
      CANCELLED: "Cancelado",
    };

    return labels[status];
  }

  function getStatusClasses(status: OrderStatus) {
    const classes: Record<OrderStatus, string> = {
      PENDING: "bg-yellow-100 text-yellow-700",
      PAID: "bg-blue-100 text-blue-700",
      PROCESSING: "bg-purple-100 text-purple-700",
      SHIPPED: "bg-indigo-100 text-indigo-700",
      DELIVERED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
    };

    return classes[status];
  }

  function getNextStatus(status: OrderStatus): OrderStatus | null {
    const nextStatuses: Record<OrderStatus, OrderStatus | null> = {
      PENDING: "PAID",
      PAID: "PROCESSING",
      PROCESSING: "SHIPPED",
      SHIPPED: "DELIVERED",
      DELIVERED: null,
      CANCELLED: null,
    };

    return nextStatuses[status];
  }

  function getNextStatusLabel(status: OrderStatus) {
    const nextStatus = getNextStatus(status);

    if (!nextStatus) {
      return null;
    }

    return getStatusLabel(nextStatus);
  }

  async function handleStatusChange() {
    if (!selectedOrder) {
      return;
    }

    const nextStatus = getNextStatus(selectedOrder.status);

    if (!nextStatus) {
      return;
    }

    setError("");
    setStatusMessage("");
    setIsUpdatingStatus(true);

    try {
      const data = await apiFetch<OrderResponse>(
        `/orders/${selectedOrder.id}/status`,
        {
          method: "PATCH",
          token: localStorage.getItem("token") ?? undefined,
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      setSelectedOrder(data.order);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === data.order.id ? data.order : order
        )
      );

      setStatusMessage(
        `Estado actualizado a "${getStatusLabel(data.order.status)}".`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el estado del pedido."
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  function getItemSubtotal(price: string, quantity: number) {
    return Number(price) * quantity;
  }

  function openOrderDetail(order: Order) {
    setSelectedOrder(order);
    setError("");
    setStatusMessage("");
  }

  function closeOrderDetail() {
    if (isUpdatingStatus) {
      return;
    }

    setSelectedOrder(null);
    setError("");
    setStatusMessage("");
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-blue-600">
          Administración
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Pedidos
        </h1>

        <p className="mt-2 text-slate-500">
          Consulta y administra los pedidos realizados por los clientes.
        </p>
      </div>

      {error && !selectedOrder && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div className="border-b border-blue-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Todos los pedidos
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {orders.length}{" "}
            {orders.length === 1
              ? "pedido registrado"
              : "pedidos registrados"}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500">
              No hay pedidos registrados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="border-b border-blue-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Pedido
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Cliente
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Fecha
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Productos
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Estado
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-blue-50">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-blue-50/40"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="font-semibold text-slate-900">
                        #{order.id}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800">
                          {order.user?.name ?? "Usuario"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {order.user?.email ?? "—"}
                        </p>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {order.items.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                      ${formatPrice(order.total)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        type="button"
                        onClick={() => openOrderDetail(order)}
                        className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={closeOrderDetail}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-blue-100 px-6 py-5">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Detalle del pedido
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Pedido #{selectedOrder.id}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeOrderDetail}
                disabled={isUpdatingStatus}
                className="rounded-lg px-3 py-2 text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Cerrar detalle"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 p-6">
              <section className="rounded-xl border border-blue-100 bg-slate-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">
                      Estado actual
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-500">
                      Fecha
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                </div>

                {getNextStatus(selectedOrder.status) && (
                  <div className="mt-5 border-t border-blue-100 pt-5">
                    <p className="text-sm font-medium text-slate-700">
                      Próximo estado
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="text-sm text-slate-500">
                        {getNextStatusLabel(selectedOrder.status)}
                      </span>

                      <button
                        type="button"
                        onClick={handleStatusChange}
                        disabled={isUpdatingStatus}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isUpdatingStatus
                          ? "Actualizando..."
                          : `Marcar como ${getNextStatusLabel(
                              selectedOrder.status
                            )}`}
                      </button>
                    </div>
                  </div>
                )}

                {selectedOrder.status === "DELIVERED" && (
                  <p className="mt-5 border-t border-blue-100 pt-5 text-sm font-medium text-green-700">
                    Este pedido ya fue entregado.
                  </p>
                )}

                {selectedOrder.status === "CANCELLED" && (
                  <p className="mt-5 border-t border-blue-100 pt-5 text-sm font-medium text-red-700">
                    Este pedido fue cancelado.
                  </p>
                )}

                {statusMessage && (
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {statusMessage}
                  </div>
                )}

                {error && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-900">
                  Cliente
                </h3>

                <div className="mt-3 rounded-xl border border-blue-100 bg-white p-5">
                  <p className="font-semibold text-slate-800">
                    {selectedOrder.user?.name ?? "Usuario"}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedOrder.user?.email ?? "—"}
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-900">
                  Productos
                </h3>

                <div className="mt-3 overflow-hidden rounded-xl border border-blue-100">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-slate-50">
                        <tr className="border-b border-blue-100">
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Producto
                          </th>

                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Precio
                          </th>

                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Cantidad
                          </th>

                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Subtotal
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-blue-50">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-5 py-4 font-medium text-slate-800">
                              {item.productName}
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              ${formatPrice(item.price)}
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-600">
                              {item.quantity}
                            </td>

                            <td className="px-5 py-4 font-semibold text-slate-800">
                              $
                              {formatPrice(
                                getItemSubtotal(
                                  item.price,
                                  item.quantity
                                ).toString()
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <div className="rounded-xl bg-blue-50 px-5 py-4 text-right">
                    <p className="text-sm text-slate-500">
                      Total del pedido
                    </p>

                    <p className="mt-1 text-2xl font-bold text-blue-700">
                      ${formatPrice(selectedOrder.total)}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-900">
                  Información de envío
                </h3>

                <div className="mt-3 grid gap-4 rounded-xl border border-blue-100 bg-white p-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Nombre
                    </p>

                    <p className="mt-1 text-sm text-slate-800">
                      {selectedOrder.shippingName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Teléfono
                    </p>

                    <p className="mt-1 text-sm text-slate-800">
                      {selectedOrder.shippingPhone}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Dirección
                    </p>

                    <p className="mt-1 text-sm text-slate-800">
                      {selectedOrder.shippingAddress}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Ciudad
                    </p>

                    <p className="mt-1 text-sm text-slate-800">
                      {selectedOrder.shippingCity}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Departamento
                    </p>

                    <p className="mt-1 text-sm text-slate-800">
                      {selectedOrder.shippingDepartment}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Código postal
                    </p>

                    <p className="mt-1 text-sm text-slate-800">
                      {selectedOrder.shippingPostalCode ??
                        "No especificado"}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex justify-end border-t border-blue-100 px-6 py-4">
              <button
                type="button"
                onClick={closeOrderDetail}
                disabled={isUpdatingStatus}
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrdersPage;