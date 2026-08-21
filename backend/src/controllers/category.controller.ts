import type { NextFunction, Request, Response } from "express";
import { createCategorySchema ,  updateCategorySchema} from "../schemas/category.schema.js";
import { AppError } from "../errors/app-error.js";
import { ZodError } from "zod";
import { createCategory, 
         getCategories, 
         getCategoryById,
         updateCategory, 
         deleteCategory} from "../services/category.service.js";
 

//Crear una nueva categoria

export async function createCategoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createCategorySchema.parse(req.body);

    const category = await createCategory(data);

    return res.status(201).json({
      message: "Categoría creada correctamente",
      category,
    });
  } catch (error) {
    next(error);
  }
}


// Obtener todas las categorias activas ordenadas por nombre

export async function getCategoriesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await getCategories();

    return res.status(200).json({
      categories,
    });
  } catch (error) {
    next(error);
  }

}



// Obtener una categoria por su id

export async function getCategoryByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "El ID de la categoría debe ser un número",
      });
    }

    const category = await getCategoryById(id);

    return res.status(200).json({
      category,
    });
  } catch (error) {
    next(error);
  }
}


// Actualizar una categoria 

export async function updateCategoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "El ID de la categoría debe ser un número",
      });
    }

    const data = updateCategorySchema.parse(req.body);

    const category = await updateCategory(id, data);

    return res.status(200).json({
      message: "Categoría actualizada correctamente",
      category,
    });
  } catch (error) {
    next(error);
  }
}

//Desactivar una categoria existente

export async function deleteCategoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "El ID de la categoría debe ser un número",
      });
    }

    await deleteCategory(id);

    return res.status(200).json({
      message: "Categoría eliminada correctamente",
    });
  } catch (error) {
  next(error);
} 
}