import { Server } from "socket.io";

import express from "express"
import http from "http"
import dotenv  from 'dotenv'
dotenv.config()
const app = express();
const server = http.createServer(app);
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"; 
const io = new Server(server,{cors:{origin:[frontendUrl]}})

const userSocketMap={};

io.on('connection',(socket)=>{
  const userId=socket.handshake.query.userId;
  if(userId) userSocketMap[userId]=socket.id
io.emit('getOnlineUsers',Object.keys(userSocketMap))


  socket.on('disconnect',()=>{
    delete userSocketMap[userId]
    io.emit('getOnlineUsers',Object.keys(userSocketMap))
    
  })
})
export function socketIdgetter(userId) {
  return userSocketMap[userId]
}


export {app,server,io}