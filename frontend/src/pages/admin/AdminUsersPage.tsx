import { useEffect, useState } from "react";

import { apiFetch } from "../../api/client";
import type {
  User,
  UsersResponse,
  UserResponse,
} from "../../types/user";

function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  const [editingRoleUser, setEditingRoleUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<User["role"]>("USER");

  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  async function loadUsers() {
    setError("");

    try {
      const data = await apiFetch<UsersResponse>("/users", {
        token: localStorage.getItem("token") ?? undefined,
      });

      setUsers(data.users);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los usuarios."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getRoleLabel(role: User["role"]) {
    return role === "ADMIN" ? "Administrador" : "Usuario";
  }

  function getRoleClasses(role: User["role"]) {
    return role === "ADMIN"
      ? "bg-blue-100 text-blue-700"
      : "bg-slate-100 text-slate-700";
  }

  function getStatusClasses(active: boolean) {
    return active
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  }

  function openRoleEditor(user: User) {
    setEditingRoleUser(user);
    setSelectedRole(user.role);
    setError("");
    setStatusMessage("");
  }

  function closeRoleEditor() {
    if (updatingUserId !== null) return;

    setEditingRoleUser(null);
    setSelectedRole("USER");
  }

  async function handleRoleUpdate() {
    if (!editingRoleUser) return;

    if (selectedRole === editingRoleUser.role) {
      closeRoleEditor();
      return;
    }

    setError("");
    setStatusMessage("");
    setUpdatingUserId(editingRoleUser.id);

    try {
      const data = await apiFetch<UserResponse>(
        `/users/${editingRoleUser.id}/role`,
        {
          method: "PATCH",
          token: localStorage.getItem("token") ?? undefined,
          body: JSON.stringify({
            role: selectedRole,
          }),
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === data.user.id ? data.user : user
        )
      );

      setStatusMessage(
        `El rol de ${data.user.name} fue actualizado a "${getRoleLabel(
          data.user.role
        )}".`
      );

      setEditingRoleUser(null);
      setSelectedRole("USER");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el rol del usuario."
      );
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleStatusChange(user: User) {
    const newActiveStatus = !user.active;

    setError("");
    setStatusMessage("");
    setUpdatingUserId(user.id);

    try {
      const data = await apiFetch<UserResponse>(
        `/users/${user.id}/status`,
        {
          method: "PATCH",
          token: localStorage.getItem("token") ?? undefined,
          body: JSON.stringify({
            active: newActiveStatus,
          }),
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === data.user.id ? data.user : currentUser
        )
      );

      setStatusMessage(
        `El usuario ${data.user.name} ahora está ${
          data.user.active ? "activo" : "inactivo"
        }.`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el estado del usuario."
      );
    } finally {
      setUpdatingUserId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Encabezado */}

      <div>
        <p className="text-sm font-semibold text-blue-600">
          Administración
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Usuarios
        </h1>

        <p className="mt-2 text-slate-500">
          Consulta y administra los usuarios registrados en la tienda.
        </p>
      </div>

      {/* Mensajes */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {statusMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {statusMessage}
        </div>
      )}

      {/* Tabla */}

      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div className="border-b border-blue-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Usuarios registrados
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {users.length}{" "}
            {users.length === 1
              ? "usuario registrado"
              : "usuarios registrados"}
          </p>
        </div>

        {users.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500">
              No hay usuarios registrados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="border-b border-blue-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Usuario
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Rol
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Estado
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Registro
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-blue-50">
                {users.map((user) => {
                  const isUpdating = updatingUserId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="transition hover:bg-blue-50/40"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {user.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            ID #{user.id}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleClasses(
                            user.role
                          )}`}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            user.active
                          )}`}
                        >
                          {user.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {/* Editar rol */}

                          <button
                            type="button"
                            onClick={() => openRoleEditor(user)}
                            disabled={isUpdating}
                            className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Editar rol
                          </button>

                          {/* Activar / desactivar */}

                          <button
                            type="button"
                            onClick={() => handleStatusChange(user)}
                            disabled={isUpdating}
                            className={`rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              user.active
                                ? "border-red-200 bg-white text-red-700 hover:bg-red-50"
                                : "border-green-200 bg-white text-green-700 hover:bg-green-50"
                            }`}
                          >
                            {isUpdating
                              ? "Actualizando..."
                              : user.active
                                ? "Desactivar"
                                : "Activar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal editar rol */}

      {editingRoleUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={closeRoleEditor}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-blue-100 px-6 py-5">
              <p className="text-sm font-semibold text-blue-600">
                Administración
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Editar rol
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Cambia el rol asignado a este usuario.
              </p>
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-xl border border-blue-100 bg-slate-50 p-4">
                <p className="font-semibold text-slate-800">
                  {editingRoleUser.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {editingRoleUser.email}
                </p>
              </div>

              <div>
                <label
                  htmlFor="user-role"
                  className="block text-sm font-medium text-slate-700"
                >
                  Rol
                </label>

                <select
                  id="user-role"
                  value={selectedRole}
                  onChange={(event) =>
                    setSelectedRole(
                      event.target.value as User["role"]
                    )
                  }
                  disabled={updatingUserId === editingRoleUser.id}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-blue-100 px-6 py-4">
              <button
                type="button"
                onClick={closeRoleEditor}
                disabled={updatingUserId === editingRoleUser.id}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleRoleUpdate}
                disabled={updatingUserId === editingRoleUser.id}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updatingUserId === editingRoleUser.id
                  ? "Guardando..."
                  : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsersPage;