import mongoose from "mongoose";

const resetLinksCollection = "resetlink";

const resetLinksSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, expires: 3600, default: Date.now },
});

export const resetLinksModel = mongoose.model(resetLinksCollection, resetLinksSchema);
