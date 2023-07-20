import { Schema } from "mongoose";

export const messagesSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});