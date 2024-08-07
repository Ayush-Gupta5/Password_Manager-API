import express from "express";
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/AuthMiddleware.js";

const router = express.Router();

//Route Level Middleware - to Protect Route
router.use("/change-password", checkUserAuth);
router.use("/profile", checkUserAuth);

//Public Routes
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);
router.post("/forget-password", UserController.forgetPassword);
router.post("/reset-password/:id/:token", UserController.userResetPassword);

//Protected Router
router.post("/change-password", UserController.userPasswordChange);
router.get("/profile", UserController.profile);
export default router;
