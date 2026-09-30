import type { NextFunction, Request, Response } from "express";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";
import {
  createProduct,
  getProductById,
  getProducts,
  getAllProducts,
  updateProduct,
  deleteProduct,
  activateProduct,
} from "../services/product.service.js";
import { updateUserStatus } from "../services/user.service.js";
import { updateUserStatusSchema } from "../schemas/user.schema.js";
import { productFilterSchema } from "../schemas/product-filter.schema.js";
import { AppError } from "../errors/app-error.js";

// Crear un nuevo producto

export async function createProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createProductSchema.parse(req.body);

    const product = await createProduct(data);

    return res.status(201).json({
      message: "Producto creado correctamente",
      product,
    });
  } catch (error) {
    next(error);
  }
}

// obtener todos los productos activos y filtros de busqueda

export async function getProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filters = productFilterSchema.parse(req.query);

    const result = await getProducts(filters);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

// Obtener todos los productos para administracion

export async function getAllProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filters = productFilterSchema.parse(req.query);

    const result = await getAllProducts(filters);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

// Obtener un producto por su id

export async function getProductByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "El ID del producto debe ser un número",
      });
    }

    const product = await getProductById(id);

    return res.status(200).json({
      product,
    });
  } catch (error) {
    next(error);
  }
}

// actualizar un producto por su id

export async function updateProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "El ID del producto debe ser un número",
      });
    }

    const data = updateProductSchema.parse(req.body);

    const product = await updateProduct(id, data);

    return res.status(200).json({
      message: "Producto actualizado correctamente",
      product,
    });
  } catch (error) {
    next(error);
  }
}

// Desactivar un producto

export async function deleteProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "El ID del producto debe ser un número",
      });
    }

    await deleteProduct(id);

    return res.status(200).json({
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
}

// Activar un producto

export async function activateProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "El ID del producto debe ser un número",
      });
    }

    const product = await activateProduct(id);

    return res.status(200).json({
      message: "Producto activado correctamente",
      product,
    });
  } catch (error) {
    next(error);
  }
}



