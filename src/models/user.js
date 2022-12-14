import mongoose from "mongoose";
import {Schema}  from "mongoose";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import organizationSchema from "./organization";

const userSchema = new Schema({
  _id:{
    type:String,
    default:()=> nanoid()
  },
  firstName:{
    type:String,
    required:true
  },
  lastName:{
    type:String,
    required:true
  },
  userName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true,
  },


}, { timestamps: true });


 userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(12)
    const passwordhash = await bcrypt.hash(this.password, salt);
    this.password = passwordhash
    next();
  }
  catch {
   return next(error)

  }
})
userSchema.pre('findOneAndUpdate', async function (next) {
  try {
   
    if (this.password) {
      
      const passwordhash = await bcrypt.hash(this.password, 10);
      this.password = passwordhash;
    
    }
     next();
  }
  catch(err) {
    console.log("err======",err)
   return next(err)

  }
});

let user = mongoose.model("user",userSchema);
  export default user