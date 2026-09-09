import { Router } from "express";
import { registerUserController , loginUserController,  getCurrentUserController, updateCurrentUserController, changePasswordController, getAllUsersController, getUserByIdController, updateUserRoleController,} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {adminMiddleware} from "../middlewares/admin.middleware.js";
import { updateUserStatusController } from "../controllers/product.controller.js";

const router = Router();

router.post("/register", registerUserController);

router.post("/login", loginUserController);

router.get("/me",authMiddleware, getCurrentUserController);

router.patch( "/me",authMiddleware,updateCurrentUserController);

router.patch("/me/password",authMiddleware,changePasswordController);

router.get("/", authMiddleware, adminMiddleware, getAllUsersController);

router.get("/:userId",authMiddleware,adminMiddleware,getUserByIdController);

router.patch("/:userId/role",authMiddleware,adminMiddleware,updateUserRoleController);

router.patch("/:userId/status",  authMiddleware,adminMiddleware,updateUserStatusController);

export default router;