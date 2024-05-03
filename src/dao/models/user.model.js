import mongoose from "mongoose";

const userCollection = "users";

const userSchema = mongoose.Schema({
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
  role: { type: String, required: true, enum: ["admin", "user", "premium"], default: "user" },
  documents: {
    type: [
      {
        name: {
          type: String,
          enum: ["profile", "product", "identity", "residence", "account", "other"],
        },
        reference: String,
      },
    ],
  },
  last_connection: Date,
});

export const userModel = mongoose.model(userCollection, userSchema);
