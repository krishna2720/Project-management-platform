import mongoose,{Schema} from "mongoose";

const subTaskSchema=new Schema({
    title:{      //subtask ka title 
        type:String,
        required:true,
        trim:true
    }, 
    task:{       //ye subtask kis task ka part hai 
        type:Schema.Types.ObjectId,
        ref:"Task",
        required:true
    },
    isCompleted:{           //ye subtask complete hua ya ni 
        type:Boolean,
        default:false,
    },
    createdBy:{         //ye subtask kis user ne bnaya hai 
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true});
 
 export const Subtask=mongoose.model("Subtask",subTaskSchema);