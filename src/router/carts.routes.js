import { Router } from "express";

// import CartManager from "../dao/CartManagerFS.js";
// const cartMng = new CartManager("src/dao", "cartsDb.json");
import CartManager from "../dao/CartManagerDB.js";
const cartMng = new CartManager();

const cartsRoutes = Router();

cartsRoutes.get("/", async (req, res) => {
  try {
    const carts = await cartMng.getCarts();

    res.send({ status: "success", payload: carts });
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  }
});

cartsRoutes.get("/:cid", async (req, res) => {
  try {
    const id = req.params.cid;

    const products = await cartMng.getProductsByCartId(id);
    if (!products)
      return res.status(404).send({ status: "error", error: `Cart Id '${id}' Not found` });

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

    const result = await cartMng.addProductToCart(cid, pid, quantity);

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
  }
});

export default cartsRoutes;
