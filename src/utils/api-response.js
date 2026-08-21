//standard api format for each response 
class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode;
        this.data=data;               //user , project  , task 
        this.message=message;        //login succesfull , project created , task deleted 
        this.success=statusCode<400;
    }
}
export {ApiResponse};

/*statuscode,data,message*/