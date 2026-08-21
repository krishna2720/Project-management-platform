import mongoose,{Schema} from "mongoose";
import { userRolesEnum,AvailableUserRole } from "../utils/constants";

const projectMemberSchema=new Schema ({
    user:{        //kaunsa user iss project ka member hai 
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    project:{        //kaunse project ko bolra hai 
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },  
    role:{               //is proejct mei user ka kya role hai 
        type:String,
        enum:AvailableUserRole,
        default:userRolesEnum.MEMBER
    }

},{timestamps:true})

export const ProjectMember=mongoose.model("ProjectMember",projectMemberSchema)