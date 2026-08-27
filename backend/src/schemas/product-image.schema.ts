import { z } from "zod";

export const createProductImageSchema = z.object({
  url: z
    .string()
    .url("La URL de la imagen no es válida")
    .max(500, "La URL no puede superar los 500 caracteres"),
});