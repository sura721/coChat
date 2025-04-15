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
import MongoStore from 'connect-mongo'; 
import googleRoute from "./routes/oAuth.route.js";
import "./secure/passport.secure.js"; 
dotenv.config();


const sessionSecret = process.env.SESSION_SECRET;
const mongoUrl = process.env.MONGO_URL;
const nodeEnv = process.env.NODE_ENV;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"; 

if (!sessionSecret || !mongoUrl) {
    console.error("FATAL ERROR: SESSION_SECRET or MONGO_URL environment variables not set.");
    process.exit(1);
}


app.set('trust proxy', 1);

app.use(cors({ 
    origin: frontendUrl, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(cookieParser());
app.use(express.json());

app.use(session({
    secret: sessionSecret, 
    resave: false,
    saveUninitialized: false, 
    store: MongoStore.create({ 
        mongoUrl: mongoUrl,
       
    }),
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24 * 7, 
        httpOnly: true,
      
        secure: nodeEnv === "production",
        
        sameSite: nodeEnv === "production" ? 'none' : 'lax'
    }
}));


app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", auhRoutes);
app.use("/api/message", messageRouth);
app.use("/api/users", friendshipRoute);
app.use("/", googleRoute);

app.get('/api/health', (req, res) => {
    console.log(`[${new Date().toISOString()}] ChatApp Health check ping received.`); 
    res.status(200).json({ status: 'ok', message: 'ChatApp server is healthy.' });
  });
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    connectDB();
});