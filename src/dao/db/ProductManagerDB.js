import { productModel } from "../models/product.model.js";

export default class ProductManager {
  async getProducts(limit, page, sort, query) {
    try {
      const [key, value] = query.split(":");

      const result = await productModel.paginate(
        { [key]: value },
        { limit, page, sort: sort ? { price: sort } : {} }
      );

      const payload = result.docs;

      delete result.docs;
      result.prevLink = result.hasPrevPage ? `page=${result.prevPage}` : null;
      result.nextLink = result.hasNextPage ? `page=${result.nextPage}` : null;

      return { status: "success", payload, ...result };
    } catch (error) {
      console.error(`Error getProducts(): ${error}`);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const product = await productModel.findOne({ _id: id });

      if (!product) throw `Product Id "${id}" Not found`;

      return product;
    } catch (error) {
      console.error(`Error getProductById(): ${error}`);
      return undefined;
    }
  }

  async addProduct({ title, description, code, price, stock, category, thumbnails }) {
    try {
      if (!price || price < 0) throw "Price is required";
      if (!stock || stock < 0) throw "Stock is required";

      const newProduct = {
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || [],
      };

      const result = await productModel.create(newProduct);

      console.log(`Success: Code "${newProduct.code}" added`);

      return { status: "success", payload: result };
    } catch (error) {
      console.error(`Error addProduct(): ${error}`);
      return { status: "error", error: `${error}` };
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
      const updateProduct = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      };

      if (updateProduct.title?.trim().length === 0) throw "Title is required";
      if (updateProduct.description?.trim().length === 0) throw "Description is required";
      if (updateProduct.code?.trim().length === 0) throw "Code is required";
      if (updateProduct.price < 0) throw "Price is required";
      if (updateProduct.stock < 0) throw "Stock is required";
      if (updateProduct.category?.trim().length === 0) throw "Category is required";

      const result = await productModel.updateOne({ _id: id }, updateProduct);

      if (!result.matchedCount) return { status: "error", error: `Product Id "${id}" Not found` };

      console.log(`Success: Product ID "${id}" updated`);
      return { status: "success", payload: `Product ID "${id}" updated` };
    } catch (error) {
      console.error(`Error updateProduct(): ${error}`);
      return { status: "error", error: `${error}` };
    }
  }

  async deleteProduct(id) {
    try {
      const result = await productModel.deleteOne({ _id: id });

      if (!result.deletedCount) return { status: "error", error: `Product Id "${id}" Not found` };

      console.log(`Success: Product ID "${id}" deleted`);
      return { status: "success", payload: `Success: Product ID "${id}" deleted` };
    } catch (error) {
      console.error(`Error deleteProduct(): ${error}`);
      return { status: "error", error: `${error}` };
    }
  }
}
