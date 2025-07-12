import express from "express";
import mongoose from "mongoose";
import Product from "./Product.js";
import Cart from "./Cart.js";
import User from "./User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { verify } from "./auth.js";
const app = express();

app.use(express.json());
const secretKey = "Zeeshan";
mongoose.connect("mongodb://localhost:27017");
const db = mongoose.connection;
db.on("open", () => {
  console.log("connection established");
});

db.on("close", () => {
  console.log("connection lost");
});

const data = [
  {
    name: "Samsung Crystal 4K Vivid",
    price: 42990,
    description:
      "The Samsung Crystal UHD Smart TV has an array of features for an exceptional theatre-like experience in the comfort of your home. You can see your favourite stars come to life on this TV, thanks to the PurColour featured in it. ",
    stockQuantity: 5,
  },

  {
    name: "vivo T4x 5G",
    price: 13999,
    description:
      "Go All Day , Every Day with no limits with vivo T4x 5G. The 6500 mAh battery and 44W FlashCharge deliver all-day energy, quick recharges, and smart efficiency for nonstop use.",
    stockQuantity: 1000,
  },
];

Product.countDocuments().then((count) => {
  if (count === 0) {
    Product.insertMany(data).then(() => console.log("data is inserted"));
  } else {
    console.log("data already exist");
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    if (!products.length)
      return res.status(404).json({ message: "Products are not available" });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const specificProduct = await Product.findById(req.params.id);

    if (!specificProduct)
      return res.status(404).json({ message: "Product not available" });
    res.status(200).json(specificProduct);
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID" });
  }
});

app.get("/cart", verify, async (req, res) => {
  const userId = req.user.userId;
  try {
    const cartItems = await Cart.find({ user: userId }).populate("productId");
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/cart", verify, async (req, res) => {
  const { productId, Quantity } = req.body;
  const userId = req.user.userId;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not available" });

    const cart = new Cart({ user: userId, productId, Quantity });
    const result = await cart.save();
    if (!result) return res.status(400).json({ message: "validation error" });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/cart/:id", verify, async (req, res) => {
  const userId = req.user.userId;
  const { Quantity } = req.body;

  try {
    const cartItem = await Cart.findOne({ _id: req.params.id, user: userId });
    if (!cartItem)
      return res.status(404).json({ message: "Cart item not found" });

    cartItem.Quantity = Quantity;
    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(400).json({ message: "Invalid request" });
  }
});

app.delete("/cart/:id", verify, async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await Cart.deleteOne({ _id: req.params.id, user: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "24h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});
