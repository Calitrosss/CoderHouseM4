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

const cartsRoutes = Router();

cartsRoutes.get("/", getCarts);

cartsRoutes.get("/:cid", getCartProducts);

cartsRoutes.post("/", createCart);

cartsRoutes.post("/:cid/product/:pid", addCartProduct);

cartsRoutes.delete("/:cid/product/:pid", removeCartProduct);

cartsRoutes.put("/:cid", updateCartProducts);

cartsRoutes.put("/:cid/product/:pid", updateCartProductQty);

cartsRoutes.delete("/:cid", emptyCart);

export default cartsRoutes;
