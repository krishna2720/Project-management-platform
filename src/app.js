//isme saara express ka code daal dege bhai hum yrr bakchodi ni hogi phr 
import express from "express";
const app=express();
import cors from "cors";

//basic configuration
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
//cors ka configurtion
app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials:true,
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
     allowedHeaders:["Content-type","Authorization"],
    }),
);

app.get("/",(req,res)=>{
    res.send("Hello World");
});
app.get("/instagram",(req,res)=>{
    res.send("Hello instagram");
});




export default app;