import { Router } from "express";
import { authorization, applyPolicy } from "../middlewares/auth.js";
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

cartsRoutes.post("/", applyPolicy(["user", "premium"]), createCart);

cartsRoutes.post("/:cid/product/:pid", applyPolicy(["user", "premium"]), addCartProduct);

cartsRoutes.delete("/:cid/product/:pid", applyPolicy(["user", "premium"]), removeCartProduct);

cartsRoutes.put("/:cid", applyPolicy(["user", "premium"]), updateCartProducts);

cartsRoutes.put("/:cid/product/:pid", applyPolicy(["user", "premium"]), updateCartProductQty);

cartsRoutes.delete("/:cid", applyPolicy(["user", "premium"]), emptyCart);

cartsRoutes.post("/:cid/purchase", applyPolicy(["user", "premium"]), makePurchase);

export default cartsRoutes;
