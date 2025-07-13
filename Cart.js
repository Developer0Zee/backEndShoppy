import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,  //storing user Id from user Collection
    ref: "User",
    required: "true",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId, //storing product id form product collection
    ref: "Product",
    required: "true",
  },
  Quantity: { type: Number, default: 1 }, //quantity
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
