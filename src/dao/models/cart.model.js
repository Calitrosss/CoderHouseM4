import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = mongoose.Schema({
  products: { type: Array },
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
