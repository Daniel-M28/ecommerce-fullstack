import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import jwt from "jsonwebtoken";
import type { LoginUserData} from "../schemas/user.schema.js";
import type { RegisterUserData } from "../schemas/user.schema.js";

//Registrar un nuevo usuario

export async function registerUser(data: RegisterUserData) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new AppError("El email ya está registrado", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

//Iniciar sesión de usuario

export async function loginUser(data: LoginUserData) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });


  if (!user) {
    throw new AppError("Credenciales incorrectas", 401);
  }

  if (!user.active) {
  throw new AppError(
    "La cuenta está desactivada",
    403
  );
}

  const passwordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!passwordValid) {
    throw new AppError("Credenciales incorrectas", 401);
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

//Obtener información del usuario 

export async function getCurrentUser(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {                    // se usa select para no traer el password del usuario
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return user;
}


//Actualizar información del usuario

export async function updateCurrentUser(
  userId: number,
  data: {
    name?: string;
    email?: string;
  }
) {
  if (data.email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: {
          id: userId,
        },
      },
    });

    if (existingUser) {
      throw new AppError(
        "El email ya está registrado",
        409
      );
    }
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

// Cambiar contraseña del usuario

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  const passwordMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!passwordMatch) {
    throw new AppError(
      "La contraseña actual es incorrecta",
      400
    );
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
}


//Obtener todos los usuarios (solo para administradores)

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// Obtener usuario por ID (solo para administradores)

export async function getUserById(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return user;
}

// Actualizar el rol del usuario (solo para administradores)

export async function updateUserRole(
  userId: number,
  role: "USER" | "ADMIN"
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

// Actualizar el estado del usuario (solo para administradores)

export async function updateUserStatus(
  userId: number,
  active: boolean
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      active,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}