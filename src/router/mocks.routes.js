import { Router } from "express";
import { generateProduct } from "../utils/mocksgenerators.js";

const mocksRoutes = Router();

mocksRoutes.get("/mockingproducts", async (req, res) => {
  const products = [];
  for (let index = 0; index < 100; index++) {
    products.push(generateProduct());
  }
  res.send({ status: "success", payload: products });
});

export default mocksRoutes;
