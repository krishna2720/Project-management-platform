import mongoose from "mongoose";
//mongoose.connect(process.env.MONGO_URI); eror ho ske isme yrr 
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB is connected KRISHNA");
    }
    catch(error){
        console.log("mngo db cononection ERROR",error)
        process.exit(1);
    }
}
export default connectDB;