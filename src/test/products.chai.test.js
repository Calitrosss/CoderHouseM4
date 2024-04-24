import mongoose from "mongoose";
import chai from "chai";
import ProductManager from "../dao/db/ProductManagerDB.js";

import { getVariables } from "../config/dotenv.config.js";
const { connString } = getVariables();

const expect = chai.expect;

const connection = mongoose.connect(connString);

describe("Testing de Product Manager", () => {
  let productId = "";

  before(function () {
    this.productMng = new ProductManager();
  });

  beforeEach(function () {
    this.timeout(5000);
  });

  it("Obtener todos los productos debe devolver un objeto con propiedades status y payload", async function () {
    const limit = 10;
    const page = 1;
    const sort = "";
    const query = "";

    const result = await this.productMng.getProducts(limit, page, sort, query);
    console.log(result);

    expect(result).to.be.an("object");
    expect(result).to.have.property("status");
    expect(result).to.have.property("payload");
    expect(result.payload).to.be.an("array");
  });

  it("Agregar un producto debe devolver un objeto con propiedades status y dependiendo del valor del status debe tener las propiedades payload o error", async function () {
    const mockProduct = {
      title: "Test Product",
      description: "This is a test product.",
      code: "TEST01",
      price: 999,
      stock: 50,
      category: "Test",
      thumbnails: ["https://example.com/test.jpg"],
    };

    const result = await this.productMng.addProduct(mockProduct);

    expect(result).to.be.an("object");
    expect(result).to.have.property("status");

    if (result.status === "success") {
      expect(result).to.have.property("payload");
      expect(result.payload).to.have.property("_id");
      expect(result.payload._id).to.be.ok;
      productId = result.payload._id.toString();
    } else {
      expect(result).to.have.property("error");
      expect(result.error).to.be.ok;
    }
  });

  it("Eliminar un producto debe devolver un objeto con propiedades status y dependiendo del valor del status debe tener las propiedades payload o error", async function () {
    const result = await this.productMng.deleteProduct(productId);

    expect(result).to.be.an("object");
    expect(result).to.have.property("status");

    if (result.status === "success") {
      expect(result).to.have.property("payload");
      expect(result.payload).to.be.ok;
    } else {
      expect(result).to.have.property("error");
      expect(result.error).to.be.ok;
    }
  });
});
