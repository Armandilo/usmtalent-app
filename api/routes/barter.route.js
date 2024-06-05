import express from 'express';
import { verifyToken } from "../middleware/jwt.js";
import { createBarter, deleteBarter, getBarter, getBarters, updateBarter, updateBarterStatus } from '../controller/barter.controller.js';


const router = express.Router();

router.post('/',createBarter);
router.delete('/:id', deleteBarter);
router.get('/:id', getBarter);
router.get('/', verifyToken ,getBarters);
router.put('/:id',updateBarter);
router.put('/status/:id',updateBarterStatus);

export default router;