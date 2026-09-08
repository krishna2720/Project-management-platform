import dotenv from "dotenv"
dotenv.config();   //env file variable access

import app from "./app.js";    //app ko listen krna isme bss 

import connectDB from "./db/index.js";



const port=process.env.PORT || 3000;  //cant fetch from .env then 3000 


//jab connect ho database se jab hi port listen kre hum yrr 
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