import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, //added email as a string and which ensures only unique users enter
  password: { type: String, required: true },// password
});

const User = mongoose.model("User", userSchema);

export default User;
