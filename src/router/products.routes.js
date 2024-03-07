import { Router } from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { isAdmin } from "../middlewares/auth.js";

const productsRoutes = Router();

productsRoutes.get("/", getProducts);

productsRoutes.get("/:pid", getProductById);

productsRoutes.post("/", isAdmin, addProduct);

productsRoutes.put("/:pid", isAdmin, updateProduct);

productsRoutes.delete("/:pid", isAdmin, deleteProduct);

export default productsRoutes;
