import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import type { z } from "zod";
import {
  addCartItemSchema,
  updateCartItemSchema,
} from "../schemas/cart.schema.js";

type AddCartItemData = z.infer<typeof addCartItemSchema>;
type UpdateCartItemData = z.infer<typeof updateCartItemSchema>;

//Obtiene el carrito del usuario. Si todavía no existe, lo crea.

export async function getOrCreateCart(userId: number) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              categories: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                categories: true,
              },
            },
          },
        },
      },
    });
  }

  return cart;
}

// Agregar un producto al carrito.

export async function addCartItem(
  userId: number,
  data: AddCartItemData
) {
  const product = await prisma.product.findFirst({
    where: {
      id: data.productId,
      active: true,
    },
  });

  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  if (product.stock < data.quantity) {
    throw new AppError(
      "La cantidad solicitada supera el stock disponible",
      400
    );
  }

  const cart = await getOrCreateCart(userId);

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: data.productId,
      },
    },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + data.quantity;

    if (newQuantity > product.stock) {
      throw new AppError(
        "La cantidad total supera el stock disponible",
        400
      );
    }

    return prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: newQuantity,
      },
      include: {
        product: true,
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: data.productId,
      quantity: data.quantity,
    },
    include: {
      product: true,
    },
  });
}

// Actualizar la cantidad de un producto del carrito.

export async function updateCartItem(
  userId: number,
  itemId: number,
  data: UpdateCartItemData
) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new AppError("Carrito no encontrado", 404);
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
    include: {
      product: true,
    },
  });

  if (!item) {
    throw new AppError("Producto no encontrado en el carrito", 404);
  }

  if (!item.product.active) {
    throw new AppError(
      "El producto ya no está disponible",
      400
    );
  }

  if (data.quantity > item.product.stock) {
    throw new AppError(
      "La cantidad solicitada supera el stock disponible",
      400
    );
  }

  return prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity: data.quantity,
    },
    include: {
      product: true,
    },
  });
}

// Eliminar un producto del carrito.

export async function removeCartItem(
  userId: number,
  itemId: number
) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new AppError("Carrito no encontrado", 404);
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  });

  if (!item) {
    throw new AppError("Producto no encontrado en el carrito", 404);
  }

  await prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });
}

//Vacíar el carrito

export async function clearCart(userId: number) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new AppError("Carrito no encontrado", 404);
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });
}