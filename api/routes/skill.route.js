import express from "express";
import {
  createSkill,
  deleteSkill,
  getSkill,
  getSkills,
  updateSkill


} from "../controller/skill.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createSkill);
router.delete("/:id", verifyToken, deleteSkill);
router.get("/single/:id", getSkill);
router.get("/", getSkills);
router.put("/:id", verifyToken, updateSkill);



export default router;