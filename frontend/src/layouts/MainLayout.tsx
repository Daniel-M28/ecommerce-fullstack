import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext";

import { useAuth } from "../context/AuthContext";

function MainLayout() {
  
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  function handleLogout() {
    setIsUserMenuOpen(false);
    logout();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-blue-100 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-blue-800 transition hover:text-blue-600"
          >
            E-commerce
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              Inicio
            </Link>

            <Link
              to="/products"
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              Productos
            </Link>

            <Link
              to="/cart"
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              🛒 Carrito
              {totalItems > 0 && (
                <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-blue-600">
                  {totalItems}
                </span>
              )}
            </Link>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="font-medium text-slate-600 transition hover:text-blue-600"
                >
                  Iniciar sesión
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg border border-blue-600 px-4 py-2 font-medium text-blue-600 transition hover:bg-blue-50"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <div className="relative">
                {/* User button */}
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  <span>👤</span>
                  <span>{user?.name}</span>
                  <span className="text-sm">
                    {isUserMenuOpen ? "▲" : "▼"}
                  </span>
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-52 overflow-hidden rounded-lg border border-blue-100 bg-white shadow-lg">
                    <div className="border-b border-blue-50 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {user?.name}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {user?.email}
                      </p>
                    </div>

                    {user?.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                      >
                        ⚙️ Administración
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;