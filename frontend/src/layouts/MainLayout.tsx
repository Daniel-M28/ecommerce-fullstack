import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function closeMenus() {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }

  function handleLogout() {
    closeMenus();
    logout();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-blue-100 bg-white">
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <Link
              to="/"
              onClick={closeMenus}
              className="shrink-0 text-xl font-bold tracking-tight text-blue-800 transition hover:text-blue-600 sm:text-2xl"
            >
              E-commerce
            </Link>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-6 md:flex">
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
                to="/orders"
                className="font-medium text-slate-600 transition hover:text-blue-600"
              >
                Mis pedidos
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
                  {/* Desktop user button */}
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((open) => !open)}
                    aria-expanded={isUserMenuOpen}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    <span>👤</span>
                    <span>{user?.name}</span>
                    <span className="text-sm">
                      {isUserMenuOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Desktop user dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-lg border border-blue-100 bg-white shadow-lg">
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
                          onClick={closeMenus}
                          className="block px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                        >
                          Administración
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={closeMenus}
                        className="block px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                      >
                        Perfil
                      </Link>

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

            {/* Mobile actions */}
            <div className="flex items-center gap-2 md:hidden">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenus}
                    className="whitespace-nowrap text-sm font-medium text-slate-600 transition hover:text-blue-600"
                  >
                    Iniciar sesión
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenus}
                    className="whitespace-nowrap rounded-lg border border-blue-600 px-2.5 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                  >
                    Registrarse
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen((open) => !open);
                    setIsMobileMenuOpen(false);
                  }}
                  aria-expanded={isUserMenuOpen}
                  className="flex max-w-32 items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  <span>👤</span>
                  <span className="truncate">{user?.name}</span>
                </button>
              )}

              {/* Mobile hamburger button */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen((open) => !open);
                  setIsUserMenuOpen(false);
                }}
                aria-label={
                  isMobileMenuOpen
                    ? "Cerrar menú de navegación"
                    : "Abrir menú de navegación"
                }
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 text-blue-800 transition hover:bg-blue-50"
              >
                {isMobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile navigation */}
          {isMobileMenuOpen && (
            <div
              id="mobile-navigation"
              className="mt-4 border-t border-blue-100 pt-4 md:hidden"
            >
              <div className="flex flex-col gap-1">
                <Link
                  to="/"
                  onClick={closeMenus}
                  className="rounded-lg px-4 py-3 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Inicio
                </Link>

                <Link
                  to="/products"
                  onClick={closeMenus}
                  className="rounded-lg px-4 py-3 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Productos
                </Link>

                <Link
                  to="/orders"
                  onClick={closeMenus}
                  className="rounded-lg px-4 py-3 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Mis pedidos
                </Link>

                <Link
                  to="/cart"
                  onClick={closeMenus}
                  className="mt-1 flex items-center justify-between rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
                >
                  <span>🛒 Carrito</span>

                  {totalItems > 0 && (
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-blue-600">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {isAuthenticated && (
                  <div className="mt-2 border-t border-blue-100 pt-3">
                    {/* Mobile user menu */}
                    <button
                      type="button"
                      onClick={() =>
                        setIsUserMenuOpen((open) => !open)
                      }
                      aria-expanded={isUserMenuOpen}
                      className="flex w-full items-center justify-between rounded-lg px-4 py-3 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span>👤</span>
                        <span className="truncate">{user?.name}</span>
                      </span>

                      <span className="ml-2 text-sm">
                        {isUserMenuOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {isUserMenuOpen && (
                      <div className="mt-1 overflow-hidden rounded-lg border border-blue-100 bg-white">
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
                            onClick={closeMenus}
                            className="block px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                          >
                            Administración
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          onClick={closeMenus}
                          className="block px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                        >
                          Perfil
                        </Link>

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
            </div>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
