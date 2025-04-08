import { io, socketIdgetter } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary"


export const getUserForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; 
    const loggedInUser = await User.findById(loggedInUserId);

    if (!loggedInUser) {
      return res.status(404).json({ msg: "User not found" });
    }


    const friends = loggedInUser.friends;
    const filteredUser = await User.find({_id:{$in:friends}})
    return res.status(200).json(filteredUser); 

  } catch (err) {
    return res.status(500).json({ msg: "Server error" }); 
  }
};
export  const getMessages = async( req,res)=>{
try {
  const myId = req.user._id;

const {id:userIdToChat} = req.params;
const messages = await Message.find({
  $or: [
    { senderId: myId, recieverId: userIdToChat },
    { senderId: userIdToChat, recieverId: myId }
  ]
});

  return res.status(200).json(messages);

} catch (err) {
  return res.status(500).json({ msg: "server Error" });
}
}


export const sendMessage = async(req,res)=>{
  try {
    const {text,image} =req.body;
    const senderId = req.user._id;
    const {id:recieverId} = req.params;
 
    let imageUrl;
    if(image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
imageUrl=uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,recieverId,
      text,image:imageUrl
      
    })
    await newMessage.save();

    const userSocket =  socketIdgetter(recieverId)
    io.to(userSocket).emit('newMsg',newMessage)
     return res.status(200).json(newMessage);


  }  catch (err) {
    return res.status(500).json({ message: "please connect to internet" });
  }

}
export const deleteMessage = async(req,res)=>{
  const {id:messageId} = req.params;
 try {
   await Message.findByIdAndDelete(messageId)
   const messages= await Message.find()
   res.status(200).json(messages)
   
 } catch (err) {

  res.status(500).json({message:'Error on deleting message'})
 }
}