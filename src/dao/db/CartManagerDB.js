import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import { ticketModel } from "../models/ticket.model.js";

export default class CartManager {
  async getCarts() {
    try {
      const cartsDbObj = await cartModel.find();

      return cartsDbObj;
    } catch (error) {
      return [];
    }
  }

  async getCartById(cid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });

      return cart;
    } catch (error) {
      return null;
    }
  }

  async getProductsByCartId(id) {
    try {
      const cart = await cartModel.findOne({ _id: id }).populate("products.product");

      if (!cart) throw `Cart Id "${id}" Not found`;

      return cart.products;
    } catch (error) {
      return undefined;
    }
  }

  async createCart() {
    try {
      const newCart = {
        products: [],
      };
      const result = await cartModel.create(newCart);
      return { status: "success", payload: result };
    } catch (error) {
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
      return { status: "success", payload: `Product ID "${pid}" added to Cart ID "${cid}"` };
    } catch (error) {
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
      return { status: "success", payload: `Product ID "${pid}" removed from Cart ID "${cid}"` };
    } catch (error) {
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
      return { status: "error", error: `${error}` };
    }
  }

  async updateCartProductQuantity(cid, pid, quantity) {
    try {
      if (!quantity || quantity < 0) throw "Quantity is required";

      const cart = await this.getCartById(cid);
      if (!cart) throw `Cart Id "${cid}" Not found`;

      const products = cart.products;

      const product = products.find((p) => p.product.toString() === pid);
      if (!product) {
        throw `Product Id "${pid}" not found in Cart ID "${cid}"`;
      } else {
        product.quantity = quantity;
      }

      const result = await cart.save();

      return { status: "success", payload: `Product ID "${pid}" updated in Cart ID "${cid}"` };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }

  async emptyCart(cid) {
    try {
      const cart = await this.getCartById(cid);
      if (!cart) throw `Cart Id "${cid}" Not found`;

      cart.products = [];

      const result = await cart.save();

      return { status: "success", payload: `Cart ID "${cid}" emptied` };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }

  async makePurchase(cid, purchaser) {
    try {
      const cart = await this.getCartById(cid);
      if (!cart) throw `Cart Id "${cid}" Not found`;

      const cartProducts = await this.getProductsByCartId(cid);

      let itemsPurchased = 0;
      let amount = 0;
      cartProducts.forEach(async (cartProduct) => {
        if (cartProduct.product.stock >= cartProduct.quantity) {
          itemsPurchased++;

          amount += cartProduct.quantity * cartProduct.product.price;

          cart.products = cart.products.filter(
            (p) => p.product.toString() !== cartProduct.product._id.toString()
          );

          const product = await productModel.findOne({ _id: cartProduct.product._id.toString() });
          product.stock -= cartProduct.quantity;
          await product.save();
        }
      });

      let ticket = {};
      if (itemsPurchased > 0) {
        await cart.save();
        ticket = await ticketModel.create({
          amount,
          purchaser,
        });
      }

      return { status: "success", payload: { cart, ticket } };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }
}
