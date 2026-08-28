import type { Role } from "../generated/prisma/client.js";


// agregar propiedades personalizadas al objeto Request de Express. 
// En este caso, se agrega la propiedad user que contiene el id y el rol del usuario autenticado.

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: Role;
      };
    }
  }
}

export {};