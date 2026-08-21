import mongoose,{Schema} from "mongoose";  
import bcrypt from "bcrypt";  //for pasword hashing    //alternative : scrypt ,sha256 isme brute force ekdm hojata 
import crypto from "crypto";  //for generating without data token i.e. random string
import jwt from "jsonwebtoken";  //for generate access token,refresh token 

const userSchema=new Schema({
      avatar:{
        type:{
            url:String,
            localPath:String,
        },
        default:{
            url:`https://placehold.co/200x200`,
            localPath:"",
        }
      }, //user pic 
      username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true  //search query fast 
      },
      email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
      },
      fullname:{
        type:String,
        trim:true
      },
      password:{
        type:String,
        minlength:8,
        required:[true,"Password is required"],
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

//cant use arrow function qki usme this ni hota 
//start this hook before saving to database
userSchema.pre("save",async function(next){
  if(!this.isModified("password")) return ;    //password dal chuke ho toh return kr jao wrna hash krdo .. 
  this.password=await bcrypt.hash(this.password,10);
})


// argument mei jo hai wo user ne jo type kra shi bhi ho skta hai nd galat bhi ho skta hai 
userSchema.methods.isPasswordCorrect=async function (password){  
  return await bcrypt.compare(password,this.password);  //isme normal and hash password ko cpmare krta bcrypt comparison 
}; 

//generating the access token
userSchema.methods.generateAccessToken=function(){
  return jwt.sign({
    _id:this._id,  //document id i.e. payload 
  },
  process.env.ACCESS_TOKEN_SECRET,
  {expiresIn:process.env.ACCESS_TOKEN_EXPIRY
      // algorithm: "HS512" expilicity mention the algorithm if wanted .. 
  }
)
};
//payload, secret,options  => header+payload+signature i.e. xxxx.yyyy.zzzz


//generating the refresh token
userSchema.methods.generateRefreshToken=function(){
  return jwt.sign({
    _id:this._id,
    email:this.email,
    username:this.username   //extra info for payload 
  },
  process.env.REFRESH_TOKEN_SECRET,
  {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
)
};


//genreating the unhashed token usng bcrypt
userSchema.methods.generateTemporaryToken=function(){
  const unHashedtoken=crypto.randomBytes(20).toString("hex")
  const hashedToken=crypto
        .createHash("sha256")  //which algo i want to use 
        .update(unHashedtoken)    //unhashed to hashed
        .digest("hex")           
  const TokenExpiry=Date.now()+(20*60*1000)   //expiry date 
  return {unHashedtoken,hashedToken,TokenExpiry}
};//UNHASHEDTOKEN->USER    ||  HASHEDTOKEN->DB->FORGETPASSWORDTOKEN PE || TOKENEXPIRY->DB->FORGETPASSWORDEXPIRY MEI 

export const User=mongoose.model("User",userSchema)    


//model bn gya user ke liye yrr 2