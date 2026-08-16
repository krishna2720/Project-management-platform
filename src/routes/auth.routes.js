import { Router } from "express";
//controller se laare route bnare hai isme 
import { registerUser ,loginUser, logoutUser} from "../controllers/auth.controller.js";
//controller -> router-> app.js -> index.js  ye hai flow bhai mere 

import { validate } from "../middleware/validator.middleware.js"; 
import { userRegisterValidator,userLoginValidator } from "../validators/index.js";
const router=Router();

import { verifyJWT } from "../middleware/auth.middleware.js";


//register krne se pehle ye bhi chl jaye middleware and validator 
 router.route("/register").post(userRegisterValidator(),validate,registerUser);

 router.route("/login").post(userLoginValidator(),validate,loginUser);


 router.route("/logout").post(verifyJWT,logoutUser);



export default router; 