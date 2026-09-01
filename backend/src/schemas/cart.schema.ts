import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z
    .number()
    .int("El ID del producto debe ser un número entero")
    .positive("El ID del producto debe ser mayor que 0"),

  quantity: z
    .number()
    .int("La cantidad debe ser un número entero")       //agregar producto al carrito
    .positive("La cantidad debe ser mayor que 0"),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int("La cantidad debe ser un número entero")   // actualizar cantidad de producto en el carrito
    .positive("La cantidad debe ser mayor que 0"),
});