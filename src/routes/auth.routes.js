import { Router } from "express";
//controller se laare route bnare hai isme 
import { registerUser ,loginUser, logoutUser, verifyEmail, refreshAccessToken, forgotPasswordRequest, resetForgotPassword, getCurrentUser, changeCurrentPassword, resendEmailVerification} from "../controllers/auth.controller.js";
//controller -> router-> app.js -> index.js  ye hai flow bhai mere 

import { validate } from "../middleware/validator.middleware.js"; 
import { userRegisterValidator,userLoginValidator, userForgotPasswordValidator, userResetForgotPasswordValidator, userChangeCurrentPasswordValidator } from "../validators/index.js";
const router=Router();

import { verifyJWT } from "../middleware/auth.middleware.js";

//unsecured route 
//register krne se pehle ye bhi chl jaye middleware and validator 
 router.route("/register").post(userRegisterValidator(),validate,registerUser);

 router.route("/login").post(userLoginValidator(),validate,loginUser);

 router.route("/verify-email/:verificationToken").get(verifyEmail);

 router.route("/refresh-token").post(refreshAccessToken);

 router.route("/forgot-password").post(userForgotPasswordValidator(),validate, forgotPasswordRequest);

 router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(),validate, resetForgotPassword);


//secure routes 
 router.route("/logout").post(verifyJWT,logoutUser);

 router.route("/current-user").post(verifyJWT,getCurrentUser);

 
 router.route("/change-password").post(verifyJWT,userChangeCurrentPasswordValidator(),validate,changeCurrentPassword);

  
 router.route("/resend-email-verification").post(verifyJWT,resendEmailVerification);

 

export default router; 