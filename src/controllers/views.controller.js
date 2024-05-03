import { getProductsService } from "../services/products.service.js";
import { getCartProductsService } from "../services/carts.service.js";

export const getHome = (req, res) => {
  // res.render("home", { title: "Home" });
  res.redirect("/products");
};

export const getRealTimeProducts = (req, res) => {
  res.render("realTimeProducts", { title: "Real Time Products" });
};

export const getChat = (req, res) => {
  res.render("chat", { title: "eCommerce Chat" });
};

export const getProducts = async (req, res) => {
  try {
    const { user } = req.session;
    const { limit = 10, page = 1, sort = "", query = "" } = req.query;
    const productsList = await getProductsService(limit, page, sort, query);
    res.render("products", { title: "Products", productsList, user });
  } catch (error) {
    req.logger.error(`${new Date().toLocaleString()} => ${error}`);
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const products = await getCartProductsService(cid);
    res.render("cart", { title: "Cart", products });
  } catch (error) {
    req.logger.error(`${new Date().toLocaleString()} => ${error}`);
  }
};

export const getLogin = (req, res) => {
  res.render("login", { title: "Login" });
};

export const getRegister = (req, res) => {
  res.render("register", { title: "Register" });
};

export const getFailRegister = (req, res) => {
  res.render("failtoregister", { title: "Register Error" });
};

export const getFailLogin = (req, res) => {
  res.render("failtologin", { title: "Login Error" });
};

export const getForgotPass = (req, res) => {
  res.render("forgot-pass", { title: "Forgot Password" });
};

export const getResetPass = (req, res) => {
  res.render("reset-pass", { title: "Reset Password" });
};

export const getUserProfile = (req, res) => {
  const { uid } = req.params;
  res.render("user-profile", { title: "User Profile", uid });
};
