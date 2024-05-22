import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";

import viewsRoutes from "./router/views.routes.js";
import productsRoutes from "./router/products.routes.js";
import cartsRoutes from "./router/carts.routes.js";
import sessionsRoutes from "./router/sessions.routes.js";
import mocksRoutes from "./router/mocks.routes.js";
import loggerRoutes from "./router/logger.routes.js";
import usersRoutes from "./router/users.routes.js";

import { ErrorHandler } from "./middlewares/error.js";
import { addLogger } from "./utils/logger.js";

import passport from "passport";
import initializePassport from "./config/passport.config.js";

import {
  getProductsService,
  addProductService,
  deleteProductService,
} from "./services/products.service.js";

import { swaggerConfiguration } from "./config/swagger-configuration.js";

import { messageModel } from "./dao/models/message.model.js";

import { getVariables } from "./config/dotenv.config.js";
const { port, connString, secretKey } = getVariables();

const app = express();

//** Swagger configuration */
const specs = swaggerJSDoc(swaggerConfiguration);
app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

//** Basic configurations */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//** MongoDB Atlas connection  */
mongoose.connect(connString);

//** Handlebars configurations */
const hbs = handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
  helpers: {
    uppercase: function (text) {
      return text.toUpperCase();
    },
    ifAdmin: function (role, options) {
      if (role === "admin") {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    ifNotAdmin: function (role, options) {
      if (role !== "admin") {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    getPxQ: function (price, quantity) {
      return price * quantity;
    },
  },
});
app.engine("handlebars", hbs.engine);
app.set("views", "src/views");
app.set("view engine", "handlebars");

//** Sessions configuration */
app.use(
  session({
    secret: secretKey,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: connString,
      ttl: 300,
    }),
  })
);

//** Passport Initalization */
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//** Logger */
app.use(addLogger);

//** Routes configurations */
app.use("/", viewsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/mocks", mocksRoutes);
app.use("/api/loggerTest", loggerRoutes);
app.use("/api/users", usersRoutes);

//** Error Handler Middleware */
app.use(ErrorHandler);

//** Http Server Listen */
const httpServer = app.listen(port, async () => {
  console.log(`Listening to port ${port}`);
});

//** Websockets Server instance */
const io = new Server(httpServer);

//** Websockets Server configurations */
io.on("connection", async (socket) => {
  console.log(new Date(), `New client connected (${socket.id})`);

  //** List products */
  const [limit, page, sort, query] = [1000, 1, "", ""];
  let productsList = await getProductsService(limit, page, sort, query);

  const products = productsList.payload.map((x) => ({
    id: x._id.toString(),
    title: x.title,
    code: x.code,
  }));

  socket.emit("products", products);

  //** Add new product */
  socket.on("addProduct", async (data) => {
    await addProductService(data);

    productsList = await getProductsService(limit, page, sort, query);
    const products = productsList.payload.map((x) => ({
      id: x._id.toString(),
      title: x.title,
      code: x.code,
    }));

    socket.emit("products", products);
  });

  //** Delete existing product */
  socket.on("delProduct", async (data) => {
    await deleteProductService(data);

    productsList = await getProductsService(limit, page, sort, query);
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
