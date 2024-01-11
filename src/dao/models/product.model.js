import mongoose from "mongoose";

const productCollection = "products";

const productSchema = mongoose.Schema({
  title: { required: true, type: String },
  description: { required: true, type: String },
  code: { required: true, type: String, unique: true },
  price: { required: true, type: Number },
  status: { require: true, type: Boolean },
  stock: { required: true, type: Number },
  category: { required: true, type: String },
  thumbnails: { type: Array },
});

export const productModel = mongoose.model(productCollection, productSchema);
