import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";

const errorMiddleware = (
  error: unknown,
  req: Request,       //parametros que identifican como middleware de error
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Datos inválidos",
      errors: error.issues,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: "Error interno del servidor",
  });
}

export { errorMiddleware };