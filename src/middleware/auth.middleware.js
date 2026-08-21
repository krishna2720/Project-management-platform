//Middleware to check is this request authenticated or not(by verifying JWT) and appending user to request
/**acess token ke payload se id nikalke database se id verify krke humne updated user ko chipka diya request mei isse verify bhi hogya valid user hai and chipka bhi dia **/
//By checking is this request contains valid AT or not

//ye bich se token utha leg yrr 
import {User} from "../models/users.models.js"      //TO verify accessToken and extract payload from accessToken
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import jwt from "jsonwebtoken"         //To decode access token

//Method to authorize accessToken
export const verifyJWT=asyncHandler(async (req,res,next) => {
    
    //1. Access the accessToken: 2 ways- req.cookies? 
    // Or req.header("Authorization")?.replace("Bearer ","") coz accessToken stored as BearerAT

    const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")   //if present then ok else not give eror 

    if(!token){
        throw new ApiError(401,"Unauthoised Request")
    }

    //2. Decode the accessToken and find user in database   //DECODE SIRF padhega text and verify check bhi karega ki whi hai ya expired toh ni hua dono
    try {
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)   //token verify + decode also  + return payload/throw error catch by direct niche
       
        //ab database isleye hit kia kyuki token stale ho skta latest db statee chahiye isleye 

        const user=await User.findById(decodedToken?._id).select(
            "-password -emailVerificationExpiry -emailVerificationToken -forgotPasswordExpiry -forgotPasswordToken -refreshToken"
        )   
    //Except these fields, select all other fields of user from DB       //._id milgyi user ki dost 

        if(!user){
            throw new ApiError(401,"Invalid access token")
        }

    //3. Append user to request so that controllers can know which user is making request
        req.user=user    //frontend i.e. req mei database user chipka diya yr 
        next()              //Flag to move roquest to next middleware
    } catch (error) {   
        throw new ApiError(401,"Invalid access token or expired token or wrong secret or malformed token ")
    }
})