import { Router } from "express";
import { chekAuth, checkUser, authorization } from "../middlewares/auth.js";
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

viewsRoutes.get("/realTimeProducts", chekAuth, authorization("admin"), getRealTimeProducts);

viewsRoutes.get("/chat", chekAuth, authorization("user"), getChat);

viewsRoutes.get("/products", chekAuth, getProducts);

viewsRoutes.get("/carts/:cid", chekAuth, authorization("user"), getCartProducts);

viewsRoutes.get("/login", checkUser, getLogin);

viewsRoutes.get("/register", checkUser, getRegister);

viewsRoutes.get("/failtoregister", getFailRegister);

viewsRoutes.get("/failtologin", getFailLogin);

export default viewsRoutes;
