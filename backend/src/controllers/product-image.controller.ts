import type { NextFunction, Request, Response } from "express";
import { createProductImageSchema } from "../schemas/product-image.schema.js";
import { createProductImage, getProductImages,deleteProductImage} from "../services/product-image.service.js";

//crear una nueva imagen para un producto

export async function createProductImageController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message: "El ID del producto debe ser un número",
      });
    }

    const data = createProductImageSchema.parse(req.body);

    const image = await createProductImage(productId, data);

    return res.status(201).json({
      message: "Imagen agregada correctamente",
      image,
    });
  } catch (error) {
    next(error);
  }
}

//obtener todas las imagenes de un producto

export async function getProductImagesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message: "El ID del producto debe ser un número",
      });
    }

    const images = await getProductImages(productId);

    return res.status(200).json({
      images,
    });
  } catch (error) {
    next(error);
  }
}

//borrar una imagen de un producto

export async function deleteProductImageController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = Number(req.params.productId);
    const imageId = Number(req.params.imageId);

    if (Number.isNaN(productId) || Number.isNaN(imageId)) {
      return res.status(400).json({
        message: "Los IDs deben ser números",
      });
    }

    await deleteProductImage(productId, imageId);

    return res.status(200).json({
      message: "Imagen eliminada correctamente",
    });
  } catch (error) {
    next(error);
  }
}