import { Router } from "express";
import { createProductImageController, getProductImagesController, deleteProductImageController } from "../controllers/product-image.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";



const router = Router();

router.post("/:productId/images", authMiddleware, adminMiddleware, createProductImageController);
router.get("/:productId/images", getProductImagesController);
router.delete("/:productId/images/:imageId", authMiddleware, adminMiddleware, deleteProductImageController);

export default router;  