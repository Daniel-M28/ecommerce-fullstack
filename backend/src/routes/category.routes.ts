import { Router } from "express";
import { createCategoryController,
         getCategoriesController,
         getCategoryByIdController, 
         updateCategoryController,
         deleteCategoryController } from "../controllers/category.controller.js";

const router = Router();

router.post("/", createCategoryController);
router.get("/", getCategoriesController);
router.get("/:id", getCategoryByIdController);
router.patch("/:id", updateCategoryController);
router.delete("/:id", deleteCategoryController);
export default router;