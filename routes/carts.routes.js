import { Router } from "express";
import CartManager from "../src/CartManager.js";

const cartMng = new CartManager("./src", "cartsDb.json");

const cartsRoutes = Router();

cartsRoutes.get("/:cid", async (req, res) => {
  try {
    const id = req.params.cid;

    const products = await cartMng.getProductsByCartId(+id);
    if (!products) {
      throw `Cart Id '${id}' Not found`;
    }

    res.send({ status: "success", payload: products });
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  }
});

cartsRoutes.post("/", async (req, res) => {
  try {
    const result = await cartMng.createCart();
    if (result.status === "error") {
      return res.status(400).send(result);
    }

    res.send(result);
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  }
});

cartsRoutes.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const result = await cartMng.addProductToCart(+cid, +pid, quantity);

    if (result.status === "error") {
      return res.status(400).send(result);
    }

    res.send(result);
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  }
});

export default cartsRoutes;
