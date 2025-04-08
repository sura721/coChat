import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { findUser, handleMessageClick } from "../controllers/friendShip.controller.js"

const router = express.Router();

router.get('/search-user', protectRoute, findUser);
router.post('/add-friend', protectRoute, handleMessageClick);


export default router;
