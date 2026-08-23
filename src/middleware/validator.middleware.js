//Create middleware to validate the data if eror throw the eror
/*bhai ye vo hai like eror aagyi validation mei toh throw kr dega eror else smoothly next() middleware ya controller ko request dedega */ 
import {validationResult} from "express-validator"  //Validation results will be given by express-validator
import {ApiError} from "../utils/api-error.js"      //To throw error in standard format we created in utils globally 

export const validate=(req,res,next)=>{
    //Before this middleware, all validators have runand attached their errors to req 
    const errors=validationResult(req)          // collect all the erors 
    //If we dont have any error, we dont have to do anything, move to next middleware
    //But if we do have error, Extract errors into an array and pass so that it can be read

    if(errors.isEmpty())
        return next();  //no erors

    const extractedErrors=[]
    /*errors.array().map((err)=> extractedErrors.push
    ({
        [err.path]:err.msg
    })) //Pushing errors along with their path and msg*/
    for (const err of errors.array()) {
        const errorObject = {};
        errorObject[err.path] = err.msg;
        extractedErrors.push(errorObject);
    }
    throw new ApiError(422, "Received data is not valid",extractedErrors)
}

//Validation result given by express-validator. If its empty, next. If not empty, extract errors and throw
//This middleware can be used for both userRegistrationValidator and userLoginValidator files