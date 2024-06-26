import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import { userModel } from "../models/user.model.js";
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

      if (!cart) throw new Error(`Cart Id "${id}" Not found`);

      return cart.products;
    } catch (error) {
      return undefined;
    }
  }

  async createCart({ uid }) {
    try {
      const user = await userModel.findOne({ _id: uid });
      if (!user) return { status: "error", error: `User not found` };

      if (!user.cart) {
        const newCart = {
          products: [],
        };
        const result = await cartModel.create(newCart);
        await userModel.updateOne({ _id: user._id }, { cart: result._id });
        return { status: "success", payload: result };
      }

      const result = await cartModel.findOne({ _id: user.cart });
      return { status: "success", payload: result };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }

  async addProductToCart(cid, pid, quantity, uid) {
    try {
      const user = await userModel.findOne({ _id: uid });
      if (!user) return { status: "error", error: `User not found` };

      const productDetail = await productModel.findOne({ _id: pid });
      if (!productDetail) return { status: "error", error: `Product not found` };

      if (productDetail.owner === user._id.toString())
        return { status: "error", error: `User owns the product` };

      const qty = quantity || 1;

      const cart = await this.getCartById(cid);
      if (!cart) throw new Error(`Cart Id "${cid}" Not found`);

      const products = cart.products;

      const product = products.find((p) => p.product.toString() === pid);
      if (!product) {
        products.push({ product: pid, quantity: qty });
      } else {
        product.quantity += qty;
      }

      await cartModel.updateOne({ _id: cid }, { products });
      return { status: "success", payload: `Product ID "${pid}" added to Cart ID "${cid}"` };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }

  async removeProductFromCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid);
      if (!cart) throw new Error(`Cart Id "${cid}" Not found`);

      let products = cart.products;

      const product = products.find((p) => p.product.toString() === pid);
      if (!product) {
        throw new Error(`Product Id "${pid}" not found in Cart ID "${cid}"`);
      } else {
        products = products.filter((p) => p.product.toString() !== pid);
      }

      await cartModel.updateOne({ _id: cid }, { products });
      return { status: "success", payload: `Product ID "${pid}" removed from Cart ID "${cid}"` };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }

  async updateCartProducts(cid, products) {
    try {
      const cart = await this.getCartById(cid);
      if (!cart) throw new Error(`Cart Id "${cid}" Not found`);

      await cartModel.updateOne({ _id: cid }, products);

      return { status: "success", payload: `Cart ID "${cid}" updated with products` };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }

  async updateCartProductQuantity(cid, pid, quantity) {
    try {
      if (!quantity || quantity < 0) throw new Error("Quantity is required");

      const cart = await this.getCartById(cid);
      if (!cart) throw new Error(`Cart Id "${cid}" Not found`);

      const products = cart.products;

      const product = products.find((p) => p.product.toString() === pid);
      if (!product) {
        throw new Error(`Product Id "${pid}" not found in Cart ID "${cid}"`);
      } else {
        product.quantity = quantity;
      }

      await cart.save();

      return { status: "success", payload: `Product ID "${pid}" updated in Cart ID "${cid}"` };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }

  async emptyCart(cid) {
    try {
      const cart = await this.getCartById(cid);
      if (!cart) throw new Error(`Cart Id "${cid}" Not found`);

      cart.products = [];

      await cart.save();

      return { status: "success", payload: `Cart ID "${cid}" emptied` };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }

  async makePurchase(cid, purchaser) {
    try {
      const cart = await this.getCartById(cid);
      if (!cart) throw new Error(`Cart Id "${cid}" Not found`);

      const cartProducts = await this.getProductsByCartId(cid);

      let itemsPurchased = 0;
      let amount = 0;
      cartProducts.forEach(async (cartProduct) => {
        if (cartProduct.product.stock >= cartProduct.quantity) {
          itemsPurchased++;

          amount += cartProduct.quantity * cartProduct.product.price;
        }
      });

      let ticket = {};
      if (itemsPurchased > 0) {
        const newTicket = {
          code: generateCode(),
          amount,
          purchaser,
        };
        ticket = await ticketModel.create(newTicket);
      }

      cartProducts.forEach(async (cartProduct) => {
        if (cartProduct.product.stock >= cartProduct.quantity) {
          cart.products = cart.products.filter(
            (p) => p.product.toString() !== cartProduct.product._id.toString()
          );

          const product = await productModel.findOne({ _id: cartProduct.product._id.toString() });
          product.stock -= cartProduct.quantity;
          await product.save();
        }
      });
      await cart.save();

      return { status: "success", payload: { cart, ticket } };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }
}

const generateCode = () => {
  const pre = Math.random().toString(36).substring(7);
  const cod1 = (Date.now() + Math.floor(Math.random() * 10000 + 1)).toString(36);
  const cod2 = (Date.now() + Math.floor(Math.random() * 10000 + 1)).toString(36);
  return `${pre}${cod1}${cod2}`;
};
