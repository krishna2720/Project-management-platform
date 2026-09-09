
import {User} from "../models/users.models.js"  //query anything from database 
import { Project } from "../models/project.models.js" 
import { ProjectMember } from "../models/projectmember.models.js"

import { Task } from "../models/task.models.js"
import { Subtask } from "../models/subtask.models.js"

import { generateAISubtasks } from "../services/ai.service.js";

import {ApiResponse} from "../utils/api-response.js"   
import {ApiError} from "../utils/api-error.js"   
import { asyncHandler } from "../utils/async-handler.js"


import jwt from "jsonwebtoken"      //To decode and verify jwt

import crypto from "crypto"         //To create hashedToken from unHashedToken

import mongoose from "mongoose"
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js"

const createTask = asyncHandler(async (req, res) => {
    // projectId URL params se
    const { projectId } = req.params;
    // Task data frontend ke body se
    const {title,description,assignedTo} = req.body;
    // Multiple files Multer se
    const files = req.files;
    // Project exist karta hai ya nahi
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }
    // Agar task kisi user ko assign kiya gaya hai,
    // toh check karo ki woh project ka member hai
    if (assignedTo) {
        const member = await ProjectMember.findOne({
            project: projectId,
            user: assignedTo
        });
        if (!member) {
            throw new ApiError(400,"Assigned user is not a member of this project");
        }
    }
    // Files ko Task schema ke attachment format mein convert karo
   // const attachments = files?.map((file) => ({url: file.path,mimetype: file.mimetype,size: file.size})) || [];
    // Task create karo
    const task = await Task.create({
        title:title,
        description:description,
        project: projectId,
        assignedTo:assignedTo,
        assignedBy: req.user._id,
      //  status:status,
     //   attachment: attachments
    });

    return res
        .status(201)
        .json(new ApiResponse(201,task,"Task created successfully"));
});


const getProjectTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    // Check project exists
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404,"Project not found");
    }
    // Get all tasks of this project
    const tasks = await Task.find({project: projectId})
                            .populate("assignedTo", "avatar username fullName")
                            .populate("assignedBy", "avatar username fullName");

    return res
        .status(200)
        .json(
            new ApiResponse(200,tasks,"Tasks fetched successfully")
        );
});



const getTaskDetails = asyncHandler(async (req, res) => {
    const { projectId, taskId } = req.params;
    const task = await Task.findOne({
        _id: taskId,
        project: projectId
    })
    .populate("assignedTo", "avatar username fullName")
    .populate("assignedBy", "avatar username fullName");
    if (!task) {
        throw new ApiError(404,"Task not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200,task,"Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
    const { projectId, taskId } = req.params;
    const {title,description,assignedTo,status} = req.body;
    // Task dhundo aur check karo ki ye isi project ka hai
    const task = await Task.findOne({
        _id: taskId,
        project: projectId
    });
    if (!task) {
        throw new ApiError(404,"Task not found");
    }
    // Agar assignedTo diya gaya hai,
    // toh check karo ki user project ka member hai
    if (assignedTo) {
        const member = await ProjectMember.findOne({
            project: projectId,
            user: assignedTo
        });
        if (!member) {
            throw new ApiError(
                400,
                "User is not a member of this project"
            );
        }
    }

    // Jo fields frontend se aayi hain sirf unko update karo
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (status !== undefined) task.status = status;
    await task.save();
    return res
        .status(200)
        .json(new ApiResponse(200,task,"Task updated successfully"));
});


const deleteTask = asyncHandler(async (req, res) => {
    const { projectId, taskId } = req.params;
    // Task dhundo aur ensure karo ki ye isi project ka hai
    const task = await Task.findOneAndDelete({
        _id: taskId,
        project: projectId
    });
    if (!task) {
        throw new ApiError(404,"Task not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200,{},"Task deleted successfully"));
});


const createSubtasks = asyncHandler(async (req, res) => {
    const { projectId, taskId } = req.params;
    const { title } = req.body;

    // Check karo task exist karta hai aur isi project ka hai
    const task = await Task.findOne({
        _id: taskId,
        project: projectId
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Subtask create karo
    const subtask = await Subtask.create({
        title,
        task: taskId,
        createdBy: req.user._id
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                subtask,
                "Subtask created successfully"
            )
        );
});


const updateSubTask = asyncHandler(async (req, res) => {
    const { projectId, taskId, subTaskId } = req.params;
    const { title, isCompleted } = req.body;

    // Pehle check karo ki task exist karta hai
    // aur isi project ka hai
    const task = await Task.findOne({
        _id: taskId,
        project: projectId
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Ab check karo ki subtask isi task ka hai
    const subtask = await Subtask.findOne({
        _id: subTaskId,
        task: taskId
    });

    if (!subtask) {
        throw new ApiError(404, "Subtask not found");
    }

    // Sirf wahi fields update karo jo body mein aayi hain
    if (title !== undefined) {
        subtask.title = title;
    }

    if (isCompleted !== undefined) {
        subtask.isCompleted = isCompleted;
    }

    await subtask.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subtask,
                "Subtask updated successfully"
            )
        );
});


const deleteSubTask = asyncHandler(async (req, res) => {
    const { projectId, taskId, subTaskId } = req.params;

    // Pehle check karo ki task exist karta hai
    // aur isi project ka hai
    const task = await Task.findOne({
        _id: taskId,
        project: projectId
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Ab subtask dhundo aur ensure karo
    // ki ye isi task ka subtask hai
    const subtask = await Subtask.findOneAndDelete({
        _id: subTaskId,
        task: taskId
    });

    if (!subtask) {
        throw new ApiError(404, "Subtask not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Subtask deleted successfully"
            )
        );
});

const generateAISubtasksController = asyncHandler(async (req, res) => {
  
  const { projectId, taskId } = req.params;

  const task = await Task.findOne({
    _id: taskId,
    project: projectId
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const result = await generateAISubtasks(task.title,task.description);

  //  AI ke har subtask ko MongoDB me save karo
  const subtasks = [];
  for (const subtask of result.subtasks) {
     const newSubtask = await Subtask.create({
                        title: subtask.title,
                        task: taskId,
                        createdBy: req.user._id
   });

    subtasks.push(newSubtask);
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      subtasks,
      "AI subtasks generated successfully"
    )
  );
});

export {
    createTask,
    getProjectTasks,
    getTaskDetails,
    updateTask,
    deleteTask,
    createSubtasks,
    updateSubTask,
    deleteSubTask,
    generateAISubtasksController
}


