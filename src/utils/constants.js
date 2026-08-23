//Object of User Roles becuase now duplicacy avoid hogi and sath mei khi update krna hoga toh asani hogi dost 
//main baat hai validate bhi hojayega if array mei role ni mial jo front end se mila then usko reject krdega 
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