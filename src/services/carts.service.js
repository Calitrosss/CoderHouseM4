import { cartsService } from "../dao/repositories/index.js";

export const getCartsService = async () => {
  const carts = await cartsService.getCarts();
  return carts;
};

export const getCartProductsService = async (id) => {
  const products = await cartsService.getProductsByCartId(id);
  return products;
};

export const createCartService = async () => {
  const result = await cartsService.createCart();
  return result;
};

export const addCartProductService = async (cid, pid, quantity) => {
  const result = await cartsService.addProductToCart(cid, pid, quantity);
  return result;
};

export const removeCartProductService = async (cid, pid) => {
  const result = await cartsService.removeProductFromCart(cid, pid);
  return result;
};

export const updateCartProductsService = async (cid, products) => {
  const result = await cartsService.updateCartProducts(cid, products);
  return result;
};

export const updateCartProductQtyService = async (cid, pid, quantity) => {
  const result = await cartsService.updateCartProductQuantity(cid, pid, quantity);
  return result;
};

export const emptyCartService = async (cid) => {
  const result = await cartsService.emptyCart(cid);
  return result;
};

export const makePurchaseService = async (cid) => {
  const result = await cartsService.makePurchase(cid);
  return result;
};
