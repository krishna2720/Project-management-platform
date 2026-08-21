import mongoose,{Schema} from "mongoose";
import { AvailableTaskStatus ,TaskStatusEnum} from "../utils/constants.js";


const taskSchema=new Schema({
         title:{      //task ka name ....kya task hai 
            type:String,
            required:true,
            trim:true
         },
         description:String,   //task ke baarei mei thori detailing 
         project:{          //ye task kis project ka hai 
            type:Schema.Types.ObjectId,
            ref:"Project",
            required:true
         },
         assignedTo:{             //ye task kis member ya user ko assign hua hai 
            type:Schema.Types.ObjectId,
            ref:"User",
         },
         assignedBy:{            //ye task kisne assign kiya hai 
            type:Schema.Types.ObjectId,
            ref:"User",
         },
         status:{         //task ki current condition 
            type:String,
            enum:AvailableTaskStatus,
            default:TaskStatusEnum.TODO
         },
         attachment:{       //multiple file attach kr skte hoo isse 
            type:[{
                url:String,
                mimetype:String,
                size:Number
            }],
            default:[]
         }
},{timestamps:true})

export const Task=mongoose.model("Task",taskSchema)