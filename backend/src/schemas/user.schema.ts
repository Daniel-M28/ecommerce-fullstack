import { z } from "zod";

//esquema para registrar un nuevo usuario

export const registerUserSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),

  email: z
    .string()
    .email("El email no es válido"),

  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña no puede superar los 100 caracteres"),
});

//esquema para iniciar sesión de usuario

export const loginUserSchema = z.object({
  email: z
    .string()
    .email("El email no es válido"),

  password: z
    .string()
    .min(1, "La contraseña es obligatoria"),
});

// Esquema para actualizar la información del usuario

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),          //opcional para que el usuario pueda actualizar solo el nombre si lo desea
  email: z.string().email().optional(),
});

// Esquema para cambiar la contraseña del usuario

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export type RegisterUserData = z.infer<typeof registerUserSchema>;
export type LoginUserData = z.infer<typeof loginUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;


