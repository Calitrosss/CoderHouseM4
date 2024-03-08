import { Router } from "express";
import { authorization } from "../middlewares/auth.js";
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

productsRoutes.post("/", authorization("admin"), addProduct);

productsRoutes.put("/:pid", authorization("admin"), updateProduct);

productsRoutes.delete("/:pid", authorization("admin"), deleteProduct);

export default productsRoutes;
