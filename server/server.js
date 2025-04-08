import express from "express";
import dotenv from "dotenv";
import auhRoutes from "./routes/auth.route.js";
import messageRouth from "./routes/message.route.js";
import friendshipRoute from "./routes/friendship.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from 'cors';
import { app, server, io } from "./lib/socket.js";

import session from "express-session";
import googleRoute from "./routes/oAuth.route.js";
import "./secure/passport.secure.js";
dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use(session({
  secret: 'keyboard cat', // Remember to use a strong, secret key, maybe from .env
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); 

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use("/api/auth", auhRoutes);
app.use("/api/message", messageRouth);
app.use("/api/users", friendshipRoute);
app.use("/", googleRoute); 
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
 
  connectDB();
});