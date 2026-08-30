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

router 
    .route("/")
    .get(getProjects)
    .post(createProjectValidator,validate,createProject)


router 
    .route("/:projectId")
    .get(validateProjectPermission(AvailableUserRole),getProjectById)
    .put (
        validateProjectPermission([userRolesEnum.ADMIN]),
        createProjectValidator,
        validate,
        updateProject
    )
    .delete(
        validateProjectPermission([userRolesEnum.ADMIN]),
        deleteProject
    )

router 
    .route("/:projectId/members")
    .get(getProjectMembers)
    .post(        
        validateProjectPermission([userRolesEnum.ADMIN]),
        addMembertoProjectValidator(),
        validate,
        addMembersToProject
    )
router 
    .route("/:projectId/members/:userId")
    .put(
        validateProjectPermission([userRolesEnum.ADMIN]),
        updateMemberRole
    )
    .delete(
        validateProjectPermission([userRolesEnum.ADMIN] ),
        deleteMember
    )    
    
export default router