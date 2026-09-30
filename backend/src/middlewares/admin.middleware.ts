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
      new AppError(
        "No tienes permisos para realizar esta acción",
        403
      )
    );
  }

  const demoAdminUserId = Number(
    process.env.DEMO_ADMIN_USER_ID
  );

  const isDemoAdmin =
    demoAdminUserId > 0 &&
    req.user.id === demoAdminUserId;

  if (isDemoAdmin) {
    const readOnlyMethods = ["GET", "HEAD", "OPTIONS"];

    if (!readOnlyMethods.includes(req.method)) {
      return next(
        new AppError(
          "La cuenta de demostración es de solo lectura",
          403
        )
      );
    }
  }

  next();
}