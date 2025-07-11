import express from "express";
import { getMessages,sendMessage } from "../controlers/messagecontroller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get('/:id',protectRoute,getMessages);
router.post('/send/:id',protectRoute,sendMessage);

export default router;