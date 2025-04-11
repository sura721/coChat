import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt, { genSalt } from "bcrypt";
import nodemailer from "nodemailer"
import { sendOTP } from "../lib/utils.js";




export const signup = async (req, res) => {
  const { fullname, password, email, username } = req.body;

  try {
      if (!fullname || !password || !email || !username) {
          return res.status(400).json({ message: "All fields are required" });
      }
      if (password.length < 6) {
          return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/;
      if (!usernameRegex.test(username)) {
          return res.status(400).json({ message: "Invalid username format (4-16 chars, letters, numbers, _)." });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
           return res.status(400).json({ message: "Invalid email format." });
      }

      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
          if (existingUser.email === email) {
              return res.status(409).json({ message: 'Email is already registered.' });
          }
          if (existingUser.username === username) {
              return res.status(409).json({ message: 'Username is already taken.' });
          }
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const verificationCode = Math.floor(10000 + Math.random() * 90000); 
      const newUser = new User({
          email,
          fullname,
          username,
          password: hashedPassword,
          verificationCode, 
          isVerified: false 
      });

      try {
          await newUser.save(); 
sendOTP(email,verificationCode)
          return res.status(201).json({ message: 'Signup successful! Please check your email for the verification code.' });

      } catch (dbError) {
          if (dbError.code === 11000) {
              const field = Object.keys(dbError.keyValue)[0];
      
              return res.status(409).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already taken (concurrent registration).` });
          }
          throw dbError;
      }

  } catch (err) {
      if (!res.headersSent) {
          res.status(500).json({ message: "Internal Server Error during signup." });
      }
  }
};


export const verifyOTP = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
      return res.status(400).json({ message: "Email and verification code are required." });
  }

  const verificationCodeInput = code.trim(); 


  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: "User associated with this email not found." });
      }

      if (user.isVerified) {
           return res.status(400).json({ message: 'This account has already been verified.' });
      }

      if (!user.verificationCode) {
           return res.status(400).json({ message: 'No pending verification code found for this user. It might have expired or already been used.' });
      }

   
      if (user.verificationCode === verificationCodeInput) {
          user.verificationCode = null; 
          user.isVerified = true;     

          await user.save(); 

          generateToken(user._id, res); 

          return res.status(200).json({
              _id: user._id,
              fullname: user.fullname,
              username: user.username,
              email: user.email,
              isVerified: user.isVerified,
              message: "Email verified successfully! You are now logged in."
          });

      } else {
          return res.status(400).json({ message: "Invalid code" });
      }

  } catch (err) {
      if (!res.headersSent) {
          res.status(500).json({ message: "Internal Server Error during verification." });
      }
  }
};


export const resendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: ' page refreshed ,Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const verificationCode = Math.floor(10000 + Math.random() * 90000); 
    await sendOTP(email, verificationCode);

   
    user.verificationCode = verificationCode;
    await user.save();

    res.status(200).json({ message: 'OTP has been resent' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to resend OTP, pls try again later' });
  }
};

export const deleteAccount = async (req, res) => {
  const { confirmationCode, email } = req.body;
  

  try {

    if (!confirmationCode || !email) {
      return res.status(400).json({ message: "Email and confirmation code are required" });
    }

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    if (confirmationCode !== user.verificationCode) {
      return res.status(400).json({ message: "Invalid confirmation code" });
    }

    
    await User.deleteOne({ email });

   
    return res.status(200).json({ message: "Account deleted successfully" });
    
  } catch (err) {
    res.status(500).json({ message: "Unknown Error!" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const isPwdCorrect = await bcrypt.compare(password, user.password);

    if (!isPwdCorrect) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    if (req.isAuthenticated()) {
      req.logout((err) => {
        if (err) {
          return res.status(500).json({ msg: "OAuth logout failed" });
        }
      });
    }

    res.cookie("jwt", "", { maxAge: 0 }); 

    return res.status(200).json({ msg: "Logged out successfully!" });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio } = req.body;
    const userId = req.user._id;

    if (!profilePic && !bio) {
      return res.status(400).json({ message: "Profile pic or bio is required to update" });
    }

    const updatedData = {}; 

    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updatedData.profilePic = uploadResponse.secure_url;
    }

    if (bio) {
      updatedData.bio = bio;
    }

   
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    let user;

    if (req.user) {
    
      user = req.user;
    } else if (req?.user?._id || req?.userId) {
      
      const userId = req.user?._id || req.userId;
      user = await User.findById(userId).select("-password");
    }

    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
