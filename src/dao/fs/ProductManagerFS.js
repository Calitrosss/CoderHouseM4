import fs from "fs";

export default class ProductManager {
  constructor(filePath, fileName) {
    this.filePath = filePath;
    this.fileName = fileName;
  }

  async #getLastId() {
    try {
      const configFile = await fs.promises.readFile(`${this.filePath}/config.json`, "utf-8");
      const configFileObj = JSON.parse(configFile);

      return configFileObj.lastProductId ?? 0;
    } catch (error) {
      console.error(`Error getLastId(): ${error}`);
      return 0;
    }
  }

  async #updateLastId(id) {
    try {
      const configFile = await fs.promises.readFile(`${this.filePath}/config.json`, "utf-8");
      const configFileObj = JSON.parse(configFile);
      const updateConfigFileObj = { ...configFileObj, lastProductId: id };

      await fs.promises.writeFile(
        `${this.filePath}/config.json`,
        JSON.stringify(updateConfigFileObj),
        "utf-8"
      );
    } catch (error) {
      console.error(`Error updateLastId(): ${error}`);
      await fs.promises.writeFile(
        `${this.filePath}/config.json`,
        JSON.stringify({ lastProductId: id }),
        "utf-8"
      );
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
      const product = products.find((p) => p.id === +id);

      if (!product) throw `Product Id '${id}' Not found`;

      return product;
    } catch (error) {
      console.error(`Error getProductById(): ${error}`);
      return undefined;
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

      await this.#updateLastId(lastId);

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

      await fs.promises.writeFile(
        `${this.filePath}/${this.fileName}`,
        JSON.stringify(products),
        "utf-8"
      );

      console.log(`Success: Code "${newProduct.code}" added`);

      return { status: "success", payload: newProduct };
    } catch (error) {
      console.error(`Error addProduct(): ${error}`);
      return { status: "error", error: error };
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
      product = products.find((p) => p.id === +id);
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

      return { status: "success", payload: product };
    } catch (error) {
      console.error(`Error updateProduct(): ${error}`);
      return { status: "error", error: error };
    }
  }

  async deleteProduct(id) {
    try {
      const product = await this.getProductById(+id);
      if (!product) throw `Error: Id "${id}" Not found`;

      const products = await this.getProducts();
      const newProducts = products.filter((p) => p.id !== +id);

      await fs.promises.writeFile(
        `${this.filePath}/${this.fileName}`,
        JSON.stringify(newProducts),
        "utf-8"
      );

      console.log(`Success: Product ID "${id}" deleted`);
      return { status: "success", payload: product };
    } catch (error) {
      console.error(`Error deleteProduct(): ${error}`);
      return { status: "error", error: error };
    }
  }
}
