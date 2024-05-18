import { Router } from "express";
import { applyPolicy } from "../middlewares/auth.js";
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

productsRoutes.post("/", applyPolicy(["admin", "premium"]), addProduct);

productsRoutes.put("/:pid", applyPolicy(["admin", "premium"]), updateProduct);

productsRoutes.delete("/:pid", applyPolicy(["admin", "premium"]), deleteProduct);

export default productsRoutes;
