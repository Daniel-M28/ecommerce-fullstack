import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error.js";
import type { Role } from "../generated/prisma/client.js";

interface JwtPayload {  // Para que TypeScript reconozca que el payload del token tiene las propiedades userId y role, y nos permite acceder a ellas sin errores de tipo.
  userId: number;       //  propiedades userId y role, y nos permite acceder a ellas sin errores de tipo.
  role: Role;
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError("Token de autenticación requerido", 401);
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      throw new AppError("Formato de token inválido", 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError("Token inválido o expirado", 401));
  }
}