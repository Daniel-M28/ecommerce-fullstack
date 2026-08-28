import type { NextFunction, Request, Response } from "express";
import {createOrderSchema, updateOrderStatusSchema} from "../schemas/order.schema.js";
import { createOrder,  getAllOrders, getUserOrders, getUserOrder, cancelOrder, updateOrderStatus, } from "../services/order.service.js";
import { AppError } from "../errors/app-error.js";


//Crear una orden

export async function createOrderController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createOrderSchema.parse(req.body);

    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const order = await createOrder(
      req.user.id,
      data
    );

    return res.status(201).json({
      message: "Orden creada correctamente",
      order,
    });
  } catch (error) {
    next(error);
  }
}

//Obtener las órdenes de un usuario

export async function getUserOrdersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const orders = await getUserOrders(req.user.id);

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    next(error);
  }
}


//Obtener una orden específica de un usuario

export async function getUserOrderController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const orderId = Number(req.params.orderId);

    if (Number.isNaN(orderId)) {
      throw new AppError("El ID de la orden debe ser un número", 400);
    }

    const order = await getUserOrder(
      req.user.id,
      orderId
    );

    return res.status(200).json({
      order,
    });
  } catch (error) {
    next(error);
  }
}

//Cancelar una orden específica de un usuario

export async function cancelOrderController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const orderId = Number(req.params.orderId);

    if (Number.isNaN(orderId)) {
      throw new AppError(
        "El ID de la orden debe ser un número",
        400
      );
    }

    const order = await cancelOrder(
      req.user.id,
      orderId
    );

    return res.status(200).json({
      message: "Orden cancelada correctamente",
      order,
    });
  } catch (error) {
    next(error);
  }
}

//Obtener todas las órdenes (solo para administradores)

export async function getAllOrdersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orders = await getAllOrders();

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    next(error);
  }
}


//Actualizar el estado de una orden (solo para administradores)

export async function updateOrderStatusController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orderId = Number(req.params.orderId);

    if (Number.isNaN(orderId)) {
      throw new AppError(
        "El ID de la orden debe ser un número",
        400
      );
    }

    const data = updateOrderStatusSchema.parse(req.body);

    const order = await updateOrderStatus(
      orderId,
      data.status
    );

    return res.status(200).json({
      message: "Estado de la orden actualizado correctamente",
      order,
    });
  } catch (error) {
    next(error);
  }
}