import { Router } from "express";
import { chekAuth, checkUser, isAdmin, isUser } from "../middlewares/auth.js";
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
} from "../controllers/views.controller.js";

const viewsRoutes = Router();

viewsRoutes.get("/", getHome);

viewsRoutes.get("/realTimeProducts", chekAuth, isAdmin, getRealTimeProducts);

viewsRoutes.get("/chat", chekAuth, isUser, getChat);

viewsRoutes.get("/products", chekAuth, getProducts);

viewsRoutes.get("/carts/:cid", chekAuth, isUser, getCartProducts);

viewsRoutes.get("/login", checkUser, getLogin);

viewsRoutes.get("/register", checkUser, getRegister);

viewsRoutes.get("/failtoregister", getFailRegister);

viewsRoutes.get("/failtologin", getFailLogin);

export default viewsRoutes;
