import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import type { z } from "zod";
import { createProductSchema,updateProductSchema, } from "../schemas/product.schema.js";

type CreateProductData = z.infer<typeof createProductSchema>; //infiere el tipo de datos que se espera en la función createProduct a partir del esquema de validación de Zod
type UpdateProductData = z.infer<typeof updateProductSchema>; //infiere el tipo de datos que se espera en la función updateProduct a partir del esquema de validación de Zod

//Funcion para crear un nuevo producto

export async function createProduct(data: CreateProductData) {
  const existingProduct = await prisma.product.findFirst({
    where: {
      sku: data.sku,
    },
  });

  if (existingProduct) {
    throw new AppError("El SKU ya existe", 409);
  }

  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: data.categories,
      },
      active: true,
    },
  });

  if (categories.length !== data.categories.length) {
    throw new AppError(
      "Una o más categorías no existen o están inactivas",
      400
    );
  }

  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      sku: data.sku,
      active: data.active ?? true,

      categories: {
        connect: data.categories.map((categoryId) => ({
          id: categoryId,
        })),
      },
    },
    include: {
      categories: true,
    },
  });

  return product;
}

//obtener todos los productos activos y filtros de busqueda

export async function getProducts(filters?: {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: "price_asc" | "price_desc" | "newest" | "oldest";
  page?: number;
  limit?: number;
}) {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;

  const skip = (page - 1) * limit;

  const where = {
    active: true,

    ...(filters?.search && {
      name: {
        contains: filters.search,
        mode: "insensitive" as const,
      },
    }),

    ...(filters?.categoryId && {
      categories: {
        some: {
          id: filters.categoryId,
          active: true,
        },
      },
    }),

    ...(filters?.minPrice !== undefined && {
      price: {
        gte: filters.minPrice,
      },
    }),

    ...(filters?.maxPrice !== undefined && {
      price: {
        lte: filters.maxPrice,
      },
    }),

    ...(filters?.inStock !== undefined && {
  stock: filters.inStock
    ? { gt: 0 }
    : { equals: 0 },
}),
}

  const orderBy =
    filters?.sort === "price_asc"
      ? { price: "asc" as const }
      : filters?.sort === "price_desc"
        ? { price: "desc" as const }
        : filters?.sort === "oldest"
          ? { createdAt: "asc" as const }
          : { createdAt: "desc" as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        categories: true,
        images: true,
      },
      orderBy,
      skip,
      take: limit,
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

//Obtener un producto por su id

export async function getProductById(id: number) {
  const product = await prisma.product.findFirst({
    where: {
      id,
      active: true,
    },
    include: {
      categories: true,
      images: true,
    },
  });

  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  return product;
}

//actualizar un producto por su id

export async function updateProduct(
  id: number,
  data: UpdateProductData
) {
  const product = await prisma.product.findFirst({
    where: {
      id,
      active: true,
    },
  });

  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  if (data.sku && data.sku !== product.sku) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        sku: data.sku,
        id: {
          not: id,
        },
      },
    });

    if (existingProduct) {
      throw new AppError("El SKU ya existe", 409);
    }
  }

  if (data.categories) {
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: data.categories,
        },
        active: true,
      },
    });

    if (categories.length !== data.categories.length) {
      throw new AppError(
        "Una o más categorías no existen o están inactivas",
        400
      );
    }
  }

  const productUpdated = await prisma.product.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      sku: data.sku,
      active: data.active,

      ...(data.categories && {
        categories: {
          set: data.categories.map((categoryId) => ({
            id: categoryId,
          })),
        },
      }),
    },
    include: {
      categories: true,
      images: true,
    },
  });

  return productUpdated;
}

//desactivar un producto

export async function deleteProduct(id: number) {
  const product = await prisma.product.findFirst({
    where: {
      id,
      active: true,
    },
  });

  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  await prisma.product.update({
    where: {
      id,
    },
    data: {
      active: false,
    },
  });
}