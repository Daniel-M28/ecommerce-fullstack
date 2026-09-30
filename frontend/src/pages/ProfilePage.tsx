import {  useState, type FormEvent} from "react";

import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { UserResponse } from "../types/user";

interface UpdateUserResponse {
  message: string;
  user: UserResponse["user"];
}

function ProfilePage() {
  const { user, token } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setProfileMessage("");
    setProfileError("");

    if (!name.trim() || !email.trim()) {
      setProfileError("El nombre y el correo son obligatorios.");
      return;
    }

    try {
      setIsSubmittingProfile(true);

      const data = await apiFetch<UpdateUserResponse>("/users/me", {
        method: "PATCH",
        token: token ?? undefined,
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
        }),
      });

      setName(data.user.name);
      setEmail(data.user.email);
      setProfileMessage(
        data.message || "Perfil actualizado correctamente."
      );
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el perfil."
      );
    } finally {
      setIsSubmittingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Todos los campos son obligatorios.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Las nuevas contraseñas no coinciden.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "La nueva contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    try {
      setIsSubmittingPassword(true);

      const data = await apiFetch<{ message: string }>(
        "/users/me/password",
        {
          method: "PATCH",
          token: token ?? undefined,
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage(
        data.message || "Contraseña actualizada correctamente."
      );
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la contraseña."
      );
    } finally {
      setIsSubmittingPassword(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-160px)] bg-slate-50 py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Mi perfil
          </h1>

          <p className="mt-2 text-slate-500">
            Administra la información y seguridad de tu cuenta.
          </p>
        </div>

        {/* Información personal */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  {user.name}
                </h2>

                <p className="text-sm text-blue-100">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nombre
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Tu nombre"
                  disabled={isSubmittingProfile}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Correo electrónico
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="correo@ejemplo.com"
                  disabled={isSubmittingProfile}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Rol
                </label>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                  {user.role === "ADMIN" ? "Administrador" : "Usuario"}
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  El rol de la cuenta no puede modificarse desde el perfil.
                </p>
              </div>

              {profileError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {profileError}
                </div>
              )}

              {profileMessage && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {profileMessage}
                </div>
              )}

              <div className="flex justify-end border-t border-slate-200 pt-6">
                <button
                  type="submit"
                  disabled={isSubmittingProfile}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingProfile
                    ? "Guardando..."
                    : "Guardar cambios"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Cambio de contraseña */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Cambiar contraseña
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Actualiza la contraseña de acceso a tu cuenta.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Contraseña actual
                </label>

                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Ingresa tu contraseña actual"
                  disabled={isSubmittingPassword}
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nueva contraseña
                </label>

                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Mínimo 6 caracteres"
                  disabled={isSubmittingPassword}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Confirmar nueva contraseña
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Repite la nueva contraseña"
                  disabled={isSubmittingPassword}
                />
              </div>

              {passwordError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {passwordError}
                </div>
              )}

              {passwordMessage && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {passwordMessage}
                </div>
              )}

              <div className="flex justify-end border-t border-slate-200 pt-6">
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingPassword
                    ? "Actualizando..."
                    : "Cambiar contraseña"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;