import { Router } from "express";
import { createCategoryController,
         getCategoriesController,
         getCategoryByIdController, 
         updateCategoryController,
         deleteCategoryController, 
         getAllCategoriesController} from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { activateCategoryController } from "../controllers/category.controller.js";


const router = Router();

router.post("/", authMiddleware, adminMiddleware, createCategoryController);

router.get("/", getCategoriesController);

router.get("/admin",authMiddleware,adminMiddleware,getAllCategoriesController);

router.get("/:id", getCategoryByIdController);

router.patch("/:id", authMiddleware, adminMiddleware, updateCategoryController);

router.patch("/:id/activate", authMiddleware,adminMiddleware, activateCategoryController);

router.delete("/:id", authMiddleware, adminMiddleware, deleteCategoryController);


export default router;