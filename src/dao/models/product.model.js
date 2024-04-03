import mongoose from "mongoose";
import moongosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = mongoose.Schema({
  title: { required: true, type: String },
  description: { required: true, type: String },
  code: { required: true, type: String, unique: true },
  price: { required: true, type: Number },
  status: { required: true, type: Boolean },
  stock: { required: true, type: Number },
  category: { required: true, type: String },
  thumbnails: { type: Array },
  owner: { required: true, type: String, default: "admin" },
});

productSchema.plugin(moongosePaginate);

export const productModel = mongoose.model(productCollection, productSchema);
