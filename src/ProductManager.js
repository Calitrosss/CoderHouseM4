import fs from "fs";

export default class ProductManager {
  constructor(filePath, fileName) {
    this.filePath = filePath;
    this.fileName = fileName;
  }

  static #configFile = `${this.filePath}/config.json`;

  async #getLastId() {
    try {
      const configFile = await fs.promises.readFile(ProductManager.#configFile, "utf-8");
      const configFileObj = JSON.parse(configFile);
      return configFileObj.lastId;
    } catch (error) {
      console.error(`Error getLastId(): ${error}`);
      return 0;
    }
  }

  async getProducts(limit) {
    try {
      const productsDb = await fs.promises.readFile(`${this.filePath}/${this.fileName}`, "utf-8");
      const productsDbObj = JSON.parse(productsDb);

      if (limit) return productsDbObj.slice(0, +limit);

      return productsDbObj;
    } catch (error) {
      console.error(`Error getProducts(): ${error}`);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((p) => p.id === id);

      if (!product) throw `Product Id '${id}' Not found`;

      return product;
    } catch (error) {
      console.error(`Error getProductById(): ${error}`);
      return { error: error };
    }
  }

  async #getProductByCode(code) {
    try {
      const products = await this.getProducts();
      return products.find((p) => p.code === code);
    } catch (error) {
      console.error(`Error #getProductByCode(): ${error}`);
    }
  }

  async addProduct({ title, description, code, price, stock, category, thumbnails }) {
    try {
      if (!title || !title.trim()) throw "Title is required";
      if (!description || !description.trim()) throw "Description is required";
      if (!code || !code.trim()) throw "Code is required";
      if (!price || price < 0) throw "Price is required";
      if (!stock || stock < 0) throw "Stock is required";
      if (!category || !category.trim()) throw "Category is required";

      const product = await this.#getProductByCode(code);

      if (product) throw `Code "${product.code}" already exist`;

      let lastId = await this.#getLastId();
      lastId++;

      const newProduct = {
        id: lastId,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || [],
      };

      const products = await this.getProducts();
      products.push(newProduct);

      const updateConfigFileObj = { lastId };

      await fs.promises.writeFile(
        ProductManager.#configFile,
        JSON.stringify(updateConfigFileObj),
        "utf-8"
      );

      await fs.promises.writeFile(
        `${this.filePath}/${this.fileName}`,
        JSON.stringify(products),
        "utf-8"
      );

      console.log(`Success: Code "${newProduct.code}" added`);

      return newProduct;
    } catch (error) {
      console.error(`Error addProduct(): ${error}`);
      return error;
    }
  }

  async updateProduct({
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  }) {
    try {
      if (!title || !title.trim()) throw "Title is required";
      if (!description || !description.trim()) throw "Description is required";
      if (!code || !code.trim()) throw "Code is required";
      if (!price || price < 0) throw "Price is required";
      if (!stock || stock < 0) throw "Stock is required";
      if (!category || !category.trim()) throw "Category is required";

      let product = await this.#getProductByCode(code);
      if (product) throw `Code "${product.code}" already exist`;

      const products = await this.getProducts();
      product = products.find((p) => p.id === id);
      if (!product) throw `Product Id "${id}" Not found`;
      product.title = title;
      product.description = description;
      product.code = code;
      product.price = price;
      product.status = status;
      product.stock = stock;
      product.category = category;
      product.thumbnails = thumbnails || [];

      await fs.promises.writeFile(
        `${this.filePath}/${this.fileName}`,
        JSON.stringify(products),
        "utf-8"
      );

      console.log(`Success: Product ID "${product.id}" updated`);

      return product;
    } catch (error) {
      console.error(`Error updateProduct(): ${error}`);
      return error;
    }
  }

  async deleteProduct(id) {
    try {
      const product = await this.getProductById(id);
      if (!product) throw `Error: Id "${id}" Not found`;

      const products = await this.getProducts();
      const newProducts = products.filter((p) => p.id !== id);

      await fs.promises.writeFile(
        `${this.filePath}/${this.fileName}`,
        JSON.stringify(newProducts),
        "utf-8"
      );

      console.log(`Success: Product ID "${id}" deleted`);
      return product;
    } catch (error) {
      console.error(`Error deleteProduct(): ${error}`);
      return error;
    }
  }
}
