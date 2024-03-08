import {
  getCartsService,
  getCartProductsService,
  createCartService,
  addCartProductService,
  removeCartProductService,
  updateCartProductsService,
  updateCartProductQtyService,
  emptyCartService,
  makePurchaseService,
} from "../services/carts.service.js";

export const getCarts = async (req, res) => {
  try {
    const carts = await getCartsService();
    res.send({ status: "success", payload: carts });
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const id = req.params.cid;
    const products = await getCartProductsService(id);
    if (!products)
      return res.status(404).send({ status: "error", error: `Cart Id '${id}' Not found` });
    res.send({ status: "success", payload: products });
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  }
};

export const createCart = async (req, res) => {
  try {
    const result = await createCartService();
    if (result.status === "error") return res.status(400).send(result);
    res.send(result);
  } catch (error) {
    res.status(400).send({ status: "error", error: error });
  }
};

export const addCartProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const result = await addCartProductService(cid, pid, quantity);
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
};

export const removeCartProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const result = await removeCartProductService(cid, pid);
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
};

export const updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body;
    const result = await updateCartProductsService(cid, products);
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
};

export const updateCartProductQty = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const result = await updateCartProductQtyService(cid, pid, quantity);
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
};

export const emptyCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await emptyCartService(cid);
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
};

export const makePurchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const purchaser = req.user._id.toString();
    const result = await makePurchaseService(cid, purchaser);
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
};
