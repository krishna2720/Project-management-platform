//isme saara express ka code daal dege so no mixing 
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
const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((url) => url.trim()) : []),
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
import healthcheckrouter from "./routes/heathcheck.route.js";

import authRouter from "./routes/auth.routes.js";
 
import projectRouter from "./routes/project.routes.js";

import taskRouter from "./routes/task.routes.js";

import noteRouter from "./routes/notes.routes.js";

app.use("/api/v1/auth",authRouter);   //ye path aur add krdena url mei 

app.use("/api/v1/healthcheck",healthcheckrouter);
 /*Client request bhejta hai → Express app request receive karta hai → app.use() ke through request correct router ko forward hoti hai → Router URL aur HTTP method match karta hai → Controller execute hota hai → Agar zarurat ho to database se interact karta hai → Controller response banata hai → Express browser ko JSON response bhej deta hai.*/
app.use("/api/v1/projects",projectRouter);  //projectrouter import kiya hai humne yrr 

app.use("/api/v1/tasks", taskRouter);

app.use("/api/v1/notes",noteRouter);

app.get("/",(req,res)=>{
    res.send("Hello World");
});
app.get('/api/v1/jokes',(req,res)=>{
    const jokes=[
        {
            id:1,
            title:"a joke",
            content:"this is a joke"
        },
        {
            id:2,
            title:"another joke",
            content:"this is another joke"
        },{
            id:3,
            title:"a third joke",
            content:"this is a third joke"
        }

    ];
    res.send(jokes);
})
app.get("/instagram",(req,res)=>{
    res.send("Hello instagram");
});
app.get("/krishna",(req,res)=>{
    res.send("ye frontend hai krishna bhai yrr ");
});

export default app;