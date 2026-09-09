import { z } from "zod";

export const checkoutSchema = z.object({
  shippingName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(150, "El nombre no puede superar los 150 caracteres"),

  shippingAddress: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(250, "La dirección no puede superar los 250 caracteres"),

  shippingCity: z
    .string()
    .min(2, "La ciudad debe tener al menos 2 caracteres")
    .max(100, "La ciudad no puede superar los 100 caracteres"),

  shippingDepartment: z
    .string()
    .min(2, "El departamento debe tener al menos 2 caracteres")
    .max(100, "El departamento no puede superar los 100 caracteres"),

  shippingPostalCode: z
    .string()
    .max(20, "El código postal no puede superar los 20 caracteres")
    .optional(),

  shippingPhone: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 caracteres")
    .max(20, "El teléfono no puede superar los 20 caracteres"),
});