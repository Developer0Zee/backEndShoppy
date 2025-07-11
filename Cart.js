import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "true",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: "true",
  },
  Quantity: { type: Number, default: 1 },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
