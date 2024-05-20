import { productModel } from "../models/product.model.js";
import { userModel } from "../models/user.model.js";
import UsersDTO from "../dto/users.dto.js";

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
      result.prevLink = result.hasPrevPage
        ? `/products?limit=${result.limit}&page=${result.prevPage}&sort=${sort || ""}&query=${
            query || ""
          }`
        : null;
      result.nextLink = result.hasNextPage
        ? `/products?limit=${result.limit}&page=${result.nextPage}&sort=${sort || ""}&query=${
            query || ""
          }`
        : null;

      return { status: "success", payload, ...result };
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    try {
      const product = await productModel.findOne({ _id: id });

      if (!product) throw new Error(`Product Id "${id}" Not found`);

      return product;
    } catch (error) {
      return undefined;
    }
  }

  async addProduct({ title, description, code, price, stock, category, thumbnails, uid, role }) {
    try {
      if (!price || price < 0) throw new Error("Price is required");
      if (!stock || stock < 0) throw new Error("Stock is required");

      const newProduct = {
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || [],
        owner: role === "premium" ? uid : "admin",
      };

      const result = await productModel.create(newProduct);
      return { status: "success", payload: result };
    } catch (error) {
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
    uid,
    role,
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

      if (updateProduct.title?.trim().length === 0) throw new Error("Title is required");
      if (updateProduct.description?.trim().length === 0)
        throw new Error("Description is required");
      if (updateProduct.code?.trim().length === 0) throw new Error("Code is required");
      if (updateProduct.price < 0) throw new Error("Price is required");
      if (updateProduct.stock < 0) throw new Error("Stock is required");
      if (updateProduct.category?.trim().length === 0) throw new Error("Category is required");

      const product = await productModel.findOne({ _id: id });
      if (!product) return { status: "error", error: `Product Id "${id}" Not found` };

      if (role === "premium" && product.owner !== uid.toString())
        return { status: "error", error: `Forbidden. The user is not the owner.` };

      const result = await productModel.updateOne({ _id: id }, updateProduct);

      if (!result.matchedCount) return { status: "error", error: `Product Id "${id}" Not found` };
      return { status: "success", payload: `Product ID "${id}" updated` };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }

  async deleteProduct(id, uid, role) {
    try {
      const product = await productModel.findOne({ _id: id });
      if (!product) return { status: "error", error: `Product Id "${id}" Not found` };

      let user = uid !== "admin" ? new UsersDTO(await userModel.findOne({ _id: uid })) : {};
      if (!user) return { status: "error", error: `User Id "${uid}" Not found` };

      if (role === "premium" && product.owner !== uid.toString())
        return { status: "error", error: `Forbidden. The user is not the owner.` };

      const result = await productModel.deleteOne({ _id: id });
      if (!result.deletedCount) return { status: "error", error: `Product Id "${id}" Not found` };

      return {
        status: "success",
        payload: {
          product: { code: product.code, title: product.title },
          user: { email: user.email, fullName: user.fullName },
        },
      };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }
}
