function AdminDashboardPage() {
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

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Productos
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            —
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Próximamente
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Categorías
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            —
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Próximamente
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Pedidos
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            —
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Próximamente
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Usuarios
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            —
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Próximamente
          </p>
        </div>
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