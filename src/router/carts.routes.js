import { Router } from "express";
import {
  getCarts,
  getCartProducts,
  createCart,
  addCartProduct,
  removeCartProduct,
  updateCartProducts,
  updateCartProductQty,
  emptyCart,
} from "../controllers/carts.controller.js";
import { isUser } from "../middlewares/auth.js";

const cartsRoutes = Router();

cartsRoutes.get("/", getCarts);

cartsRoutes.get("/:cid", getCartProducts);

cartsRoutes.post("/", isUser, createCart);

cartsRoutes.post("/:cid/product/:pid", isUser, addCartProduct);

cartsRoutes.delete("/:cid/product/:pid", isUser, removeCartProduct);

cartsRoutes.put("/:cid", isUser, updateCartProducts);

cartsRoutes.put("/:cid/product/:pid", isUser, updateCartProductQty);

cartsRoutes.delete("/:cid", isUser, emptyCart);

export default cartsRoutes;
