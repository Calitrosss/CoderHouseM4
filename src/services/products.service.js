// import ProductManager from "../dao/fs/ProductManagerFS.js";
// const productMng = new ProductManager("src/dao/fs", "productsDb.json");
import ProductManager from "../dao/db/ProductManagerDB.js";
const productMng = new ProductManager();

export const getProductsService = async (limit, page, sort, query) => {
  const products = await productMng.getProducts(limit, page, sort, query);
  return products;
};

export const getProductByIdService = async (id) => {
  const product = await productMng.getProductById(id);
  return product;
};

export const addProductService = async (data) => {
  const product = await productMng.addProduct(data);
  return product;
};

export const updateProductService = async (product) => {
  const result = await productMng.updateProduct({ ...product });
  return result;
};

export const deleteProductService = async (id) => {
  const result = await productMng.deleteProduct(id);
  return result;
};
