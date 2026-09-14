import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

import { apiFetch } from "../api/client";
import type { Product } from "../types/product";

interface ProductResponse {
  product: Product;
}

function ProductDetailPage() {
  const { addItem } = useCart();
  const { id } = useParams();

  const [isAdding, setIsAdding] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        setError("Producto no encontrado");
        return;
      }

      setError("");

      try {
        const data = await apiFetch<ProductResponse>(`/products/${id}`);

        setProduct(data.product);
        setSelectedImage(0);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "No se pudo cargar el producto"
        );
      }
    }

    loadProduct();
  }, [id]);

  async function handleAddToCart() {
  if (!product) {
    return;
  }

  setIsAdding(true);
  setCartMessage("");

  try {
    await addItem(product.id);

    setCartMessage("Producto agregado al carrito.");
  } catch (error) {
    setCartMessage(
      error instanceof Error
        ? error.message
        : "No se pudo agregar el producto al carrito."
    );
  } finally {
    setIsAdding(false);
  }
}


  if (error) {
    return (
      <div className="space-y-4">
        <Link
          to="/products"
          className="inline-flex font-medium text-blue-600 transition hover:text-blue-800"
        >
          ← Volver a productos
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500">Cargando producto...</p>
      </div>
    );
  }

  const hasStock = product.stock > 0;
  const selectedProductImage = product.images[selectedImage];

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        to="/products"
        className="inline-flex font-medium text-blue-600 transition hover:text-blue-800"
      >
        ← Volver a productos
      </Link>

      {/* Product */}
      <section className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">
        <div className="grid lg:grid-cols-2">
          {/* Images */}
          <div className="border-b border-slate-100 p-6 lg:border-b-0 lg:border-r">
            <div className="flex h-[420px] items-center justify-center overflow-hidden rounded-xl bg-blue-50">
              {selectedProductImage ? (
                <img
                  src={selectedProductImage.url}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-blue-300">
                  <span className="text-5xl">▧</span>
                  <span className="text-sm">Sin imagen</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-blue-50 transition ${
                      selectedImage === index
                        ? "border-blue-600"
                        : "border-transparent hover:border-blue-200"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Information */}
          <div className="flex flex-col p-6 lg:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                {product.categories[0]?.name ?? "Producto"}
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {product.name}
              </h1>

              <p className="mt-4 text-3xl font-bold text-blue-700">
                ${product.price}
              </p>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6">
              {product.description ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                    Descripción
                  </h2>

                  <p className="mt-2 leading-7 text-slate-600">
                    {product.description}
                  </p>
                </div>
              ) : (
                <p className="text-slate-500">
                  Este producto no tiene una descripción.
                </p>
              )}
            </div>

            <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  SKU
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {product.sku}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Disponibilidad
                </p>

                <p
                  className={`mt-1 font-medium ${
                    hasStock ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {hasStock
                    ? `${product.stock} disponibles`
                    : "Agotado"}
                </p>
              </div>
            </div>

            {/* Add to cart */}
            <div className="mt-auto pt-8">
              <button
                type="button"
                disabled={!hasStock || isAdding}
                onClick={handleAddToCart}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                {!hasStock
                ? "Producto agotado"
                : isAdding
                  ? "Agregando..."
                  : "Agregar al carrito"}
              </button>

              {cartMessage && (
              <p className="mt-3 text-center text-sm font-medium text-blue-600">
               {cartMessage}
               </p>
                )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetailPage;