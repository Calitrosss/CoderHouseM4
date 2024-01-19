import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";

import viewsRoutes from "./router/views.routes.js";
import productsRoutes from "./router/products.routes.js";
import cartsRoutes from "./router/carts.routes.js";

// import ProductManager from "./dao/fs/ProductManagerFS.js";
// const productMng = new ProductManager("src/dao/fs", "productsDb.json");
import ProductManager from "./dao/db/ProductManagerDB.js";
const productMng = new ProductManager();

import { messageModel } from "./dao/models/message.model.js";

const PORT = 8080;
const app = express();

//** Basic configurations */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//** MongoDB Atlas connection  */
const usr = "coderAdm";
const pwd = "G5jol6mgrb8avDAa";
const db = "ecommerce";
mongoose.connect(`mongodb+srv://${usr}:${pwd}@codercluster.btpuooj.mongodb.net/${db}`);

//** Handlebars configurations */
const hbs = handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});
app.engine("handlebars", hbs.engine);
app.set("views", "src/views");
app.set("view engine", "handlebars");

//** Routes configurations */
app.use("/", viewsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

//** Http Server Listen */
const httpServer = app.listen(PORT, async () => {
  console.log(`Listening to port ${PORT}`);
});

//** Websockets Server instance */
const io = new Server(httpServer);

//** Websockets Server configurations */
io.on("connection", async (socket) => {
  console.log(new Date(), `New client connected (${socket.id})`);

  //** List products */
  const [limit, page, sort, query] = [1000, 1, "", ""];
  let productsList = await productMng.getProducts(limit, page, sort, query);

  const products = productsList.payload.map((x) => ({
    id: x._id.toString(),
    title: x.title,
    code: x.code,
  }));

  socket.emit("products", products);

  //** Add new product */
  socket.on("addProduct", async (data) => {
    await productMng.addProduct(data);

    productsList = await productMng.getProducts(limit, page, sort, query);
    const products = productsList.payload.map((x) => ({
      id: x._id.toString(),
      title: x.title,
      code: x.code,
    }));

    socket.emit("products", products);
  });

  //** Delete existing product */
  socket.on("delProduct", async (data) => {
    await productMng.deleteProduct(data);

    productsList = await productMng.getProducts(limit, page, sort, query);
    const products = productsList.payload.map((x) => ({
      id: x._id.toString(),
      title: x.title,
      code: x.code,
    }));

    socket.emit("products", products);
  });

  //** Chat */
  socket.on("message", async (data) => {
    await messageModel.create(data);
    const messages = await messageModel.find();
    io.emit("messageLogs", messages);
  });

  socket.on("userLogged", async (data) => {
    socket.broadcast.emit("userLogged", data);
    const messages = await messageModel.find();
    io.emit("messageLogs", messages);
  });
});

//** Attach io instance to the app to be able to use it in routes */
app.io = io;
