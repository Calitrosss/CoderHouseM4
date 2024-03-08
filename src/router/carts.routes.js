import { Router } from "express";
import { authorization } from "../middlewares/auth.js";
import {
  getCarts,
  getCartProducts,
  createCart,
  addCartProduct,
  removeCartProduct,
  updateCartProducts,
  updateCartProductQty,
  emptyCart,
  makePurchase,
} from "../controllers/carts.controller.js";

const cartsRoutes = Router();

cartsRoutes.get("/", getCarts);

cartsRoutes.get("/:cid", getCartProducts);

cartsRoutes.post("/", authorization("user"), createCart);

cartsRoutes.post("/:cid/product/:pid", authorization("user"), addCartProduct);

cartsRoutes.delete("/:cid/product/:pid", authorization("user"), removeCartProduct);

cartsRoutes.put("/:cid", authorization("user"), updateCartProducts);

cartsRoutes.put("/:cid/product/:pid", authorization("user"), updateCartProductQty);

cartsRoutes.delete("/:cid", authorization("user"), emptyCart);

cartsRoutes.post("/:cid/purchase", authorization("user"), makePurchase);

export default cartsRoutes;
