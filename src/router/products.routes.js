import { Router } from "express";

// import ProductManager from "../dao/fs/ProductManagerFS.js";
// const productMng = new ProductManager("src/dao/fs", "productsDb.json");
import ProductManager from "../dao/db/ProductManagerDB.js";
const productMng = new ProductManager();

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

    const product = await productMng.getProductById(id);
    if (!product)
      return res.status(404).send({ status: "error", error: `Product Id '${id}' Not found` });

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

    res.status(201).send(result);
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  } finally {
    req.app.io.emit("products", await productMng.getProducts());
  }
});

productsRoutes.put("/:pid", async (req, res, next) => {
  try {
    const id = req.params.pid;

    const result = await productMng.updateProduct({ ...req.body, id });

    if (result.status === "error") {
      if (result.error?.includes("Not found")) {
        return res.status(404).send(result);
      } else {
        return res.status(400).send(result);
      }
    }

    res.send(result);
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  } finally {
    req.app.io.emit("products", await productMng.getProducts());
  }
});

productsRoutes.delete("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;

    const result = await productMng.deleteProduct(id);

    if (result.status === "error") {
      if (result.error?.includes("Not found")) {
        return res.status(404).send(result);
      } else {
        return res.status(400).send(result);
      }
    }

    res.send(result);
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  } finally {
    req.app.io.emit("products", await productMng.getProducts());
  }
});

export default productsRoutes;
