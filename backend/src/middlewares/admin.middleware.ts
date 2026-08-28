import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";

export function adminMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(
      new AppError("Usuario no autenticado", 401)
    );
  }

  if (req.user.role !== "ADMIN") {
    return next(
      new AppError("No tienes permisos para realizar esta acción", 403)
    );
  }

  next();
}