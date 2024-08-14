import express from "express";
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/AuthMiddleware.js";
import PasswordController from "../controllers/passwordController.js";

const router = express.Router();

//Route Level Middleware - to Protect Route
router.use("/change-password", checkUserAuth);
router.use("/profile", checkUserAuth);
router.use("/data-create", checkUserAuth);
router.use("/data-get", checkUserAuth);
router.use("/data-update/:id", checkUserAuth);
router.use("/data-delete/:id", checkUserAuth);

//Public Routes
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);
router.post("/forget-password", UserController.forgetPassword);
router.post("/reset-password/:id/:token", UserController.userResetPassword);

//Protected Router
router.post("/change-password", UserController.userPasswordChange);
router.get("/profile", UserController.profile);
router.post("/data-create", PasswordController.userData);
router.post("/data-get", PasswordController.getData);
router.post("/data-update/:id", PasswordController.updateData);
router.post("/data-delete/:id", PasswordController.deleteData);
export default router;
