// requiring all used modules
import express from "express";
import mongoose from "mongoose";
import Product from "./Product.js";
import Cart from "./Cart.js";
import User from "./User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { verify } from "./auth.js";
const app = express();

app.use(express.json()); // parsing data form json
const secretKey = "Zeeshan"; //secretKey
mongoose.connect("mongodb://localhost:27017"); // connecting to mongodb
const db = mongoose.connection;
db.on("open", () => { 
  console.log("connection established"); //log if connection is establised
});

db.on("close", () => {
  console.log("connection lost");
});

const data = [ // hard coded data 
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

Product.countDocuments().then((count) => {// restricitng duplicate entry
  if (count === 0) {
    Product.insertMany(data).then(() => console.log("data is inserted"));
  } else {
    console.log("data already exist");
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find(); //getting list of all products
    if (!products.length)
      return res.status(404).json({ message: "Products are not available" });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const specificProduct = await Product.findById(req.params.id); // getting specific product

    if (!specificProduct)
      return res.status(404).json({ message: "Product not available" });
    res.status(200).json(specificProduct); //sending product if found
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID" });
  }
});

//
app.get("/cart", verify, async (req, res) => {
  const userId = req.user.userId; //getting user 
  try {
    const cartItems = await Cart.find({ user: userId }).populate("productId"); //getitng list of save items in db
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
// adding cart items
app.post("/cart", verify, async (req, res) => {
  const { productId, Quantity } = req.body; // getting the product id and quantity 
  const userId = req.user.userId; //user id 

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not available" });

    const cart = new Cart({ user: userId, productId, Quantity }); //storing all details
    const result = await cart.save();
    if (!result) return res.status(400).json({ message: "validation error" });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//editing of quantity 
app.put("/cart/:id", verify, async (req, res) => {
  const userId = req.user.userId; // getting the user id so that only the logged user's cart is edited
  const { Quantity } = req.body; //getting data from body

  try {
    const cartItem = await Cart.findOne({ _id: req.params.id, user: userId }); // finding cart of the user
    if (!cartItem)
      return res.status(404).json({ message: "Cart item not found" });

    cartItem.Quantity = Quantity; //changing of cart quantity 
    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(400).json({ message: "Invalid request" });
  }
});

//deleting route
app.delete("/cart/:id", verify, async (req, res) => {
  const userId = req.user.userId; //getting user id from the db
  try {
    const result = await Cart.deleteOne({ _id: req.params.id, user: userId }); //deleting only logged user cart items

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.sendStatus(204); // status code if user gets deleted successfully
  } catch (error) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//register route for new user 
app.post("/register", async (req, res) => {
  const { email, password } = req.body;// getting hold of email and password from body

  try {
    const existingUser = await User.findOne({ email }); //checks if user already exists
    if (existingUser)
      return res.status(400).json({ message: "User already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword }); //hasing of password 

    res.status(201).json({ message: "User created" }); //succesfully user created
  } catch (err) {
    res.status(500).json({ message: "Internal Server error" });
  }
});

//Login route 
app.post("/login", async (req, res) => {
  const { email, password } = req.body; //getting email and password from body
  try {
    const user = await User.findOne({ email }); //checking user with email.

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password); //comparing password 
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "24h", // payload as user id , secretKey defined above and link gets expired in 24 hours
    });
    res.status(200).json({ token });// giving token
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3000, () => {
  console.log(" Server is running on http://localhost:3000");
});
