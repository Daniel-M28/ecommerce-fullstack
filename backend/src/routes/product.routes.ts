import { Router } from "express";
import { createProductController,
         getProductByIdController, 
         getProductsController,
         updateProductController,
         deleteProductController,
         getAllProductsController,
         activateProductController} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware} from "../middlewares/admin.middleware.js";         

const router = Router();

router.get("/", getProductsController);

router.get("/admin",authMiddleware,adminMiddleware,getAllProductsController);

router.get("/:id", getProductByIdController);

router.post("/", authMiddleware, adminMiddleware, createProductController);

router.patch("/:id/activate",authMiddleware,adminMiddleware,activateProductController);

router.patch("/:id", authMiddleware, adminMiddleware, updateProductController);

router.delete("/:id", authMiddleware, adminMiddleware, deleteProductController);

export default router;