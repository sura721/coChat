import mongoose, { model, trusted } from "mongoose";
const userSchema = new mongoose.Schema(
  {
email:{
  type:String,
  required:true,
  unique:true
},
username:{
  type:String,
  required:true,
  unique:true
},
fullname:{
  type:String,
  required:true

},
profilePic:{
  type:String,
  default:""
},
password:{
  type:String,
  minlength:6,
  required:function(){return !this.googleId},

},
bio:{
  type:String,
  maxlength:[200,'Bio cannot exceed 200 characters']
  
},
googleId: {
  type: String,
  unique: true,
  sparse:true
}
,

    isVerified: { type: Boolean, default: false }, 
  verificationCode: String,
friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  },
{  timestamps:true}
);

const User = mongoose.model("User",userSchema)
export default User;