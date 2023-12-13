import express from "express";
import productsRoutes from "../routes/products.routes.js";
// import cartsRoutes from "../routes/carts.routes.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Final Proyect - 1st. Pre-delivery");
});

app.use("/api/products", productsRoutes);
// app.use("/api/carts", cartsRoutes);

app.listen(PORT, async () => {
  console.log(`Listening to port ${PORT}`);
});
