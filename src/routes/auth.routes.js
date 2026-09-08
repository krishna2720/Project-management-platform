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
// router.route("/register").post(userRegisterValidator(),validate,registerUser);
router.post("/register",userRegisterValidator(),validate,registerUser);

router.post("/login",userLoginValidator(),validate,loginUser);


router.get("/verify-email/:verificationToken", verifyEmail);

router.post("/refresh-token", refreshAccessToken);


router.post("/forgot-password", userForgotPasswordValidator(), validate, forgotPasswordRequest);

router.post("/reset-password/:resetToken",userResetForgotPasswordValidator(),validate,resetForgotPassword);

router.route("/logout").post(verifyJWT, logoutUser);

router.post("/current-user", verifyJWT, getCurrentUser);

router.post("/change-password",verifyJWT,userChangeCurrentPasswordValidator(),validate,changeCurrentPassword);

router.post("/resend-email-verification",verifyJWT,resendEmailVerification);

export default router; 