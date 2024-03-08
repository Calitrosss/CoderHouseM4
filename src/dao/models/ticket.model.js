import mongoose from "mongoose";

const ticketCollection = "tickets";

const generateCode = () => {
  const pre = Math.random().toString(36).substring(7);
  const cod1 = (Date.now() + Math.floor(Math.random() * 10000 + 1)).toString(36);
  const cod2 = (Date.now() + Math.floor(Math.random() * 10000 + 1)).toString(36);
  return `${pre}${cod1}${cod2}`;
};

const ticketSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    default: generateCode(),
  },
  purchase_datetime: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);
