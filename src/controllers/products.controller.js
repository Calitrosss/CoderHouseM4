import {
  getProductsService,
  getProductByIdService,
  addProductService,
  updateProductService,
  deleteProductService,
} from "../services/products.service.js";

export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = "", query = "" } = req.query;
    const result = await getProductsService(limit, page, sort, query);
    res.send(result);
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.pid;
    const product = await getProductByIdService(id);
    if (!product)
      return res.status(404).send({ status: "error", error: `Product Id '${id}' Not found` });
    res.send({ status: "success", payload: product });
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  }
};

export const addProduct = async (req, res) => {
  try {
    const result = await addProductService(req.body);
    if (result.status === "error") return res.status(400).send(result);
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  }
  // finally {
  //   req.app.io.emit("products", await productMng.getProducts(1000, 1, "", ""));
  // }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.pid;
    const result = await updateProductService({ ...req.body, id });
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
  // finally {
  //   req.app.io.emit("products", await productMng.getProducts(1000, 1, "", ""));
  // }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.pid;
    const result = await deleteProductService(id);
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
  // finally {
  //   req.app.io.emit("products", await productMng.getProducts(1000, 1, "", ""));
  // }
};
