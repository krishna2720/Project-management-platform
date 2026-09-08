import { Router } from "express";

import {createTask,getProjectTasks,getTaskDetails,updateTask,deleteTask,createSubtasks,updateSubTask,deleteSubTask} from "../controllers/task.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validateProjectPermission } from "../middleware/auth.middleware.js";
import { userRolesEnum } from "../utils/constants.js";

const router = Router();

router.post("/:projectId",verifyJWT,validateProjectPermission([userRolesEnum.ADMIN]),createTask);


router.get("/:projectId",verifyJWT,validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.MEMBER]),getProjectTasks);

router.get("/:projectId/:taskId",verifyJWT,validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.MEMBER]),getTaskDetails);

router.put("/:projectId/:taskId",verifyJWT,validateProjectPermission([userRolesEnum.ADMIN]),updateTask);

router.delete("/:projectId/:taskId",verifyJWT,validateProjectPermission([userRolesEnum.ADMIN]),deleteTask);

router.post("/:projectId/:taskId/subtasks",verifyJWT,validateProjectPermission([userRolesEnum.ADMIN]),createSubtasks);

router.put("/:projectId/:taskId/:subTaskId",verifyJWT,validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.MEMBER]),updateSubTask);

router.delete("/:projectId/:taskId/:subTaskId",verifyJWT,validateProjectPermission([userRolesEnum.ADMIN]),deleteSubTask);

export default router;