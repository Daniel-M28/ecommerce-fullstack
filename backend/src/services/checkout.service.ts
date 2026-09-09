import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import type { z } from "zod";
import { checkoutSchema } from "../schemas/checkout.schema.js";

type CheckoutData = z.infer<typeof checkoutSchema>;

export async function checkout(
  userId: number,
  data: CheckoutData
) {
  return prisma.$transaction(async (tx) => { // Iniciar una transacción para asegurar la consistencia de los datos
    // Obtener el carrito con sus productos
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      throw new AppError("Carrito no encontrado", 404);
    }

    if (cart.items.length === 0) {
      throw new AppError("El carrito está vacío", 400);
    }
    
    // Validar productos y stock

    for (const item of cart.items) {
      if (!item.product.active) {
        throw new AppError(
          `El producto "${item.product.name}" ya no está disponible`,
          400
        );
      }

      if (item.quantity > item.product.stock) {
        throw new AppError(
          `No hay suficiente stock para el producto "${item.product.name}"`,
          400
        );
      }
    }

    // Calcular el total directamente desde la base de datos
    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    // Crear la orden
    const order = await tx.order.create({
      data: {
        userId,
        status: "PENDING",
        total,

        shippingName: data.shippingName,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingDepartment: data.shippingDepartment,
        shippingPostalCode: data.shippingPostalCode,
        shippingPhone: data.shippingPhone,

        items: {
          create: cart.items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Descontar stock de los productos y verificar que haya suficiente stock
    for (const item of cart.items) {
  const result = await tx.product.updateMany({
    where: {
      id: item.product.id,
      active: true,
      stock: {
        gte: item.quantity,
      },
    },
    data: {
      stock: {
        decrement: item.quantity,  //decrementa el stock del producto en la cantidad comprada
      },
    },
  });


  if (result.count === 0) {
    throw new AppError(
      `No hay suficiente stock para el producto "${item.product.name}"`,
      400
    );
  }
}

    //  Vaciar el carrito
    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return order;
  });
}