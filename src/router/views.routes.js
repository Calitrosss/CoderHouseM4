import { Router } from "express";
import ProductManager from "../ProductManager.js";

const productMng = new ProductManager("./src", "productsDb.json");

const viewsRoutes = Router();

viewsRoutes.get("/", async (req, res) => {
  const products = await productMng.getProducts();

  res.render("home", { title: "Home (Products)", products });
});

export default viewsRoutes;
