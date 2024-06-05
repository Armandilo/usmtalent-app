import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getOrders, intent, intentbarter, createOrder,confirm , getSingleOrder, getOrderDetails, getSingleBarterOrder, updateOrderDesc,updateOrderDesc2, updateOrderStatus, updateOrderFiles} from "../controller/order.controller.js";

const router = express.Router();

// router.post("/:gigId", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/:id", getSingleOrder);
router.post("/create-payment-intent/:id", verifyToken, intent);
router.post("/create-barter-intent/:id", verifyToken, intentbarter);
router.post("/create-barter/:id", verifyToken, createOrder);
router.put("/", verifyToken, confirm);
router.get('/details/:paymentIntentId', getOrderDetails);
router.put("/desc/:id", updateOrderDesc);
router.put("/desc2/:id", updateOrderDesc2);
router.put("/status/:id", updateOrderStatus);
router.put("/files/:id", updateOrderFiles);
router.get('/barter/:id', getSingleBarterOrder);

export default router;