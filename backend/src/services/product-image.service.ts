import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import type { z } from "zod";
import { createProductImageSchema } from "../schemas/product-image.schema.js";

type CreateProductImageData = z.infer<typeof createProductImageSchema>;

//crear imagen 

export async function createProductImage(
  productId: number,
  data: CreateProductImageData
) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      active: true,
    },
  });

  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  const image = await prisma.productImage.create({
    data: {
      productId,                         //la relacion entre la imagen y el producto se establece 
      url: data.url,                     //mediante el campo productId
    },
  });

  return image;
}

//obtener todas las imagenes de un producto

export async function getProductImages(productId: number) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      active: true,
    },
  });

  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  return prisma.productImage.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function deleteProductImage(
  productId: number,
  imageId: number
) {
  const image = await prisma.productImage.findFirst({
    where: {
      id: imageId,
      productId,
    },
  });

  if (!image) {
    throw new AppError("Imagen no encontrada", 404);
  }

  await prisma.productImage.delete({
    where: {
      id: imageId,
    },
  });
}