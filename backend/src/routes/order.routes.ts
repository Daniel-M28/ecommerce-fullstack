import { Router } from "express";
import { cancelOrderController, createOrderController } from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getUserOrdersController } from "../controllers/order.controller.js";
import { getUserOrderController, getAllOrdersController,  updateOrderStatusController, } from "../controllers/order.controller.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";


const router = Router();

router.post("/", authMiddleware, createOrderController);

router.get("/", authMiddleware, getUserOrdersController);

router.get("/admin",authMiddleware, adminMiddleware,getAllOrdersController);

router.get("/:orderId", authMiddleware, getUserOrderController);

router.patch("/:orderId/cancel", authMiddleware, cancelOrderController);

router.patch("/:orderId/status", authMiddleware, adminMiddleware, updateOrderStatusController);

export default router;