
import {User} from "../models/users.models.js"  //query anything from database 
import { Project } from "../models/project.models.js" 
import { ProjectMember } from "../models/projectmember.models.js"


import {ApiResponse} from "../utils/api-response.js"   
import {ApiError} from "../utils/api-error.js"   
import { asyncHandler } from "../utils/async-handler.js"


import {emailVerificationMailgenContent,forgotPasswordMailgenContent,sendEmail}   from "../utils/mail.js"   //To verify user by email

import jwt from "jsonwebtoken"      //To decode and verify jwt

import crypto from "crypto"         //To create hashedToken from unHashedToken

import mongoose from "mongoose"
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js"
import { NetworkResources } from "inspector/promises"

const createProject=asyncHandler(async(req,res)=>{
   const {name,description}=req.body;
   const project=await Project.create({
      name:name,
      description:description,
      createdBy:new mongoose.Types.ObjectId(req.user._id),//req.user isleye milgya qki user logged in hai yr
   });
   await ProjectMember.create({
      user:new mongoose.Types.ObjectId(req.user._id),
      project:new mongoose.Types.ObjectId(project._id),
      role:userRolesEnum.ADMIN
   }
   )   
   return res
   .status(201)
   .json(new ApiResponse(201,project,"Project created successfully"));

});

const updateProject=asyncHandler(async(req,res)=>{
   const {name,description}=req.body;
   const {projectId}=req.params;
   const project=await Project.findByIdAndUpdate(projectId,  //kisko update krna pda 
      {name:name,description:description},      //kyta updtae krna hai 
      {new:true})      //updated document wapas doo 
   if(!project){
      throw new ApiError(404,"project not found")
   }
   return res
   .status(200)
   .json(new ApiResponse(200,project,"Project updated succesfully"))
});

const deleteProject=asyncHandler(async(req,res)=>{
   const {projectId}=req.params;
   const project=await Project.findOneAndDelete({_id:projectId,
         createdBy:req.user._id               
    });
    if(!project){
      throw new ApiError(
         404,"project not found "
      );
   }
    await ProjectMember.deleteMany({     //project ke saarei members ke record delete 
    project: projectId
    });
   return res 
        .status(200)
        .json(
         new ApiResponse(200,{},"Project deleted succesfully")
        );
});

const getProjects=asyncHandler(async(req,res)=>{
   const projects = await ProjectMember.aggregate([
                             {$match: {user: new mongoose.Types.ObjectId(req.user._id)} },
                             {$lookup: { from: "projects",    //kisme jake dhundna (lowercase+plural)
                                         localField: "project",   // jisme abhi hoo common column name
                                         foreignField: "_id",     //jisme jana hai common column  name
                                         as: "projects",     //simple alias of resulted query
                                         pipeline:[
                                          {
                                             $lookup:{                       //ye hai bhai yr ab hume btana hai hr given project mei kitte users hai 
                                                from:"projectmembers",   //kisme jake dhundna hai (lowercase+plural)
                                                localField:"_id",   // jisme abhi hoo common column 
                                                foreignField:"project",  //jisme jana ho common column 
                                                as:"projectmembers"
                                             },

                                          },
                                          {
                                             $addFields:{
                                                members:{          //ek members ki field add hojagi jisme hrr project me ikitte members hai wo show hojaega bhai 
                                                   $size : "$projectmembers", 
                                                },
                                             },
                                          },
                                         ],
                                                                                
                                       }
                              },
                              {
                                 $unwind:"$projects"
                              },
                              {
                                 $project:{
                                    project:{
                                       _id:1,
                                       name:1,
                                       description:1,
                                       members:1,
                                       createdAt:1,
                                       createdBy:1
                                    },
                                    role:1,
                                    _id:0
                                 }
                              }
    ]);
    return res
        .status(200)
        .json(new ApiResponse(200,projects,"Projects fetched successfully"));
}
);

const getProjectById=asyncHandler(async(req,res)=>{
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200,project,"Project fetched successfully")
         );      
});

// email , role  , projectId by frontend 
const addMembersToProject=asyncHandler(async(req,res)=>{ 
     //  Frontend se data lo
    const { email, role } = req.body;  
    const { projectId } = req.params;
    //  Email se user find karo
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User does not exists");
    }
     // Project find karo
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(
            404,
            "Project not found"
        );
    }
    //  Check karo user already member toh nahi hai
    const existingMember = await ProjectMember.findOne({
        user: user._id,
        project: projectId
    });
    if (existingMember) {
        throw new ApiError(409,"User is already a member of this project");
    }
    //  New ProjectMember document create karo
    const member = await ProjectMember.create({
        user: user._id,
        project: projectId,
        role: role
    });
  /*  production level code
  const member = await ProjectMember.findOneAndUpdate(
    {user: user._id,
     project: projectId
    },
    { role: role},
    { new: true,     // updated document return karega
      upsert: true    // member nahi mila toh new member create karega
    }
);  */
    //  Response
    return res
        .status(201)
        .json(
            new ApiResponse(201,member,"Project Member added successfully")
        );
});

const getProjectMembers=asyncHandler(async(req,res)=>{
     const { projectId } = req.params;
     const project = await Project.findById(projectId);
     if (!project) {
        throw new ApiError(404,"Project not found so cant find the projectMembers");
     }    
     const members = await ProjectMember.find({
        project: projectId
     });
     if (!members) {
        throw new ApiError(404, "Project members not found");
     }
    return res
        .status(200)
        .json(
            new ApiResponse(200,members,"Project members fetched successfully")
        );
});   //isme user,project ko bhi le skte the mind mei with pipeline but wo baadmei dekhege 

const updateMemberRole=asyncHandler(async(req,res)=>{
    // Frontend se new role
    const { newrole } = req.body;
    if (!AvailableUserRole.includes(newrole)) {
          throw new ApiError(400, "Invalid role");
    }
    // URL se projectId aur userId
    const { projectId, userId } = req.params;
    // Existing member find karke role update karo
    const member = await ProjectMember.findOneAndUpdate(
        {   project: projectId,
            user: userId
        },
        {   role:newrole
        },
        {
            new: true
        }
    );
    if (!member) {
        throw new ApiError(404,"Project member not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200,member,"Member role updated successfully")
              );
});

const deleteMember=asyncHandler(async(req,res)=>{
      const { projectId, userId } = req.params;
    // ProjectMember mein member dhundo aur delete karo
    const member = await ProjectMember.findOneAndDelete({
        project: projectId,
        user: userId
    });
    if (!member) {
        throw new ApiError(
            404,
            "Project member not found"
        );
    }
    return res
        .status(200)
        .json(
             new ApiResponse(200,{},"Member deleted successfully")
             );
});       

 
export {
   addMembersToProject,
   createProject,
   deleteMember,
   getProjects,
   getProjectById,
   getProjectMembers,
   updateMemberRole,
   updateProject,
   deleteProject
}


