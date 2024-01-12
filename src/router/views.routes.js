import { Router } from "express";

// import ProductManager from "../dao/ProductManagerFS.js";
// const productMng = new ProductManager("src/dao", "productsDb.json");
import ProductManager from "../dao/ProductManagerDB.js";
const productMng = new ProductManager();

const viewsRoutes = Router();

viewsRoutes.get("/", async (req, res) => {
  const productsList = await productMng.getProducts();

  const products = productsList.map((x) => ({
    id: x._id.toHexString(),
    title: x.title,
    code: x.code,
  }));

  res.render("home", { title: "Home (Products)", products });
});

viewsRoutes.get("/realTimeProducts", async (req, res) => {
  res.render("realTimeProducts", { title: "Real Time Products" });
});

viewsRoutes.get("/chat", async (req, res) => {
  res.render("chat", { title: "eCommerce Chat" });
});

export default viewsRoutes;
