import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
  user_id: { required: true, type: String },
  title: { required: true, type: String, trim: true },
  username: { type: String, trim: true },
  password: { type: String, trim: true },
  description: { type: String, trim: true },
  iv: { required: true, type: String },
});

const PasswordModel = new mongoose.model("password", passwordSchema);

export default PasswordModel;
