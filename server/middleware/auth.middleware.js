import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  const token = req.cookies.jwt;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No Token or Session found" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    try {
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res
          .status(404)
          .json({ message: "User belonging to this token no longer exists." });
      }
      req.user = user;
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error during authentication" });
    }
  });
};
