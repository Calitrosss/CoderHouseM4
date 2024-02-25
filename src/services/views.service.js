// import ProductManager from "../dao/fs/ProductManagerFS.js";
// const productMng = new ProductManager("src/dao/fs", "productsDb.json");
import ProductManager from "../dao/db/ProductManagerDB.js";
const productMng = new ProductManager();

import CartManager from "../dao/db/CartManagerDB.js";
const cartMng = new CartManager();

export const getProductsService = async (limit, page, sort, query) => {
  const productsList = await productMng.getProducts(limit, page, sort, query);
  return productsList;
};

export const getCartProductsService = async (cid) => {
  const cartProductsList = await cartMng.getProductsByCartId(cid);
  return cartProductsList;
};
