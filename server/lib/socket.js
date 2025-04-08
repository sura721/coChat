import { Server } from "socket.io";

import express from "express"
import http from "http"
const app = express();
const server = http.createServer(app);
const io = new Server(server,{cors:{origin:["http://localhost:5173"]}})

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