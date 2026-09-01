import { Router } from "express";
import {getCartController,addCartItemController,updateCartItemController,removeCartItemController,clearCartController,
} from "../controllers/cart.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

// Obtener carrito
router.get("/", getCartController);

// Agregar producto
router.post("/items", addCartItemController);

// Actualizar cantidad
router.patch("/items/:itemId", updateCartItemController);

// Eliminar producto
router.delete("/items/:itemId", removeCartItemController);

// Vaciar carrito
router.delete("/", clearCartController);

export default router;