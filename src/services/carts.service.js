// import CartManager from "../dao/fs/CartManagerFS.js";
// const cartMng = new CartManager("src/dao/fs", "cartsDb.json");
import CartManager from "../dao/db/CartManagerDB.js";
const cartMng = new CartManager();

export const getCartsService = async () => {
  const carts = await cartMng.getCarts();
  return carts;
};

export const getCartProductsService = async (id) => {
  const products = await cartMng.getProductsByCartId(id);
  return products;
};

export const createCartService = async () => {
  const result = await cartMng.createCart();
  return result;
};

export const addCartProductService = async (cid, pid, quantity) => {
  const result = await cartMng.addProductToCart(cid, pid, quantity);
  return result;
};

export const removeCartProductService = async (cid, pid) => {
  const result = await cartMng.removeProductFromCart(cid, pid);
  return result;
};

export const updateCartProductsService = async (cid, products) => {
  const result = await cartMng.updateCartProducts(cid, products);
  return result;
};

export const updateCartProductQtyService = async (cid, pid, quantity) => {
  const result = await cartMng.updateCartProductQuantity(cid, pid, quantity);
  return result;
};

export const emptyCartService = async (cid) => {
  const result = await cartMng.emptyCart(cid);
  return result;
};
