import mongoose,{Schema} from "mongoose";

const projectNoteSchema=new Schema({
     project:{   //ye note kis project ka hai 
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true,
     },
     createdBy:{         //kisne ye create kiya hai 
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
     },
     content:{        //isme hmne kra kya hai  like note of project
        type:String,
        required:true,
     }
},{timestamps:true})

export const ProjectNote=mongoose.model("ProjectNote",projectNoteSchema);