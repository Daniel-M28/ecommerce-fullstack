import type { NextFunction, Request, Response } from "express";
import { createProductSchema, updateProductSchema } from "../schemas/product.schema.js";
import { createProduct, getProductById, getProducts, updateProduct, deleteProduct,} from "../services/product.service.js";


//Crear un nuevo producto

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

//obtener todos los productos activos

export async function getProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await getProducts();

    return res.status(200).json({
      products,
    });
  } catch (error) {
    next(error);
  }
}

//Obtener un producto por su id

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

//actualizar un producto por su id

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