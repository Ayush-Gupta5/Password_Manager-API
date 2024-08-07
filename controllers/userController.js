import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";

class UserController {
  static userRegistration = async (req, res) => {
    const { name, email, password, password_confirmation, tc } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({ status: "failed", message: "Email already exists" });
    } else {
      if (name && email && password && password_confirmation && tc) {
        if (password === password_confirmation) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const userData = new UserModel({
              name: name,
              email: email,
              password: hashPassword,
              tc: tc,
            });
            userData.save();
            const saved_user = await UserModel.findOne({ email: email });

            //Generate JWT Token
            const token = jwt.sign(
              { userId: saved_user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );

            res.send({
              status: "success",
              message: "User registered successfully",
              token: token,
            });
          } catch (error) {
            res.send({ status: "failed", message: "Unable to register" });
          }
        } else {
          res.send({
            status: "failed",
            message: "Password and Confirm password doesn't match",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    }
  };

  static userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
      const user = await UserModel.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (user.email === email && isMatch) {
          const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.send({
            status: "success",
            message: "Login success",
            token: token,
          });
        } else {
          res.send({ status: "failed", message: "Invalid email or Password" });
        }
      } else {
        res.send({ status: "failed", message: "Email not register" });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  };

  static userPasswordChange = async (req, res) => {
    const { old_password, new_password, password_confirmation } = req.body;
    if (old_password && new_password && password_confirmation) {
      const user = await UserModel.findById(req.user._id);
      const isMatch = await bcrypt.compare(old_password, user.password);
      if (isMatch) {
        if (new_password === password_confirmation) {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(new_password, salt);
          await UserModel.findByIdAndUpdate(user._id, {
            $set: { password: hashPassword },
          });
          res.send({
            status: "success",
            message: "Password changed successfully",
          });
        } else {
          res.send({
            status: "failed",
            message: "new password and confirm password doesn't match",
          });
        }
      } else {
        res.send({ status: "failed", message: "old password doesn't match" });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  };

  static profile = async (req, res) => {
    res.send({ user: req.user });
  };

  static forgetPassword = async (req, res) => {
    const { email } = req.body;
    if (email) {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ userId: user._id }, secret, {
          expiresIn: "15m",
        });
        const link = `http://localhost:3000/api/reset-password/${user._id}/${token}`;

        //Send Email
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Reset Password Link",
          html: `<h1>Click below button for reset your password.</h1><br><a href=${link}>Reset Password</a>`,
        });
        res.send({
          status: "success",
          message: "Reset password link send to your email.",
          info: info,
        });
      } else {
        res.send({ status: "failed", message: "User not found" });
      }
    } else {
      res.send({ status: "failed", message: "Email fields are required" });
    }
  };

  static userResetPassword = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const user = await UserModel.findById(id);
    const new_secret = user._id + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, new_secret);
      if (password && password_confirmation) {
        if (password === password_confirmation) {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);
          await UserModel.findByIdAndUpdate(user._id, {
            $set: { password: hashPassword },
          });
          res.send({
            status: "success",
            message: "Password reset successfully",
          });
        } else {
          res.send({
            status: "failed",
            message: "Password and confirm password doesn't match",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Invalid token" });
    }
  };
}

export default UserController;
