
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
import { userRolesEnum } from "../utils/constants.js"

const createProject=asyncHandler(async(req,res)=>{
   const {name,description}=req.body;
   const project=await Project.create({
      name:name,
      description:description,
      createdBy:new mongoose.Types.ObjectId(req.user._id),
   });
   await ProjectMember.create({
      user:new mongoose.Types.ObjectId(req.user._id),
      project:new mongoose.Types.ObjectId(project._id),
      role:userRolesEnum.ADMIN
   }
)   
   return res
   .status(201)
});


const getProjects=asyncHandler(async(req,res)=>{
         
});


const getProjectById=asyncHandler(async(req,res)=>{

});

const updateProject=asyncHandler(async(req,res)=>{

});

const deleteProject=asyncHandler(async(req,res)=>{

});

const addMembersToProject=asyncHandler(async(req,res)=>{

});

const getProjectMembers=asyncHandler(async(req,res)=>{

});

const updateMemberRole=asyncHandler(async(req,res)=>{

});

const deleteMember=asyncHandler(async(req,res)=>{

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


