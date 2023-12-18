import { Router } from "express";
import ProductManager from "../ProductManager.js";

const productMng = new ProductManager("./src", "productsDb.json");

const viewsRoutes = Router();

viewsRoutes.get("/", async (req, res) => {
  const products = await productMng.getProducts();

  res.render("home", { title: "Home (Products)", products });
});

viewsRoutes.get("/realTimeProducts", async (req, res) => {
  res.render("realTimeProducts", { title: "Real Time Products" });
});

export default viewsRoutes;
