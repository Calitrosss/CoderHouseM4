import { Router } from "express";
import ProductManager from "../src/ProductManager.js";

const productMng = new ProductManager("./src", "productsDb.json");

const productsRoutes = Router();

productsRoutes.get("/", async (req, res) => {
  try {
    const { limit } = req.query;

    const products = await productMng.getProducts(+limit);

    res.send({ status: "success", payload: products });
  } catch (error) {
    res.send({ status: "error", error: error });
  }
});

productsRoutes.get("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;

    const product = await productMng.getProductById(+id);

    res.send({ status: "success", payload: product });
  } catch (error) {
    res.send({ status: "error", error: error });
  }
});

productsRoutes.post("/", async (req, res) => {
  try {
    const product = await productMng.addProduct(req.body);

    res.send({ status: "success", payload: product });
  } catch (error) {
    res.send({ status: "error", error: error });
  }
});

productsRoutes.put("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const product = await productMng.updateProduct({ ...req.body, id });

    res.send({ status: "success", payload: product });
  } catch (error) {
    res.send({ status: "error", error: error });
  }
});

productsRoutes.delete("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;

    const product = await productMng.deleteProduct(+id);

    res.send({ status: "success", payload: product });
  } catch (error) {
    res.send({ status: "error", error: error });
  }
});

export default productsRoutes;
