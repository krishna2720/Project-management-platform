//Create validators to validate input data pass through the frontend 
import {body} from "express-validator"  
import { AvailableUserRole } from "../utils/constants.js"
//Validation method: Returns an array after validating input fields by validation methods and message
const userRegisterValidator=() => {
    return [
        body("email")     //req.body->email(frontend se jo ayai hai)
        .trim()       //eliminate extra space 
        .notEmpty()         //These are validations that I run on input fields along with message
        .withMessage("Email is required")   //Attach withMessage after validation method to show a message if a validation fails
      //  .bail()  agar aage ki eror ni chalani toh yhiu stop hojayega gar khali bheja toh  
        .isEmail()
        .withMessage("Please enter the valid email !!"),
        body("username")    //req.body->username 
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLowercase()
        .withMessage("Username must be in lowercase")
        .isLength({min:3})          //Min 3 chars in username
        .withMessage("Username must be aleast 3 characters long"),
        body("password")      //req.body->password
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({min:8})
        .withMessage("Password must be atleast 8 characters long"),
        body("fullname")      //req.body->fullname 
        .optional()
        .trim()

    ]
}

const userLoginValidator=() => {          //email and password se login krega toh unpe rules bna doo jisse galat na dal paye 
    return [
        body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is not valid"),
        body("password")
        .notEmpty()
        .withMessage("Password is required")
    ]
}
//agar empty hui toh niche wlaa message chalega yrr 
const userChangeCurrentPasswordValidator=() => {       // when old password and newpassowrd is enetered by the user 
    return [
        body("oldPassword")
        .notEmpty()
        .withMessage("Old Password is required field"),
        body("newPassword")
        .notEmpty()
        .withMessage("New Password is required field")
    ]
}

const userForgotPasswordValidator=()=>{     //when user forget password then email is entered by the user 
    return [
        body("email")
        .notEmpty()
        .withMessage("Email address is required field")
        .isEmail()
        .withMessage("Email is Invalid ")
    ]
}

const userResetForgotPasswordValidator=()=>{      //now user enter the new password 
    return [
        body("newPassword")
        .notEmpty()
        .withMessage("Password is required")
    ]
}

const createProjectValidator=()=>{
    return [
        body("name")
          .notEmpty()
          .withMessage("Name is required"),
        body("description").optional(),
    ];
};
const addMembertoProjectValidator=()=>{
     return [
        body("email")
          .trim()
          .notEmpty()
          .withMessage("email is required")
          .isEmail()
          .withMessage("email is invalid"),
        body("role")
           .notEmpty()
           .withMessage("Role is required")
           .isIn(AvailableUserRole)
           .withMessage("role is invalid"),
     ];
}

export {
    userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createProjectValidator,
    addMembertoProjectValidator
}
//requesthit -> validator-> validator middleware(if error and throw eror) ->controller
