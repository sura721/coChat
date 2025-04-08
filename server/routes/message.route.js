import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { deleteMessage, getMessages, getUserForSideBar, sendMessage } from "../controllers/message.controller.js";
const router  = express.Router();

router.get('/users',protectRoute,getUserForSideBar)
router.get('/:id',protectRoute,getMessages)
router.post('/send/:id',protectRoute,sendMessage)
router.delete('/delete-message/:id',protectRoute,deleteMessage)

export default router