import passport from 'passport';
import dotenv from 'dotenv'
dotenv.config()
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

const frontEndUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
export const googleCallback = (req, res) => {
  if (!req.user) {
    return res.redirect('/signup'); 
  }

  res.redirect(frontEndUrl); 
};

export const getUser = (req, res) => {
  if (req.user) {
    return res.json(req.user);  
  } else {
    return res.status(401).json({ message: 'User not authenticated' });  
  }
};
export const getMe = (req, res) => {
 
  if (req.user) {
    res.status(200).json(req.user); 
  } else {

    res.status(401).json({ message: "Not authenticated (unexpected state)" });
  }
};