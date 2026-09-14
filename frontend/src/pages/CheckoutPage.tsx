import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { apiFetch } from "../api/client";
import { useCart } from "../context/CartContext";

interface CheckoutFormData {
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDepartment: string;
  shippingPostalCode: string;
  shippingPhone: string;
}

interface CheckoutResponse {
  message: string;
  order: {
    id: number;
  };
}

function CheckoutPage() {
  const { cart, isLoading, refreshCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingName: "",
    shippingAddress: "",
    shippingCity: "",
    shippingDepartment: "",
    shippingPostalCode: "",
    shippingPhone: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const shippingName = formData.shippingName.trim();
    const shippingAddress = formData.shippingAddress.trim();
    const shippingCity = formData.shippingCity.trim();
    const shippingDepartment = formData.shippingDepartment.trim();
    const shippingPostalCode = formData.shippingPostalCode.trim();
    const shippingPhone = formData.shippingPhone.trim();

    if (!shippingName) {
      setError("El nombre completo es obligatorio.");
      return;
    }

    if (!shippingAddress) {
      setError("La dirección es obligatoria.");
      return;
    }

    if (!shippingCity) {
      setError("La ciudad es obligatoria.");
      return;
    }

    if (!shippingDepartment) {
      setError("El departamento es obligatorio.");
      return;
    }

    if (!shippingPhone) {
      setError("El teléfono es obligatorio.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await apiFetch<CheckoutResponse>("/checkout", {
        method: "POST", token,
        body: JSON.stringify({
          shippingName,
          shippingAddress,
          shippingCity,
          shippingDepartment,
          shippingPostalCode: shippingPostalCode || undefined,
          shippingPhone,
        }),
      });

      await refreshCart();

      navigate(`/orders/${data.order.id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo crear la orden."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">Cargando carrito...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Tu carrito está vacío
        </h1>

        <p className="mt-3 text-slate-500">
          Agrega productos antes de continuar con la compra.
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

  const total = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/cart"
          className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
        >
          ← Volver al carrito
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          Finalizar compra
        </h1>

        <p className="mt-2 text-slate-500">
          Completa tus datos de envío para realizar el pedido.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[1fr_380px]"
      >
        {/* Datos de envío */}
        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Datos de envío
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Ingresa la información donde deseas recibir tu pedido.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="shippingName"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Nombre completo *
              </label>

              <input
                id="shippingName"
                name="shippingName"
                type="text"
                value={formData.shippingName}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Nombre completo"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="shippingAddress"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Dirección *
              </label>

              <input
                id="shippingAddress"
                name="shippingAddress"
                type="text"
                value={formData.shippingAddress}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Ej. Calle 10 # 20-30"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="shippingCity"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Ciudad *
                </label>

                <input
                  id="shippingCity"
                  name="shippingCity"
                  type="text"
                  value={formData.shippingCity}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Ciudad"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="shippingDepartment"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Departamento *
                </label>

                <input
                  id="shippingDepartment"
                  name="shippingDepartment"
                  type="text"
                  value={formData.shippingDepartment}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Departamento"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="shippingPostalCode"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Código postal
                </label>

                <input
                  id="shippingPostalCode"
                  name="shippingPostalCode"
                  type="text"
                  value={formData.shippingPostalCode}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Opcional"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="shippingPhone"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Teléfono *
                </label>

                <input
                  id="shippingPhone"
                  name="shippingPhone"
                  type="tel"
                  value={formData.shippingPhone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Número de teléfono"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}
        </section>

        {/* Resumen */}
        <aside className="h-fit rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Resumen del pedido
          </h2>

          <div className="mt-6 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-800">
                    {item.product.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Cantidad: {item.quantity}
                  </p>
                </div>

                <p className="whitespace-nowrap font-semibold text-slate-800">
                  $
                  {(
                    Number(item.product.price) * item.quantity
                  ).toLocaleString("es-CO")}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
            <span className="text-lg font-semibold text-slate-900">
              Total
            </span>

            <span className="text-2xl font-bold text-blue-700">
              ${total.toLocaleString("es-CO")}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting ? "Creando pedido..." : "Realizar pedido"}
          </button>

          <p className="mt-3 text-center text-xs text-slate-500">
            Al realizar el pedido, se registrará tu compra.
          </p>
        </aside>
      </form>
    </div>
  );
}

export default CheckoutPage;