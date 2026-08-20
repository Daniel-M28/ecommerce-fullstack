import { prisma } from "../config/prisma.js";
import { z } from "zod";
import { createCategorySchema, updateCategorySchema, } from "../schemas/category.schema.js";
import { AppError } from "../errors/app-error.js";

type CreateCategoryData = z.infer<typeof createCategorySchema>; //infiere el tipo de datos que se espera en la función createCategory a partir del esquema de validación de Zod


//Funcion para crear una nueva categoria

const createCategory = async (data: CreateCategoryData) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [
        { name: data.name },
        { slug: data.slug },
      ],
    },
  });

  if (existingCategory) {
    throw new AppError(
  "El nombre o slug de la categoría ya existe",
  409
);
}

  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
    },
  });
}

//Funcion para obtener todas las categorias activas ordenadas por nombre
const getCategories = async () => {
  return prisma.category.findMany({
    where: {
      active: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}



const getCategoryById = async (id: number) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      active: true,
    },
  });

  if (!category) {
    throw new AppError("Categoría no encontrada", 404);
  }

  return category;

}

//Funcion para actualizar una categoria existente

type UpdateCategoryData = z.infer<typeof updateCategorySchema>;

const updateCategory = async (
  id: number,
  data: UpdateCategoryData
) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      id,
      active: true,
    },
  });

  if (!existingCategory) {
    throw new AppError("Categoría no encontrada", 404);
  }

  const duplicateCategory = await prisma.category.findFirst({ 
    where: {
      OR: [
        { name: data.name },
        { slug: data.slug },
      ],
      NOT: {                //excluye la categoría que se está actualizando de la búsqueda de duplicados
        id,
      },
    },
  });

  if (duplicateCategory) {
    throw new AppError(
      "El nombre o slug de la categoría ya existe",
      409
    );
  }

  return prisma.category.update({
    where: {
      id,
    },
    data,
  });
}

//Desactivar una categoria existente (soft delete)

const deleteCategory = async (id: number) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      active: true,
    },
  });

  if (!category) {
    throw new AppError("Categoría no encontrada", 404);
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      active: false,
    },
  });
}


export { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory }; 

