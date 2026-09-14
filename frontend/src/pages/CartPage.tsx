import { useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

function CartPage() {
  const {
    cart,
    isLoading,
    updateItem,
    removeItem,
    clearCart,
  } = useCart();

  const [error, setError] = useState("");

  async function handleUpdate(itemId: number, quantity: number) {
    setError("");

    try {
      await updateItem(itemId, quantity);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el producto"
      );
    }
  }

  async function handleRemove(itemId: number) {
    setError("");

    try {
      await removeItem(itemId);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el producto"
      );
    }
  }

  async function handleClear() {
    setError("");

    try {
      await clearCart();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo vaciar el carrito"
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500">Cargando carrito...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <div className="rounded-xl border border-blue-100 bg-white p-10 shadow-sm">
          <div className="text-5xl">🛒</div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Tu carrito está vacío
          </h1>

          <p className="mt-2 text-slate-500">
            Agrega algunos productos para comenzar tu compra.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Tu compra
        </p>

        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Carrito
            </h1>

            <p className="mt-2 text-slate-500">
              Revisa tus productos antes de continuar.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-medium text-slate-500 transition hover:text-red-600"
          >
            Vaciar carrito
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Items */}
        <section className="space-y-4">
          {cart.items.map((item) => {
            const itemTotal =
              Number(item.product.price) * item.quantity;

            const image = item.product.images[0];

            return (
              <article
                key={item.id}
                className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-blue-50"
                  >
                    {image ? (
                      <img
                        src={image.url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl text-blue-300">
                        ▧
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${item.product.id}`}
                      className="font-semibold text-slate-900 transition hover:text-blue-700"
                    >
                      {item.product.name}
                    </Link>

                    <p className="mt-1 text-sm text-slate-500">
                      ${item.product.price}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-lg border border-slate-200">
                        <button
                          type="button"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            handleUpdate(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          className="px-3 py-1.5 text-slate-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="min-w-10 text-center text-sm font-medium text-slate-700">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          disabled={
                            item.quantity >= item.product.stock
                          }
                          onClick={() =>
                            handleUpdate(
                              item.id,
                              item.quantity + 1
                            )
                          }
                          className="px-3 py-1.5 text-slate-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="text-sm font-medium text-red-500 transition hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-blue-700">
                      ${itemTotal.toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Summary */}
        <aside className="h-fit rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Resumen
          </h2>

          <div className="mt-5 space-y-3 border-b border-slate-100 pb-5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Productos</span>

              <span className="font-medium text-slate-700">
                {cart.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>

              <span className="font-medium text-slate-700">
                ${total.toLocaleString("es-CO")}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Envío</span>

              <span className="font-medium text-slate-700">
                Por calcular
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="font-semibold text-slate-900">
              Total
            </span>

            <span className="text-2xl font-bold text-blue-700">
              ${total.toLocaleString("es-CO")}
            </span>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block w-full rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Continuar compra
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;