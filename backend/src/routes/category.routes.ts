import { Router } from "express";
import { createCategoryController,
         getCategoriesController,
         getCategoryByIdController, 
         updateCategoryController,
         deleteCategoryController } from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";


const router = Router();

router.post("/", authMiddleware, adminMiddleware, createCategoryController);
router.get("/", getCategoriesController);
router.get("/:id", getCategoryByIdController);
router.patch("/:id", authMiddleware, adminMiddleware, updateCategoryController);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategoryController);
export default router;