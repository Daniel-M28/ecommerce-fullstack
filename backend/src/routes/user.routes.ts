import { Router } from "express";
import { registerUserController , loginUserController,  getCurrentUserController, updateCurrentUserController, changePasswordController,} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);

router.get("/me",authMiddleware, getCurrentUserController);

router.patch( "/me",authMiddleware,updateCurrentUserController);

router.patch("/me/password",authMiddleware,changePasswordController);


export default router;