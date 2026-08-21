const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise
        .resolve(requestHandler(req,res,next))
        .catch((err)=>next(err))  // Wrapper automatically errors catch karke next(err) kar dega.

    }
}; 
export {asyncHandler};
/*
try{}
catch(e){
   next(e)
}  ye sab likhne pdte yr hr baar usse bdia ek baar y e
*/

