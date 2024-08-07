import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

let checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      //Get token from header
      token = authorization.split(" ")[1];

      //Verify token
      const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

      //Get User from Token
      req.user = await UserModel.findById(userId).select("-password");
      next();
    } catch (error) {
      res.status(401).send({ status: "failed", message: "Unauthorized User" });
    }
  }
  if (!token) {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorized User, No token" });
  }
};

export default checkUserAuth;
