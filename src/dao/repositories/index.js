import ProductsRepository from "./products.repository.js";
import ProductManager from "../db/ProductManagerDB.js";
import CartsRepository from "./carts.repository.js";
import CartManager from "../db/CartManagerDB.js";

export const productsService = new ProductsRepository(new ProductManager());
export const cartsService = new CartsRepository(new CartManager());
