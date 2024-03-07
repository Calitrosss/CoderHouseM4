import ProductsRepository from "./products.repository.js";
import ProductManager from "../db/ProductManagerDB.js";

export const productsService = new ProductsRepository(new ProductManager());
