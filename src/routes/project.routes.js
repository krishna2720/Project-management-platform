import { Router } from "express";
//controller se laare route bnare hai isme 
import {addMembersToProject,createProject,deleteMember,getProjects,getProjectById,getProjectMembers,updateMemberRole,updateProject,deleteProject} from "../controllers/project.controller.js";

//controller -> router-> app.js -> index.js  ye hai flow bhai mere 

import { validate } from "../middleware/validator.middleware.js"; 
import { verifyJWT,validateProjectPermission } from "../middleware/auth.middleware.js";
import { createProjectValidator,addMembertoProjectValidator } from "../validators/index.js";
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js";
const router=Router();

router.use(verifyJWT)


router.get("/", getProjects);

router.post("/",createProjectValidator(),validate,createProject);


router.get("/:projectId",validateProjectPermission(AvailableUserRole),getProjectById);


router.put("/:projectId",validateProjectPermission([userRolesEnum.ADMIN]),createProjectValidator(),validate,updateProject);

router.delete("/:projectId",validateProjectPermission([userRolesEnum.ADMIN]),deleteProject);

// Get all members of a project
router.get("/:projectId/members", getProjectMembers);

// Add a member to a project — Admin only
router.post("/:projectId/members",validateProjectPermission([userRolesEnum.ADMIN]),addMembertoProjectValidator(),validate,addMembersToProject);

// Update a member's role — Admin only
router.put("/:projectId/members/:userId",validateProjectPermission([userRolesEnum.ADMIN]),updateMemberRole);

// Delete a member — Admin only
router.delete("/:projectId/members/:userId",validateProjectPermission([userRolesEnum.ADMIN]),deleteMember);


export default router