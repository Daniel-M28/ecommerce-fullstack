import { Router } from "express";
import { createProductController, getProductByIdController, getProductsController, updateProductController, deleteProductController} from "../controllers/product.controller.js";

const router = Router();

router.post("/", createProductController);
router.get("/", getProductsController);
router.patch("/:id", updateProductController);
router.get("/:id", getProductByIdController);
router.delete("/:id", deleteProductController);
export default router;