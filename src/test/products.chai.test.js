import mongoose from "mongoose";
import chai from "chai";
import ProductManager from "../dao/db/ProductManagerDB.js";

import { getVariables } from "../config/dotenv.config.js";
const { connStringTest } = getVariables();

const expect = chai.expect;

const connection = mongoose.connect(
  "mongodb+srv://coderAdm:G5jol6mgrb8avDAa@codercluster.btpuooj.mongodb.net/ecommerce_test"
);

describe("Testing de Product Manager", () => {
  before(function () {
    this.productMng = new ProductManager();
  });

  beforeEach(function () {
    this.timeout(5000);
  });

  it("El getProducts debe devolver un objeto", async function () {
    const limit = 10;
    const page = 1;
    const sort = "";
    const query = "";

    const result = await this.productMng.getProducts(limit, page, sort, query);
    console.log(result);

    expect(result).to.be.an("object");
  });

  // it("", async function () {});

  // it("", async function () {});
});
