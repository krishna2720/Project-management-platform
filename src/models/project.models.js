import mongoose,{Schema} from "mongoose";

const projectSchema=new Schema({
     name:{       //name of the project 
        type:String,          
        required:true,
        unique:true,
        trim:true
     },
     description:{         //project ke baarei mei basic details  
        type:String,
     },
     createdBy:{      //kiss user ne create kra project user->project
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
     }
},{timestamps:true})

export const Project=mongoose.model("Project",projectSchema);