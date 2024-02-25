import { Router } from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";

const productsRoutes = Router();

productsRoutes.get("/", getProducts);

productsRoutes.get("/:pid", getProductById);

productsRoutes.post("/", addProduct);

productsRoutes.put("/:pid", updateProduct);

productsRoutes.delete("/:pid", deleteProduct);

export default productsRoutes;
