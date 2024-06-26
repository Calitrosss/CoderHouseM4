import { Router } from "express";
import { chekAuth, checkUser, authorization, applyPolicy } from "../middlewares/auth.js";
import {
  getHome,
  getRealTimeProducts,
  getChat,
  getProducts,
  getCartProducts,
  getLogin,
  getRegister,
  getFailRegister,
  getFailLogin,
  getForgotPass,
  getResetPass,
  getUserProfile,
  getUsers,
} from "../controllers/views.controller.js";

const viewsRoutes = Router();

viewsRoutes.get("/", getHome);

viewsRoutes.get("/realTimeProducts", chekAuth, authorization("admin"), getRealTimeProducts);

viewsRoutes.get("/chat", chekAuth, applyPolicy(["user", "premium"]), getChat);

viewsRoutes.get("/products", chekAuth, getProducts);

viewsRoutes.get("/carts/:cid", chekAuth, applyPolicy(["user", "premium"]), getCartProducts);

viewsRoutes.get("/login", checkUser, getLogin);

viewsRoutes.get("/register", checkUser, getRegister);

viewsRoutes.get("/failtoregister", checkUser, getFailRegister);

viewsRoutes.get("/failtologin", checkUser, getFailLogin);

viewsRoutes.get("/forgot-pass", checkUser, getForgotPass);

viewsRoutes.get("/reset-pass/:rid", checkUser, getResetPass);

viewsRoutes.get("/user-profile/:uid", chekAuth, applyPolicy(["user", "premium"]), getUserProfile);

viewsRoutes.get("/users-administrator", chekAuth, authorization("admin"), getUsers);

export default viewsRoutes;
