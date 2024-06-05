import express from "express";
import {
  createChatMessage,
  getChatMessages,
} from "../controller/chatmessage.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createChatMessage);
router.get("/:id", verifyToken, getChatMessages);

export default router;