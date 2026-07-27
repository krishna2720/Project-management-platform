import dotenv from "dotenv"
dotenv.config();
import app from "./app.js";
import connectDB from "./db/index.js";



const port=process.env.PORT || 3000;

connectDB()
      .then(()=>{
        app.listen(port,()=>{
            console.log(`app listening on the port yrr ${port}`);
        });
      })
      .catch((err)=>{
        console.log("mongo db connectio1n error",err);
        process.exit(1);
      })