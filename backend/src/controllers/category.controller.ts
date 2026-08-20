import type { Request, Response } from "express";
import { createCategorySchema ,  updateCategorySchema} from "../schemas/category.schema.js";
import { AppError } from "../errors/app-error.js";
import { ZodError } from "zod";
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory} from "../services/category.service.js";



//Crear una nueva categoria

export async function createCategoryController(
  req: Request,
  res: Response
) {
  try {
    const data = createCategorySchema.parse(req.body); //aqui zod valida los datos que vienen en el body de la request y si no son validos lanza un error

    const category = await createCategory(data);

    return res.status(201).json({
      message: "Categoría creada correctamente",
      category,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Datos inválidos",
      errors: error.issues,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: "Error interno del servidor",
  });
}
}



// Obtener todas las categorias activas ordenadas por nombre

export async function getCategoriesController(
  req: Request,
  res: Response
) {
  try {
    const categories = await getCategories();

    return res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}



// Obtener una categoria por su id

export async function getCategoryByIdController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id); // Convertir el parámetro de la ruta a número

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "El ID de la categoría debe ser un número",
      });
    }

    const category = await getCategoryById(id); // Llamar a la función del servicio para obtener la categoría por su ID

    return res.status(200).json({
      category,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: error.issues,
      });
    }

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}


// Actualizar una categoria existente

export async function updateCategoryController(
  req: Request,
  res: Response
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
    console.error(error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: error.issues,
      });
    }

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

//Desactivar una categoria existente

export async function deleteCategoryController(
  req: Request,
  res: Response
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
    console.error(error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
} 