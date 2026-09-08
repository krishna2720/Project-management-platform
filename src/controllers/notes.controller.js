
import {User} from "../models/users.models.js"  //query anything from database 
import { Project } from "../models/project.models.js" 
import { ProjectMember } from "../models/projectmember.models.js"

import { Task } from "../models/task.models.js"
import { Subtask } from "../models/subtask.models.js"
import { ProjectNote } from "../models/notes.models.js"

import {ApiResponse} from "../utils/api-response.js"   
import {ApiError} from "../utils/api-error.js"   
import { asyncHandler } from "../utils/async-handler.js"


import jwt from "jsonwebtoken"      //To decode and verify jwt

import crypto from "crypto"         //To create hashedToken from unHashedToken

import mongoose from "mongoose"
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js"

const createNote = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { content } = req.body;

    // Check karo project exist karta hai ya nahi
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Note create karo
    const note = await ProjectNote.create({
        project: projectId,
        createdBy: req.user._id,
        content
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                note,
                "Note created successfully"
            )
        );
});

const getProjectNotes = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const notes = await ProjectNote.find({
        project: projectId
    })
        .populate("createdBy", "username avatar");

    return res.status(200).json(
        new ApiResponse(
            200,
            notes,
            "Project notes fetched successfully"
        )
    );
});

const getNoteDetails = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params;

    const note = await ProjectNote.findOne({
        _id: noteId,
        project: projectId
    })
        .populate("createdBy", "username avatar");

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            note,
            "Note details fetched successfully"
        )
    );
});

const updateNote = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params;
    const { content } = req.body;

    const note = await ProjectNote.findOne({
        _id: noteId,
        project: projectId
    });

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    if (content !== undefined) {
        note.content = content;
    }

    await note.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            note,
            "Note updated successfully"
        )
    );
});

const deleteNote = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params;

    const note = await ProjectNote.findOneAndDelete({
        _id: noteId,
        project: projectId
    });

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Note deleted successfully"
        )
    );
});

export {createNote,getProjectNotes,getNoteDetails,updateNote,deleteNote};