import mongoose from "mongoose";
import chai from "chai";
import CartManager from "../dao/db/CartManagerDB.js";

import { getVariables } from "../config/dotenv.config.js";
const { connString } = getVariables();

const expect = chai.expect;

const connection = mongoose.connect(connString);

describe("Testing de Product Manager", () => {
  let cartId = "";

  before(function () {
    this.cartMng = new CartManager();
  });

  beforeEach(function () {
    this.timeout(5000);
  });

  it("Obtener todos los carritos debe devolver un arreglo", async function () {
    const result = await this.cartMng.getCarts();
    expect(result).to.be.an("array");
  });

  it("Agregar un carrito debe devolver un objeto con propiedades status y dependiendo del valor del status debe tener las propiedades payload o error", async function () {
    const userId = { uid: "65c974db398a6e3eb8ba4a78" };

    const result = await this.cartMng.createCart(userId);

    expect(result).to.be.an("object");
    expect(result).to.have.property("status");

    if (result.status === "success") {
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      expect(result).to.have.property("payload");
      expect(result.payload).to.be.an("object");
      expect(result.payload).to.have.property("_id");
      expect(result.payload._id).to.be.ok;
      expect(result.payload._id).to.match(objectIdRegex);
      cartId = result.payload._id.toString();
    } else {
      expect(result).to.have.property("error");
      expect(result.error).to.be.ok;
    }
  });

  it("Vaciar un carrito debe devolver un objeto con propiedades status y dependiendo del valor del status debe tener las propiedades payload o error", async function () {
    const result = await this.cartMng.emptyCart(cartId);

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
