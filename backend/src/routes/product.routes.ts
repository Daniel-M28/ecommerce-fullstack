import { Router } from "express";
import { createProductController,
         getProductByIdController, 
         getProductsController,
         updateProductController,
         deleteProductController} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";         

const router = Router();

router.get("/", getProductsController);

router.get("/:id", getProductByIdController);

router.post("/", authMiddleware, adminMiddleware, createProductController);

router.patch("/:id", authMiddleware, adminMiddleware, updateProductController);

router.delete("/:id", authMiddleware, adminMiddleware, deleteProductController);

export default router;