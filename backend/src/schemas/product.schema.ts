import { z } from "zod";


//Validaciones para la creación de un producto

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(150, "El nombre no puede superar los 150 caracteres"),

  description: z
    .string()
    .max(1000, "La descripción no puede superar los 1000 caracteres")
    .optional(),

  price: z
    .number()
    .positive("El precio debe ser mayor que 0"),

  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),

  sku: z
    .string()
    .min(1, "El SKU es obligatorio")
    .max(100, "El SKU no puede superar los 100 caracteres"),

  active: z
    .boolean()
    .optional(),

  categories: z
    .array(z.number().int().positive())
    .min(1, "El producto debe tener al menos una categoría"),
});

//Validaciones para la actualización de un producto
export const updateProductSchema = createProductSchema.partial(); //.partial() hace que todos los campos del esquema sean opcionales, lo que permite actualizar solo los campos que se deseen cambiar.




    