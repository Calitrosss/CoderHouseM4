import fs from "fs";

export default class CartManager {
  constructor(filePath, fileName) {
    this.filePath = filePath;
    this.fileName = fileName;
  }

  async #getLastId() {
    try {
      const configFile = await fs.promises.readFile(`${this.filePath}/config.json`, "utf-8");
      const configFileObj = JSON.parse(configFile);
      return configFileObj.lastCartId ?? 0;
    } catch (error) {
      console.error(`Error getLastId(): ${error}`);
      return 0;
    }
  }

  async #updateLastId(id) {
    try {
      const configFile = await fs.promises.readFile(`${this.filePath}/config.json`, "utf-8");
      const configFileObj = JSON.parse(configFile);
      const updateConfigFileObj = { ...configFileObj, lastCartId: id };

      await fs.promises.writeFile(
        `${this.filePath}/config.json`,
        JSON.stringify(updateConfigFileObj),
        "utf-8"
      );
    } catch (error) {
      console.error(`Error updateLastId(): ${error}`);
      await fs.promises.writeFile(
        `${this.filePath}/config.json`,
        JSON.stringify({ lastCartId: id }),
        "utf-8"
      );
    }
  }

  async #getCarts() {
    try {
      const cartsDb = await fs.promises.readFile(`${this.filePath}/${this.fileName}`, "utf-8");
      const cartsDbObj = JSON.parse(cartsDb);

      return cartsDbObj;
    } catch (error) {
      console.error(`Error getCarts(): ${error}`);
      return [];
    }
  }

  async getProductsByCartId(id) {
    try {
      const carts = await this.#getCarts();

      const cart = carts.find((c) => c.id === id);

      if (!cart) throw `Cart Id '${id}' Not found`;

      return cart.products;
    } catch (error) {
      console.error(`Error getProductsByCartId(): ${error}`);
      return undefined;
    }
  }

  async createCart() {
    try {
      let lastId = await this.#getLastId();
      lastId++;

      await this.#updateLastId(lastId);

      const newCart = {
        id: lastId,
        products: [],
      };

      const carts = await this.#getCarts();
      carts.push(newCart);

      await fs.promises.writeFile(
        `${this.filePath}/${this.fileName}`,
        JSON.stringify(carts),
        "utf-8"
      );

      console.log(`Success: Code "${newCart.id}" created`);

      return { status: "success", payload: newCart };
    } catch (error) {
      console.error(`Error createCart(): ${error}`);
      return { status: "error", error: error };
    }
  }

  async addProductToCart(cid, pid, quantity) {
    try {
      const carts = await this.#getCarts();

      const qty = quantity || 1;

      const cart = carts.find((c) => c.id === cid);
      if (!cart) throw `Cart Id '${cid}' Not found`;

      const products = cart.products;
      const product = products.find((p) => p.id === pid);

      if (!product) {
        cart.products.push({ id: pid, quantity: qty });
      } else {
        product.quantity += qty;
      }

      await fs.promises.writeFile(
        `${this.filePath}/${this.fileName}`,
        JSON.stringify(carts),
        "utf-8"
      );

      console.log(`Success: Product ID "${pid}" added to Cart ID "${cid}"`);

      return { status: "success", payload: cart };
    } catch (error) {
      console.error(`Error addProductToCart(): ${error}`);
      return { status: "error", error: error };
    }
  }
}
