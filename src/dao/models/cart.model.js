import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
