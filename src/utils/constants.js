//Object of User Roles
export const userRolesEnum = {  
    ADMIN:"admin",
    PROJECT_ADMIN:"project_admin",
    MEMBER:"member"
}

//["admin","project_admin","member"]
export const AvailableUserRole = Object.values(userRolesEnum)

//Object of task status
export const TaskStatusEnum = {
    TODO:"todo",
    IN_PROGRESS:"in_progress",
    DONE:"done"
}

//Array of task status
export const AvailableTaskStatus=Object.values(TaskStatusEnum)