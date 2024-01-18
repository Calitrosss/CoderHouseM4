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

  async getProductsByCartId(id) {
    try {
      const cart = await cartModel.findOne({ _id: id });

      if (!cart) throw `Cart Id '${id}' Not found`;

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

      const products = await this.getProductsByCartId(cid);

      if (!products) throw `Cart Id '${cid}' Not found`;

      const product = products.find((p) => p.id === pid);
      if (!product) {
        products.push({ id: pid, quantity: qty });
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
}
