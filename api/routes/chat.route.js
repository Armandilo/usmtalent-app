import express from "express";
import {
  createChat,
  getChat,
  getSingleChat,
  updateChat,
} from "../controller/chat.controller.js"
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", verifyToken, getChat);
router.post("/", verifyToken, createChat);
router.get("/single/:id", verifyToken, getSingleChat);
router.put("/:id", verifyToken, updateChat);

export default router;