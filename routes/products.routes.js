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
    res.status(400).send({ status: "error", error: error });
  }
});

productsRoutes.get("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;

    const product = await productMng.getProductById(+id);
    if (!product) {
      throw `Product Id '${id}' Not found`;
    }

    res.send({ status: "success", payload: product });
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  }
});

productsRoutes.post("/", async (req, res) => {
  try {
    const result = await productMng.addProduct(req.body);
    if (result.status === "error") {
      return res.status(400).send(result);
    }

    res.send(result);
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  }
});

productsRoutes.put("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);

    const result = await productMng.updateProduct({ ...req.body, id });
    if (result.status === "error") {
      return res.status(400).send(result);
    }

    res.send(result);
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  }
});

productsRoutes.delete("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;

    const result = await productMng.deleteProduct(+id);
    if (result.status === "error") {
      return res.status(400).send(result);
    }

    res.send(result);
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  }
});

export default productsRoutes;
