import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { required: true, type: String, trime: true },
  email: { required: true, type: String, trime: true },
  password: { required: true, type: String, trime: true },
  tc: { required: true, type: Boolean },
});

const UserModel = new mongoose.model("user", userSchema);

export default UserModel;
