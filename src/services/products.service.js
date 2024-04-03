import { productsService } from "../dao/repositories/index.js";

export const getProductsService = async (limit, page, sort, query) => {
  const products = await productsService.getProducts(limit, page, sort, query);
  return products;
};

export const getProductByIdService = async (id) => {
  const product = await productsService.getProductById(id);
  return product;
};

export const addProductService = async (data) => {
  const product = await productsService.addProduct(data);
  return product;
};

export const updateProductService = async (product) => {
  const result = await productsService.updateProduct(product);
  return result;
};

export const deleteProductService = async (id, uid, role) => {
  const result = await productsService.deleteProduct(id, uid, role);
  return result;
};
