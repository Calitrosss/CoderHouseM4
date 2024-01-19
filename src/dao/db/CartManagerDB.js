import mongoose from "mongoose";
import { cartModel } from "../models/cart.model.js";

export default class CartManager {
  async getCarts() {
    try {
      const cartsDbObj = await cartModel.find();

      return cartsDbObj;
    } catch (error) {
      console.error(`Error getCarts(): ${error}`);
      return [];
    }
  }

  async getCartById(cid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });

      return cart;
    } catch (error) {
      console.error(`Error getCartById(): ${error}`);
      return null;
    }
  }

  async getProductsByCartId(id) {
    try {
      const cart = await cartModel.findOne({ _id: id }).populate("products.product");

      if (!cart) throw `Cart Id "${id}" Not found`;

      return cart.products;
    } catch (error) {
      console.error(`Error getProductsByCartId(): ${error}`);
      return undefined;
    }
  }

  async createCart() {
    try {
      const newCart = {
        products: [],
      };

      const result = await cartModel.create(newCart);

      console.log(`Success: Cart "${result._id}" created`);

      return { status: "success", payload: result };
    } catch (error) {
      console.error(`Error createCart(): ${error}`);
      return { status: "error", error: `${error}` };
    }
  }

  async addProductToCart(cid, pid, quantity) {
    try {
      const qty = quantity || 1;

      const cart = await this.getCartById(cid);
      if (!cart) throw `Cart Id "${cid}" Not found`;

      const products = cart.products;

      const product = products.find((p) => p.product.toString() === pid);
      if (!product) {
        products.push({ product: pid, quantity: qty });
      } else {
        product.quantity += qty;
      }

      const result = await cartModel.updateOne({ _id: cid }, { products });

      console.log(`Success: Product ID "${pid}" added to Cart ID "${cid}"`);

      return { status: "success", payload: `Product ID "${pid}" added to Cart ID "${cid}"` };
    } catch (error) {
      console.error(`Error addProductToCart(): ${error}`);
      return { status: "error", error: `${error}` };
    }
  }

  async removeProductFromCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid);
      if (!cart) throw `Cart Id "${cid}" Not found`;

      let products = cart.products;

      const product = products.find((p) => p.product.toString() === pid);
      if (!product) {
        throw `Product Id "${pid}" not found in Cart ID "${cid}"`;
      } else {
        products = products.filter((p) => p.product.toString() !== pid);
      }

      const result = await cartModel.updateOne({ _id: cid }, { products });

      console.log(`Success: Product ID "${pid}" removed from Cart ID "${cid}"`);

      return { status: "success", payload: `Product ID "${pid}" removed from Cart ID "${cid}"` };
    } catch (error) {
      console.error(`Error removeProductFromCart(): ${error}`);
      return { status: "error", error: `${error}` };
    }
  }

  async updateCartProducts(cid, products) {
    try {
      const cart = await this.getCartById(cid);
      if (!cart) throw `Cart Id "${cid}" Not found`;

      const result = await cartModel.updateOne({ _id: cid }, products);

      return { status: "success", payload: `Cart ID "${cid}" updated with products` };
    } catch (error) {
      console.error(`Error updateCartProducts(): ${error}`);
      return { status: "error", error: `${error}` };
    }
  }
}
