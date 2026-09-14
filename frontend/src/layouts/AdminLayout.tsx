import { Link, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "📊",
    },
    {
      name: "Productos",
      path: "/admin/products",
      icon: "📦",
    },
    {
      name: "Categorías",
      path: "/admin/categories",
      icon: "🏷️",
    },
    {
      name: "Pedidos",
      path: "/admin/orders",
      icon: "🛒",
    },
    {
      name: "Usuarios",
      path: "/admin/users",
      icon: "👥",
    },
  ];

  function isActive(path: string) {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  }

  function handleLogout() {
    logout();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col border-r border-blue-100 bg-white lg:flex">
          <div className="border-b border-blue-100 px-6 py-5">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-blue-800"
            >
              E-commerce
            </Link>

            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
              Administración
            </p>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-blue-100 p-4">
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.name}
              </p>

              <p className="truncate text-xs text-slate-500">
                {user?.email}
              </p>

              <span className="mt-2 inline-block rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                Administrador
              </span>
            </div>

            <div className="mt-3 space-y-1">
              <Link
                to="/"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
              >
                ← Ver tienda
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="block w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-blue-100 bg-white px-6 py-4 lg:hidden">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  to="/admin"
                  className="text-lg font-bold text-blue-800"
                >
                  E-commerce
                </Link>

                <p className="text-xs text-slate-400">
                  Administración
                </p>
              </div>

              <Link
                to="/"
                className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700"
              >
                Tienda
              </Link>
            </div>

            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {navigation.map((item) => {
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {item.icon} {item.name}
                  </Link>
                );
              })}
            </nav>
          </header>

          <main className="flex-1 p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;