import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import {getOrCreateCart,addCartItem, updateCartItem,removeCartItem, clearCart,} from "../services/cart.service.js";
import {addCartItemSchema, updateCartItemSchema,} from "../schemas/cart.schema.js";


//Obtener el carrito del usuario. Si no existe, lo crea.

export async function getCartController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cart = await getOrCreateCart(req.user!.id);

    return res.status(200).json({
      cart,
    });
  } catch (error) {
    next(error);
  }
}

// Agregar un producto al carrito.

export async function addCartItemController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = addCartItemSchema.parse(req.body);

    const item = await addCartItem(req.user!.id, data);

    return res.status(201).json({
      message: "Producto agregado al carrito correctamente",
      item,
    });
  } catch (error) {
    next(error);
  }
}

//Actualizar la cantidad de un producto del carrito.

export async function updateCartItemController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const itemId = Number(req.params.itemId);

    if (Number.isNaN(itemId)) {
      return res.status(400).json({
        message: "El ID del producto del carrito debe ser un número",
      });
    }

    const data = updateCartItemSchema.parse(req.body);

    const item = await updateCartItem(
      req.user!.id,
      itemId,
      data
    );

    return res.status(200).json({
      message: "Cantidad actualizada correctamente",
      item,
    });
  } catch (error) {
    next(error);
  }
}

//Eliminar un producto del carrito.

export async function removeCartItemController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const itemId = Number(req.params.itemId);

    if (Number.isNaN(itemId)) {
      return res.status(400).json({
        message: "El ID del producto del carrito debe ser un número",
      });
    }

    await removeCartItem(req.user!.id, itemId);

    return res.status(200).json({
      message: "Producto eliminado del carrito correctamente",
    });
  } catch (error) {
    next(error);
  }
}

// Vaciar el carrito.

export async function clearCartController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await clearCart(req.user!.id);

    return res.status(200).json({
      message: "Carrito vaciado correctamente",
    });
  } catch (error) {
    next(error);
  }
}