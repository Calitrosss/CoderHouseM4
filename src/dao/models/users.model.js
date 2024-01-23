import mongoose from "mongoose";

const usersCollection = "users";

const usersSchema = mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ["admin", "user"], default: "user" },
  password: { type: String, required: true },
});

export const usersModel = mongoose.model(usersCollection, usersSchema);
