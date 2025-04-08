import express from 'express';
const router = express.Router();

import { googleAuth, getUser } from '../controllers/oAuth.controller.js';
import passport from 'passport';
import { getMe } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

router.get('/auth/google',googleAuth); 
router.get('/api/auth/me',protectRoute,getMe)
router.get('/auth/google/callback',
  passport.authenticate('google', { 
    successRedirect: 'http://localhost:5173/', 
    failureRedirect: 'http://localhost:5173/login?error=google-auth-failed'
  })
);

router.get('/api/google/user', getUser);

export default router;