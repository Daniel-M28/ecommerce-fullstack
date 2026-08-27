import { Router } from "express";
import { createProductImageController, getProductImagesController, deleteProductImageController } from "../controllers/product-image.controller.js";

const router = Router();

router.post("/:productId/images", createProductImageController);
router.get("/:productId/images", getProductImagesController);
router.delete("/:productId/images/:imageId", deleteProductImageController);

export default router;  