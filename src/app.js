//isme saara express ka code daal dege bhai hum yrr bakchodi ni hogi phr 
import express from "express";
const app=express();
import cors from "cors";

//basic configuration
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))


import cookieParser from "cookie-parser";
app.use(cookieParser())


//cors ka configurtion
app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials:true,
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
     allowedHeaders:["Content-type","Authorization"],
    }),
);

import healthcheckrouter from "./routes/heathcheck.route.js";
import authRouter from "./routes/auth.routes.js";

app.use("/api/v1/auth",authRouter);   //ye path aur add krdena url mei 
app.use("/api/v1/healthcheck",healthcheckrouter);
 /*Client request bhejta hai → Express app request receive karta hai → app.use() ke through request correct router ko forward hoti hai → Router URL aur HTTP method match karta hai → Controller execute hota hai → Agar zarurat ho to database se interact karta hai → Controller response banata hai → Express browser ko JSON response bhej deta hai.*/

app.get("/",(req,res)=>{
    res.send("Hello World");
});
app.get("/instagram",(req,res)=>{
    res.send("Hello instagram");
});




export default app;