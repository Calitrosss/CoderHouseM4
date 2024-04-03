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

import CustomError from "../errors/CustomError.js";
import ErrorEnum from "../errors/ErrorEnum.js";

export const getCarts = async (req, res, next) => {
  try {
    const carts = await getCartsService();
    res.send({ status: "success", payload: carts });
  } catch (error) {
    next(error);
  }
};

export const getCartProducts = async (req, res, next) => {
  try {
    const id = req.params.cid;
    const products = await getCartProductsService(id);
    if (!products)
      await CustomError.createError({
        name: "Cart products search error",
        cause: `Error getCartProducts(): Cart Id '${id}' Not found`,
        message: "Error trying to find Cart products",
        code: ErrorEnum.NOT_FOUND,
      });
    res.send({ status: "success", payload: products });
  } catch (error) {
    next(error);
  }
};

export const createCart = async (req, res, next) => {
  try {
    const result = await createCartService({ uid: req.user?._id });
    if (result.status === "error")
      await CustomError.createError({
        name: "Create cart error",
        cause: `Error createCart(): ${result.error}`,
        message: "Error trying to create Cart",
        code: ErrorEnum.DATABASE_ERROR,
      });

    req.user.cart = result._id;
    req.session.user.cart = result._id;

    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const addCartProduct = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const result = await addCartProductService(cid, pid, quantity, req.user?._id);
    if (result.status === "error") {
      if (result.error?.includes("Not found")) {
        await CustomError.createError({
          name: "Add Cart products error",
          cause: `Error addCartProduct(): ${result.error}`,
          message: "Error trying to add product to Cart",
          code: ErrorEnum.NOT_FOUND,
        });
      } else {
        await CustomError.createError({
          name: "Add Cart products error",
          cause: `Error createCart(): ${result.error}`,
          message: "Error trying to add product to Cart",
          code: ErrorEnum.DATABASE_ERROR,
        });
      }
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const removeCartProduct = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const result = await removeCartProductService(cid, pid);
    if (result.status === "error") {
      if (result.error?.includes("Not found")) {
        await CustomError.createError({
          name: "Remove Cart products error",
          cause: `Error removeCartProduct(): ${result.error}`,
          message: "Error trying to remove product to Cart",
          code: ErrorEnum.NOT_FOUND,
        });
      } else {
        await CustomError.createError({
          name: "Remove Cart products errorr",
          cause: `Error removeCartProduct(): ${result.error}`,
          message: "Error trying to remove product to Cart",
          code: ErrorEnum.DATABASE_ERROR,
        });
      }
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const updateCartProducts = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const products = req.body;
    const result = await updateCartProductsService(cid, products);
    if (result.status === "error") {
      if (result.error?.includes("Not found")) {
        await CustomError.createError({
          name: "Update Cart products error",
          cause: `Error updateCartProducts(): ${result.error}`,
          message: "Error trying to update Cart products",
          code: ErrorEnum.NOT_FOUND,
        });
      } else {
        await CustomError.createError({
          name: "Update Cart products error",
          cause: `Error updateCartProducts(): ${result.error}`,
          message: "Error trying to update Cart products",
          code: ErrorEnum.DATABASE_ERROR,
        });
      }
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const updateCartProductQty = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0)
      await CustomError.createError({
        name: "Update Cart product quantity error",
        cause: `Error updateCartProductQty(): Quantity is required`,
        message: "Error trying to update Cart product quantity",
        code: ErrorEnum.DATABASE_ERROR,
      });

    const result = await updateCartProductQtyService(cid, pid, quantity);
    if (result.status === "error") {
      if (result.error?.includes("Not found")) {
        await CustomError.createError({
          name: "Update Cart product quantity error",
          cause: `Error updateCartProductQty(): ${result.error}`,
          message: "Error trying to update Cart product quantity",
          code: ErrorEnum.NOT_FOUND,
        });
      } else {
        await CustomError.createError({
          name: "Update Cart product quantity error",
          cause: `Error updateCartProductQty(): ${result.error}`,
          message: "Error trying to update Cart product quantity",
          code: ErrorEnum.DATABASE_ERROR,
        });
      }
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const emptyCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const result = await emptyCartService(cid);
    if (result.status === "error") {
      if (result.error?.includes("Not found")) {
        await CustomError.createError({
          name: "Empty Cart error",
          cause: `Error emptyCart(): ${result.error}`,
          message: "Error trying to empty Cart",
          code: ErrorEnum.NOT_FOUND,
        });
      } else {
        await CustomError.createError({
          name: "Empty Cart error",
          cause: `Error emptyCart(): ${result.error}`,
          message: "Error trying to empty Cart",
          code: ErrorEnum.DATABASE_ERROR,
        });
      }
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const makePurchase = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const purchaser = req.user._id.toString();
    const result = await makePurchaseService(cid, purchaser);
    if (result.status === "error") {
      if (result.error?.includes("Not found")) {
        await CustomError.createError({
          name: "Make purchase error",
          cause: `Error makePurchase(): ${result.error}`,
          message: "Error trying to make purchase",
          code: ErrorEnum.NOT_FOUND,
        });
      } else {
        await CustomError.createError({
          name: "Make purchase error",
          cause: `Error makePurchase(): ${result.error}`,
          message: "Error trying to make purchase",
          code: ErrorEnum.DATABASE_ERROR,
        });
      }
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
};
