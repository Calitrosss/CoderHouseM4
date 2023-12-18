import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

import viewsRoutes from "./router/views.routes.js";
import productsRoutes from "./router/products.routes.js";
import cartsRoutes from "./router/carts.routes.js";

import ProductManager from "./ProductManager.js";
const productMng = new ProductManager("./src", "productsDb.json");

const PORT = 8080;
const app = express();

//** Basic configurations */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//** Handlebars configurations */
app.engine("handlebars", handlebars.engine());
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

//** Websockets Server configurations */
const io = new Server(httpServer);
io.on("connection", async (socket) => {
  console.log(new Date(), `New client connected (${socket.id})`);

  //** List products */
  let products = await productMng.getProducts();
  socket.emit("products", products);

  //** Add new product */
  socket.on("addProduct", async (data) => {
    await productMng.addProduct(data);
    products = await productMng.getProducts();
    socket.emit("products", products);
  });

  //** Delete existing product */
  socket.on("delProduct", async (data) => {
    await productMng.deleteProduct(data);
    products = await productMng.getProducts();
    socket.emit("products", products);
  });
});
