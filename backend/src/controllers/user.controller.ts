import type { NextFunction, Request, Response } from "express";
import { registerUserSchema, updateUserRoleSchema } from "../schemas/user.schema.js";
import { registerUser,  loginUser, getCurrentUser, updateCurrentUser, changePassword, getAllUsers, getUserById, updateUserRole} from "../services/user.service.js";
import { loginUserSchema , updateUserSchema, changePasswordSchema} from "../schemas/user.schema.js";
import { AppError } from "../errors/app-error.js";


//Registro de usuario
export async function registerUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = registerUserSchema.parse(req.body);

    const user = await registerUser(data);

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user,
    });
  } catch (error) {
    next(error);
  }
}

//login de usuario

export async function loginUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("BODY LOGIN:", req.body);
    const data = loginUserSchema.parse(req.body);

    const result = await loginUser(data);

    return res.status(200).json({
      message: "Login exitoso",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }



    const user = await getCurrentUser(req.user.id);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
}

//Actualizar información del usuario

export async function updateCurrentUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const data = updateUserSchema.parse(req.body);

    const user = await updateCurrentUser(
      req.user.id,
      data
    );

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      user,
    });
  } catch (error) {
    next(error);
  }
}

//Cambiar contraseña del usuario

export async function changePasswordController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const data = changePasswordSchema.parse(req.body);

    await changePassword(
      req.user.id,
      data.currentPassword,
      data.newPassword
    );

    return res.status(200).json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    next(error);
  }
}

// Obtener todos los usuarios (solo para administradores)

export async function getAllUsersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      users,
    });
  } catch (error) {
    next(error);
  }
}

// Obtener un usuario por su id (solo para administradores)

export async function getUserByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Number(req.params.userId);

    if (Number.isNaN(userId)) {
      throw new AppError("ID de usuario inválido", 400);
    }

    const user = await getUserById(userId);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
}

// Actualizar el rol de un usuario (solo para administradores)

export async function updateUserRoleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Number(req.params.userId);

    if (Number.isNaN(userId)) {
      throw new AppError("ID de usuario inválido", 400);
    }

    const data = updateUserRoleSchema.parse(req.body);

    const user = await updateUserRole(userId, data.role);

    return res.status(200).json({
      message: "Rol actualizado correctamente",
      user,
    });
  } catch (error) {
    next(error);
  }
}
