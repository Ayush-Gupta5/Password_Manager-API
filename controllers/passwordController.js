import { decrypt } from "dotenv";
import PasswordModel from "../models/password.js";
import cryptoUtils from "../utils/cryptoutils.js";

class PasswordController {
  static userData = async (req, res) => {
    const { title, username, password, description } = req.body;
    if (title) {
      const encrypttitle = cryptoUtils.encrypt(title);
      const encryptUsername = cryptoUtils.encrypt(username);
      const encryptPassword = cryptoUtils.encrypt(password);
      const encryptdesc = cryptoUtils.encrypt(description);
      const iv = encrypttitle.iv;
      const data = new PasswordModel({
        user_id: req.user._id,
        title: encrypttitle.content,
        username: encryptUsername.content,
        password: encryptPassword.content,
        description: encryptdesc.content,
        iv: iv,
      });
      data.save();
      res.send({
        status: "success",
        message: "Password saved sccessfully",
        data: data,
      });
    } else {
      res.send({ status: "failed", message: "Title field is required" });
    }
  };

  static getData = async (req, res) => {
    const userId = req.user._id;
    const datas = await PasswordModel.find({ user_id: userId });
    const decryptDatas = datas.map((data) => {
      const decrypttitle = cryptoUtils.decrypt({
        content: data.title,
        iv: data.iv,
      });
      const decryptusername = cryptoUtils.decrypt({
        content: data.username,
        iv: data.iv,
      });
      const decryptpassword = cryptoUtils.decrypt({
        content: data.password,
        iv: data.iv,
      });
      const decryptdesc = cryptoUtils.decrypt({
        content: data.description,
        iv: data.iv,
      });
      return {
        id: data._id,
        title: decrypttitle,
        username: decryptusername,
        password: decryptpassword,
        description: decryptdesc,
      };
    });

    res.send({ data: decryptDatas });
  };

  static updateData = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    try {
      // Fetch the user data
      const userData = await PasswordModel.findOne({
        _id: id,
        user_id: userId,
      });

      if (!userData) {
        return res
          .status(404)
          .send({ status: "failed", message: "Invalid ID" });
      }

      const { title, username, password, description } = req.body;

      // Check if title is provided
      if (!title) {
        return res
          .status(400)
          .send({ status: "failed", message: "Title field is required" });
      }

      // Encrypt data
      const encryptTitle = cryptoUtils.encrypt(title);
      const encryptUsername = cryptoUtils.encrypt(username || "");
      const encryptPassword = cryptoUtils.encrypt(password || "");
      const encryptDescription = cryptoUtils.encrypt(description || "");

      // Update the user data
      const updatedData = await PasswordModel.findByIdAndUpdate(
        id,
        {
          $set: {
            title: encryptTitle.content, // Use correct property names
            username: encryptUsername.content,
            password: encryptPassword.content,
            description: encryptDescription.content,
            iv: userData.iv, // Reuse the existing IV
          },
        },
        { new: true } // This option returns the updated document
      );

      if (!updatedData) {
        return res.status(400).send({
          status: "failed",
          message: "Failed to update the data",
        });
      }

      res.send({ status: "success", message: "Data is updated successfully" });
    } catch (error) {
      console.error("Error updating data:", error);
      res.status(500).send({
        status: "failed",
        message: "An error occurred while updating data",
      });
    }
  };

  static deleteData = async (req, res) => {
    const { id } = req.params;

    try {
      await PasswordModel.findByIdAndDelete(id);
      res.send({ status: "success", message: "Data deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .send({ status: "failed", message: "Error deleting data" });
    }
  };
}

export default PasswordController;
