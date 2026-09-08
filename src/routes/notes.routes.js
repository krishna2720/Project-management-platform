import { Router } from "express";
import {createNote,getProjectNotes,getNoteDetails,updateNote,deleteNote} from "../controllers/notes.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validateProjectPermission } from "../middleware/auth.middleware.js";
import { userRolesEnum } from "../utils/constants.js";

const router = Router();

router.post("/:projectId",verifyJWT,validateProjectPermission([userRolesEnum.ADMIN]),createNote);

router.get("/:projectId",verifyJWT,validateProjectPermission([userRolesEnum.ADMIN,userRolesEnum.MEMBER]),getProjectNotes);

router.get("/:projectId/:noteId", verifyJWT,validateProjectPermission([userRolesEnum.ADMIN,userRolesEnum.MEMBER]),getNoteDetails);

router.put("/:projectId/:noteId",verifyJWT,validateProjectPermission([userRolesEnum.ADMIN]),updateNote);

router.delete("/:projectId/:noteId",verifyJWT,validateProjectPermission([userRolesEnum.ADMIN]),deleteNote);


export default router;