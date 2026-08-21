class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = "") {   //errors and stack have default values
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;  //eror response hai 

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}  
export {ApiError};
/* error ke liye statuscode,data,message */