import mongoose,{Schema} from "mongoose";
import bcrypt from bcrypt;
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema=new Schema({
      avatar:{
        type:{
            url:String,
            localPath:String,
        },
        default:{
            url:`https://placehold.co/200x200`,
            localpath="",
        }
      },
      usename:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
      },
      email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
      },
      fullname:{
        type:String,
        trim:true
      },
      password:{
        type:String,
        required:[true,"password is required"],
      },
      isEmailVerified:{
        type:Boolean,
        default:false,
      },
      refreshtoken:{
        type:String
      },
      forgotPasswordToken:{
        type:String
      },
      forgotPasswordExpiry:{
        type:Date
      },
      emailVerificationToken:{
        type:String
      },
      emailVerificationExpiry:{
        type:Date
      }      
    },{
    timestamps:true,
      }, );
userSchema.pre("save",async function(next){
  if(!this.isModified("password")) return next()    //password field badli hai kya ?  true(false nche wala chla do ) : false(true yhi se return kr jao yrr )
  this.password=await bcrypt.hash(this.password,10);
  next() 
})
// argument mei jo hai wo user ne jo type kra shi bhi ho skta hai nd galat bhi ho skta hai 
userSchema.methods.isPasswordCorrect=async function (password){  
  return await bcrypt.compare(password,this.password);  
}; 


userSchema.methods.generateAccessToken=function(){
  return jwt.sign({
    _id:this._id,
  },
  process.env.ACCESS_TOKEN_SECRET,
  {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
)
};

userSchema.methods.generateRefreshToken=function(){
  return jwt.sign({
    _id:this._id,
    email:this.email,
    username:this.username
  },
  process.env.REFRESH_TOKEN_SECRET,
  {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
)
};

userSchema.methods.generateTemporaryToken=function(){
  const unHashedtoken=crypto.randomBytes(20).to_string("hex")

  const hashedToken=crypto
        .createHash("sha256")
        .update(unHashedtoken)
        .digest("hex")
  const TokenExpiry=Date.now()+(20*60*1000)
  return {unHashedtoken,hashedToken,TokenExpiry}
};




export const User=mongoose.model("User",userSchema) 


//model bn gya user ke liye yrr 2