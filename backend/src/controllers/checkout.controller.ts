import type { NextFunction, Request, Response } from "express";

import { checkoutSchema } from "../schemas/checkout.schema.js";
import { checkout } from "../services/checkout.service.js";

export async function checkoutController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = checkoutSchema.parse(req.body);

    const order = await checkout(req.user!.id, data);

    return res.status(201).json({
      message: "Orden creada correctamente",
      order,
    });
  } catch (error) {
    next(error);
  }
}