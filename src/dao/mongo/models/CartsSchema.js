import { Schema } from "mongoose";

export const cartsSchema = new Schema({
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
  ],
});