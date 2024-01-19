import { Router } from "express";

// import ProductManager from "../dao/fs/ProductManagerFS.js";
// const productMng = new ProductManager("src/dao/fs", "productsDb.json");
import ProductManager from "../dao/db/ProductManagerDB.js";
const productMng = new ProductManager();

import CartManager from "../dao/db/CartManagerDB.js";
const cartMng = new CartManager();

const viewsRoutes = Router();

viewsRoutes.get("/", async (req, res) => {
  res.render("home", { title: "Home" });
});

viewsRoutes.get("/realTimeProducts", async (req, res) => {
  res.render("realTimeProducts", { title: "Real Time Products" });
});

viewsRoutes.get("/chat", async (req, res) => {
  res.render("chat", { title: "eCommerce Chat" });
});

viewsRoutes.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = "", query = "" } = req.query;

    const productsList = await productMng.getProducts(limit, page, sort, query);

    const products = productsList.payload.map((x) => ({
      id: x._id.toString(),
      title: x.title,
      code: x.code,
    }));

    res.render("products", { title: "Products", productsList });
  } catch (error) {
    console.error(error);
  }
});

viewsRoutes.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const products = await cartMng.getProductsByCartId(cid);
    console.log(products);
    res.render("cart", { title: "Cart", products });
  } catch (error) {
    console.error(error);
  }
});

export default viewsRoutes;
