import { z } from "zod";

export const productFilterSchema = z
  .object({
    search: z.string().trim().optional(),

    categoryId: z.coerce
      .number()
      .int("El ID de categoría debe ser un número entero")
      .positive("El ID de categoría debe ser mayor que 0")
      .optional(),

    minPrice: z.coerce
      .number()
      .nonnegative("El precio mínimo no puede ser negativo")
      .optional(),

    maxPrice: z.coerce
      .number()
      .nonnegative("El precio máximo no puede ser negativo")
      .optional(),

    inStock: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),

    sort: z
      .enum(["price_asc", "price_desc", "newest", "oldest"])
      .optional(),

    page: z.coerce
      .number()
      .int("La página debe ser un número entero")
      .min(1, "La página debe ser mayor o igual a 1")
      .default(1),

    limit: z.coerce
      .number()
      .int("El límite debe ser un número entero")
      .min(1, "El límite debe ser mayor o igual a 1")
      .max(50, "El límite máximo es 50")
      .default(10),
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message: "El precio mínimo no puede ser mayor que el precio máximo",
      path: ["minPrice"],
    }
  );

export type ProductFilterData = z.infer<typeof productFilterSchema>;