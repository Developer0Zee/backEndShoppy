import express from "express";
import mongoose from "mongoose";
import Product from "./Product.js";
import Cart from "./Cart.js";

const app = express();

app.use(express.json());
mongoose.connect("mongodb://localhost:27017");
const db=mongoose.connection;
db.on("open",()=>{
  console.log("connection established");
});

db.on("close",()=>{
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

Product.countDocuments()
  .then((count) => {
    if (count === 0) {
      Product.insertMany(data).then(() => console.log("data is inserted"));
    }else {
      console.log("data already exist");
    }});

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

app.post("/cart", async (req, res) => {
  const { productId, Quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not available" });

    const cart = new Cart({ productId, Quantity });
    const result = await cart.save();
    if (!result) return res.status(400).json({ message: "validation error" });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/cart/:id",async (req,res)=>{
const {Quantity}=req.body;
  try{
const editQuantity= await Cart.findByIdAndUpdate(req.params.id,{Quantity},{

  new:true,
  runValidators:true
})
if(!editQuantity) return res.status(404).json({message:"Cart Item not found"});
res.status(200).json(editQuantity);
}
catch(error){
    res.status(400).json({ message: "Invalid request" });
}
})

app.delete("/cart/:id",async (req,res)=>{
try{
const deleteItem=await Cart.findByIdAndDelete(req.params.id)

if(!deleteItem) return res.status(404).json({ message: "Cart item not found" });
res.sendStatus(204);
}
catch(error){
  res.status(500).json({message:"Internal server error"});
}

});

app.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});