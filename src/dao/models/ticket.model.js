import mongoose, { Mongoose } from "mongoose";

const ticketCollection = "tickets";

const generateCode = () => {
  return Date.now() + Math.floor(Math.random() * 10000 + 1);
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
