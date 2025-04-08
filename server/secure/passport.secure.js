import passport from "passport";
import GoogleStrategy from 'passport-google-oauth20';
import User from "../models/user.model.js";
import { generateUsername } from "../lib/utils.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {

  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
    } else {
      user = await User.create({
        googleId: profile.id,
        fullname: profile.displayName,
        email: profile.emails[0].value,
        username: generateUsername(profile.displayName),
        profilePic: profile.photos[0].value,
        isVerified: true
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    done(err, null);
  }
});
