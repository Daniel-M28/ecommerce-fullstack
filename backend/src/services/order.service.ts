import { OrderStatus, Prisma } from "../generated/prisma/client.js";
import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import type { CreateOrderData } from "../schemas/order.schema.js";

export async function createOrder(
  userId: number,
  data: CreateOrderData
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  const productIds = data.items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
      active: true,
    },
  });

  if (products.length !== productIds.length) {
    throw new AppError(
      "Uno o más productos no existen o están inactivos",
      400
    );
  }

  let total = new Prisma.Decimal(0);  //para almacenar el total de la orden, se inicializa en 0

  const orderItems = data.items.map((item) => {
    const product = products.find(
      (product) => product.id === item.productId
    );

    if (!product) {
      throw new AppError("Producto no encontrado", 404);
    }

    if (item.quantity > product.stock) {
      throw new AppError(
        `Stock insuficiente para el producto: ${product.name}`,
        400
      );
    }

    total = total.plus(
      product.price.mul(item.quantity)
    );

    return {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: item.quantity,
    };
  });

  const order = await prisma.$transaction(async (tx) => { //prisma transaction para asegurar que todas las operaciones  
    const order = await tx.order.create({                 // se realicen de manera atómica,osea que si alguna falla, 
      data: {                                             //se revierten todas las operaciones
        userId,
        total,
        shippingName: data.shippingName,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingDepartment: data.shippingDepartment,
        shippingPostalCode: data.shippingPostalCode,
        shippingPhone: data.shippingPhone,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    for (const item of data.items) {
      const product = products.find(
        (product) => product.id === item.productId
      );

      if (!product) {
        throw new AppError("Producto no encontrado", 404);
      }

      const updated = await tx.product.updateMany({ //updateMany se usa para evitar errores de concurrencia, 
        where: {                                   //ya que si dos usuarios intentan comprar el mismo producto 
          id: product.id,                           //al mismo tiempo, solo uno de ellos podrá actualizar el stock
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (updated.count === 0) {
        throw new AppError(
          `Stock insuficiente para el producto: ${product.name}`,
          400
        );
      }
    }

    return order;
  });

  return order;
}


// Obtener todas las órdenes de un usuario específico

export async function getUserOrders(userId: number) {
  return prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

//Obtener una orden específica de un usuario

export async function getUserOrder(
  userId: number,
  orderId: number
) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new AppError("Orden no encontrada", 404);
  }

  return order;
}

//Cancelar una orden específica de un usuario

export async function cancelOrder(
  userId: number,
  orderId: number
) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,                    //un usuario no puede cancelar una orden que pertenece a otra persona.
      userId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new AppError("Orden no encontrada", 404);
  }

  if (order.status !== "PENDING") {                     //Solo las órdenes PENDING se pueden cancelar
    throw new AppError(
      "La orden no puede ser cancelada en su estado actual",
      400
    );
  }

  return prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    const cancelledOrder = await tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "CANCELLED",
      },
      include: {
        items: true,
      },
    });

    return cancelledOrder;
  });
}

//Obtener todas las órdenes de todos los usuarios (solo para administradores)

export async function getAllOrders() {
  return prisma.order.findMany({
    include: {                                  // Incluir información báscica del usuario sin password
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

//Actualizar el estado de una orden (solo para administradores)

export async function updateOrderStatus(
  orderId: number,
  newStatus: OrderStatus
) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new AppError("Orden no encontrada", 404);
  }

  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["PAID", "CANCELLED"],
    PAID: ["PROCESSING"],
    PROCESSING: ["SHIPPED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (!allowedTransitions[order.status].includes(newStatus)) {
    throw new AppError(
      `No se puede cambiar la orden de ${order.status} a ${newStatus}`,
      400
    );
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: newStatus,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: true,
    },
  });
}