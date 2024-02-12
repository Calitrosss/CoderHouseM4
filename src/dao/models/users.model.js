import mongoose from "mongoose";

const usersCollection = "users";

const usersSchema = mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, default: null },
  password: { type: String, required: true },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
    default: null,
  },
  role: { type: String, required: true, enum: ["admin", "user"], default: "user" },
});

export const usersModel = mongoose.model(usersCollection, usersSchema);
