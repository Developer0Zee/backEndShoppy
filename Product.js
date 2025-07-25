import mongoose from "mongoose";
// productSchema 
const productSchema= new mongoose.Schema({

    name:{type:String, required :true},
    price:{type:Number, required: true},
    description:{type:String, required : true},
    stockQuantity:{type:Number, required: true}
});


const Product= mongoose.model("Product",productSchema);

export default Product;