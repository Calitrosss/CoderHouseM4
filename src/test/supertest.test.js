import chai from "chai";
import supertest from "supertest";

import { getVariables } from "../config/dotenv.config.js";
const { port } = getVariables();

const expect = chai.expect;
const requester = supertest(`http://localhost:${port}`);

describe("Test Ecommerce", () => {
  describe("Test de Router de sessions", () => {
    it("El endpoint current debe dar error de autenticación si no hay una sesión de usuario válida", async () => {
      const { statusCode, _body } = await requester.get("/api/sessions/current");

      expect(statusCode).to.be.eql(401);
      expect(_body).to.be.an("object");
      expect(_body).to.have.property("error");
      expect(_body.error).to.be.ok;
    });

    // it("", async () => {});

    // it("", async () => {});
  });
});
