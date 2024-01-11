import mongoose from "mongoose";

const messageCollection = "messages";

const messageSchema = mongoose.Schema({
  user: { required: true, type: String },
  message: { required: true, type: String },
});

export const messageModel = mongoose.model(messageCollection, messageSchema);
