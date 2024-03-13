import {
  getProductsService,
  getProductByIdService,
  addProductService,
  updateProductService,
  deleteProductService,
} from "../services/products.service.js";

import CustomError from "../errors/CustomError.js";
import { productErrorTypeInfo } from "../errors/ProductErrorInfo.js";
import ErrorEnum from "../errors/ErrorEnum.js";

export const getProducts = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort = "", query = "" } = req.query;
    const result = await getProductsService(limit, page, sort, query);
    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const id = req.params.pid;
    const product = await getProductByIdService(id);
    if (!product)
      await CustomError.createError({
        name: "Product search error",
        cause: `Error getProductById(): Product Id '${id}' Not found`,
        message: "Error trying to find Product",
        code: ErrorEnum.NOT_FOUND,
      });
    res.send({ status: "success", payload: product });
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const { title, description, code, price, status, stock, category } = req.body;

    if (
      !title ||
      title.trim().length === 0 ||
      !description ||
      description.trim().length === 0 ||
      !code ||
      code.trim().length === 0 ||
      !category ||
      category.trim().length === 0 ||
      !status ||
      typeof status !== "boolean" ||
      !price ||
      typeof price !== "number" ||
      price < 0 ||
      !stock ||
      typeof stock !== "number" ||
      stock < 0
    )
      await CustomError.createError({
        name: "Product creation error",
        cause: `Error addProduct(): ${productErrorTypeInfo(req.body)}`,
        message: "Error trying to create Product",
        code: ErrorEnum.INVALID_TYPE_ERROR,
      });

    const result = await addProductService(req.body);
    if (result.status === "error") return res.status(400).send(result);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
  // finally {
  //   req.app.io.emit("products", await getProductsService(1000, 1, "", ""));
  // }
};

export const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.pid;

    const { title, description, code, price, status, stock, category } = req.body;

    if (
      !title ||
      title.trim().length === 0 ||
      !description ||
      description.trim().length === 0 ||
      !code ||
      code.trim().length === 0 ||
      !category ||
      category.trim().length === 0 ||
      !status ||
      typeof status !== "boolean" ||
      !price ||
      typeof price !== "number" ||
      price < 0 ||
      !stock ||
      typeof stock !== "number" ||
      stock < 0
    )
      await CustomError.createError({
        name: "Product update error",
        cause: `Error updateProduct(): ${productErrorTypeInfo(req.body)}`,
        message: "Error trying to update Product",
        code: ErrorEnum.INVALID_TYPE_ERROR,
      });

    const result = await updateProductService({ ...req.body, id });

    if (result.status === "error") {
      if (result.error?.includes("Not found")) {
        await CustomError.createError({
          name: "Product update error",
          cause: `Error updateProduct(): Product Id '${id}' Not found`,
          message: "Error trying to update Product",
          code: ErrorEnum.NOT_FOUND,
        });
      } else {
        await CustomError.createError({
          name: "Product update error",
          cause: `Error updateProduct(): ${result.error}`,
          message: "Error trying to update Product",
          code: ErrorEnum.DATABASE_ERROR,
        });
      }
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
  // finally {
  //   req.app.io.emit("products", await getProductsService(1000, 1, "", ""));
  // }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.pid;
    const result = await deleteProductService(id);
    if (result.status === "error") {
      if (result.error?.includes("Not found")) {
        await CustomError.createError({
          name: "Product delete error",
          cause: `Error deleteProduct(): Product Id '${id}' Not found`,
          message: "Error trying to delete Product",
          code: ErrorEnum.NOT_FOUND,
        });
      } else {
        await CustomError.createError({
          name: "Product delete error",
          cause: `Error deleteProduct(): ${result.error}`,
          message: "Error trying to delete Product",
          code: ErrorEnum.DATABASE_ERROR,
        });
      }
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
  // finally {
  //   req.app.io.emit("products", await getProductsService(1000, 1, "", ""));
  // }
};
