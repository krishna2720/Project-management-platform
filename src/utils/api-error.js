class ApiError extends Error {
  constructor(statusCode, message,data=null) {   //errors and stack have default values
    super(message);

    this.statusCode = statusCode;
    this.message=message;
    this.data=data;
    this.success = false;  //eror response hai
  }
}  
export {ApiError};

/* error ke liye statuscode,message */