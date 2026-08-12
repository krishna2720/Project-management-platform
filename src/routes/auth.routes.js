import { Router } from "express";
//controller se laare route bnare hai isme 
import { registerUser ,loginUser} from "../controllers/auth.controller.js";
//controller -> router-> app.js -> index.js  ye hai flow bhai mere 

import { validate } from "../middleware/validator.middleware.js"; 
import { userRegisterValidator,userLoginValidator } from "../validators/index.js";
const router=Router();

//register krne se pehle ye bhi chl jaye middleware and validator 
 router.route("/register").post(userRegisterValidator(),validate,registerUser);

 router.route("/login").post(userLoginValidator(),validate,loginUser);

export default router; 