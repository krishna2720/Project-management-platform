<div align="center">

#   Project Management Platform

### Enterprise-Grade REST API for Collaborative Project & Task Management

<p align="center">
A production-ready backend application built with <strong>Node.js</strong>, <strong>Express.js</strong>, and <strong>MongoDB</strong> that enables teams to efficiently manage projects, collaborate through role-based workspaces, organize hierarchical tasks, share project notes, and securely authenticate users using JWT-based authentication.
</p>

<br/>

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=jsonwebtokens)
![REST API](https://img.shields.io/badge/API-REST-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)

</p>

</div>

---

## 📖 Overview

**Project Management Platform** is a scalable RESTful backend engineered to simplify collaborative project execution through secure authentication, granular role-based authorization, hierarchical task management, project documentation, and enterprise-grade API architecture.

The platform follows a modular **MVC architecture** and emphasizes clean code, scalability, and maintainability by separating business logic, routing, middleware, validation, and database operations into independent modules.

Designed for modern team collaboration, the application provides secure JWT authentication, refresh token rotation, project workspaces, task assignment, subtasks, file attachments, project notes, and email-based account verification while maintaining standardized API responses and centralized error handling.

---

# ✨ Key Highlights

- 🔐 JWT Authentication with Access & Refresh Tokens
- 👥 Role-Based Access Control (Admin, Project Admin, Member)
- 📂 Collaborative Project Workspaces
- 📋 Task & Subtask Management
- 📎 Multiple File Attachments
- 📝 Project Notes & Documentation
- 📧 Email Verification & Password Recovery
- 🛡 Secure REST API Design
- ⚡ Modular MVC Architecture
- 🚀 Production-Ready Backend Structure

---

# 🌟 Core Features

## 🔐 Authentication & User Security

Build secure authentication workflows using JWT-based authorization.

### Features

- User Registration
- Secure Login
- Logout
- Email Verification
- Password Reset
- Forgot Password
- Refresh Token Rotation
- Protected Routes
- Password Hashing using bcrypt

---

## 👥 Role-Based Access Control

The platform follows a three-level authorization model.

| Role | Description |
|------|-------------|
| 👑 **Admin** | Complete control over projects, members, notes, and permissions |
| 🛠 **Project Admin** | Manages project tasks and subtasks within assigned projects |
| 👤 **Member** | Can access assigned projects and update permitted task progress |

Fine-grained authorization middleware ensures every request is validated before accessing protected resources.

---

## 📂 Project Workspace Management

Manage collaborative workspaces efficiently.

- Create Projects
- Update Project Details
- Delete Projects
- Invite Members
- Remove Members
- Update Member Roles
- View Project Information

---

## 📋 Task Management

Track project execution with a structured task workflow.

### Supported Operations

- Create Tasks
- Update Tasks
- Delete Tasks
- Assign Team Members
- Upload Multiple Attachments
- Track Task Status
- View Task Details

Supported Status Flow

```text
Todo
   │
   ▼
In Progress
   │
   ▼
Done
```

---

## ✅ Subtask Management

Break complex work into smaller manageable units.

- Create Subtasks
- Update Subtasks
- Delete Subtasks
- Track Individual Completion
- Member Progress Updates

---

## 📝 Project Notes

Maintain project documentation directly inside each workspace.

Supported Features

- Create Notes
- Edit Notes
- Delete Notes
- View Notes
- Centralized Project Documentation

---

## 📁 File Management

Upload and manage multiple task attachments securely.

Features include

- Multiple File Uploads
- MIME Type Validation
- Metadata Storage
- Secure File Handling using Multer

---

## 📧 Email Services

Integrated mailing workflows support

- Account Verification
- Password Recovery
- Reset Password Links
- Verification Resend

---

## 🛡 Security Features

- JWT Authentication
- Refresh Token Rotation
- Role-Based Authorization
- Input Validation
- Protected Middleware
- Secure Password Hashing
- Cookie Support
- CORS Configuration
- Centralized Error Handling

---

# 🛠 Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose ODM

### Authentication

- JWT
- bcrypt

### File Upload

- Multer

### Email Service

- Nodemailer

### Utilities

- dotenv
- cookie-parser
- cors

### Development Tools

- Git
- GitHub
- Postman
- Nodemon

---

> **Project Management Platform** is designed with scalability, modularity, and maintainability in mind, making it suitable for collaborative team environments and serving as a strong demonstration of production-ready backend development practices.


# 🏗 System Architecture

The backend follows a layered **MVC (Model–View–Controller)** architecture that separates routing, business logic, middleware, validation, and data access into independent modules. This modular approach improves maintainability, scalability, and code readability while keeping each component focused on a single responsibility.

```text
                           Client
                              │
                              │ HTTP Request
                              ▼
                    Express.js Application
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
    Middleware            Route Handler        Validation
(Auth • RBAC • CORS)           │                  Layer
        │                      ▼
        │               Controller Layer
        │                      │
        │              Business Logic
        │                      ▼
        │               Service Utilities
        │                      │
        ▼                      ▼
   Authentication        Mongoose Models
                              │
                              ▼
                         MongoDB Atlas
```

---

# ⚙ Request Lifecycle

Every request passes through a structured pipeline before interacting with the database.

```text
Client
   │
   ▼
Express Router
   │
   ▼
Authentication Middleware
   │
   ▼
Role Authorization
   │
   ▼
Request Validation
   │
   ▼
Controller
   │
   ▼
Database Operation
   │
   ▼
Standard API Response
```

---

# 📂 Project Structure

```text
project_management/
│
├── public/
│   └── images/                  # Uploaded task attachments
│
├── src/
│   │
│   ├── controllers/             # Application business logic
│   │   ├── auth.controller.js
│   │   ├── project.controller.js
│   │   ├── task.controller.js
│   │   ├── notes.controller.js
│   │   └── healthcheck.controller.js
│   │
│   ├── routes/                  # API route definitions
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   ├── task.routes.js
│   │   ├── notes.routes.js
│   │   └── healthcheck.routes.js
│   │
│   ├── middleware/              # Authentication & validation
│   │   ├── auth.middleware.js
│   │   ├── validator.middleware.js
│   │   └── multer.middleware.js
│   │
│   ├── validators/              # Request validation rules
│   │
│   ├── models/                  # Database schemas
│   │   ├── users.models.js
│   │   ├── project.models.js
│   │   ├── projectmember.models.js
│   │   ├── task.models.js
│   │   ├── subtask.models.js
│   │   └── notes.models.js
│   │
│   ├── utils/                   # Shared utilities
│   │   ├── async-handler.js
│   │   ├── api-response.js
│   │   ├── api-error.js
│   │   ├── constants.js
│   │   └── mail.js
│   │
│   ├── db/
│   │   └── index.js             # MongoDB Connection
│   │
│   ├── app.js                   # Express Configuration
│   └── index.js                 # Application Entry Point
│
├── .env.sample
├── package.json
└── README.md
```

---

# 🗄 Database Models

The platform is built around six primary collections.

```text
User
 │
 │ 1:N
 ▼
ProjectMember
 │
 │ N:1
 ▼
Project
 │
 ├──────────────┐
 │              │
 ▼              ▼
Task          Notes
 │
 │
 ▼
Subtask
```

---

# 🛡 Role-Based Access Control (RBAC)

The platform implements a **three-tier authorization system** to protect sensitive operations and enforce project-level permissions.

| Feature | 👑 Admin | 🛠 Project Admin | 👤 Member |
|:-------------------------------|:---------:|:----------------:|:---------:|
| Create Project | ✅ | ❌ | ❌ |
| Update/Delete Project | ✅ | ❌ | ❌ |
| Manage Project Members | ✅ | ❌ | ❌ |
| Create Tasks | ✅ | ✅ | ❌ |
| Update Tasks | ✅ | ✅ | ❌ |
| Delete Tasks | ✅ | ✅ | ❌ |
| View Tasks | ✅ | ✅ | ✅ |
| Create Subtasks | ✅ | ✅ | ❌ |
| Delete Subtasks | ✅ | ✅ | ❌ |
| Update Subtask Status | ✅ | ✅ | ✅ |
| Create Notes | ✅ | ❌ | ❌ |
| Update Notes | ✅ | ❌ | ❌ |
| Delete Notes | ✅ | ❌ | ❌ |
| View Notes | ✅ | ✅ | ✅ |

---

# 🔒 Security Architecture

Security is integrated throughout the application to ensure safe authentication, authorization, and data access.

- 🔐 JWT Access & Refresh Token Authentication
- 👤 Role-Based Authorization Middleware
- 🔑 Password Hashing using bcrypt
- 📧 Email Verification Workflow
- 🔄 Password Reset via Secure Tokens
- 📁 Secure File Upload Pipeline with Multer
- ✅ Request Validation Middleware
- 🌍 Configurable CORS Policy
- 🍪 HTTP Cookie Authentication
- ⚠ Centralized Error Handling
- 🔒 Environment Variable Protection

---

# 💡 Design Principles

The backend is designed around modern backend engineering principles.

- Modular MVC Architecture
- Separation of Concerns
- Reusable Middleware
- Centralized Error Handling
- Standardized API Responses
- RESTful API Design
- Scalable Folder Structure
- Maintainable Codebase
- Production-Oriented Development



# 📡 API Documentation

The Project Management Platform exposes a RESTful API designed around modular resources, predictable response structures, and role-based authorization.

### Base URL

```http
/api/v1
```

All endpoints return standardized JSON responses and use appropriate HTTP status codes.

---

# 🗂 API Modules

| Module | Description |
|---------|-------------|
| 🔐 Authentication | User registration, login, email verification, password recovery |
| 📂 Projects | Project workspace management |
| 👥 Members | Invite, remove and manage project members |
| 📋 Tasks | Task lifecycle management |
| ✅ Subtasks | Hierarchical task tracking |
| 📝 Notes | Project documentation |
| ❤️ Health Check | API monitoring endpoint |

---

# 🔐 Authentication APIs

> Responsible for secure user authentication, authorization and account management.

| Method | Endpoint | Authentication | Description |
|:------:|----------|:--------------:|-------------|
| POST | `/auth/register` | ❌ | Register a new account |
| POST | `/auth/login` | ❌ | Login user |
| POST | `/auth/logout` | ✅ | Logout current user |
| GET | `/auth/current-user` | ✅ | Get logged-in user |
| POST | `/auth/change-password` | ✅ | Update account password |
| POST | `/auth/refresh-token` | ❌ | Generate new access token |
| GET | `/auth/verify-email/:token` | ❌ | Verify email address |
| POST | `/auth/forgot-password` | ❌ | Generate password reset link |
| POST | `/auth/reset-password/:token` | ❌ | Reset forgotten password |
| POST | `/auth/resend-email-verification` | ✅ | Resend verification email |

---

# 📂 Project APIs

Project workspaces are the central resource of the platform.

| Method | Endpoint | Access |
|:------:|----------|:------:|
| GET | `/projects` | Authenticated |
| POST | `/projects` | Authenticated |
| GET | `/projects/:projectId` | Project Member |
| PUT | `/projects/:projectId` | Admin |
| DELETE | `/projects/:projectId` | Admin |

---

## Project Member Management

| Method | Endpoint | Access |
|:------:|----------|:------:|
| GET | `/projects/:projectId/members` | Authenticated |
| POST | `/projects/:projectId/members` | Admin |
| PUT | `/projects/:projectId/members/:userId` | Admin |
| DELETE | `/projects/:projectId/members/:userId` | Admin |

---

# 📋 Task APIs

Manage complete task lifecycle inside project workspaces.

| Method | Endpoint | Access |
|:------:|----------|:------:|
| GET | `/tasks/:projectId` | Project Member |
| POST | `/tasks/:projectId` | Admin / Project Admin |
| GET | `/tasks/:projectId/:taskId` | Project Member |
| PUT | `/tasks/:projectId/:taskId` | Admin / Project Admin |
| DELETE | `/tasks/:projectId/:taskId` | Admin / Project Admin |

---

## ✅ Subtask APIs

| Method | Endpoint | Access |
|:------:|----------|:------:|
| POST | `/tasks/:projectId/:taskId/subtasks` | Admin / Project Admin |
| PUT | `/tasks/:projectId/:subTaskId` | Project Member |
| DELETE | `/tasks/:projectId/:subTaskId` | Admin / Project Admin |

---

# 📝 Notes APIs

Project-specific documentation endpoints.

| Method | Endpoint | Access |
|:------:|----------|:------:|
| GET | `/notes/:projectId` | Project Member |
| POST | `/notes/:projectId` | Admin |
| GET | `/notes/:projectId/:noteId` | Project Member |
| PUT | `/notes/:projectId/:noteId` | Admin |
| DELETE | `/notes/:projectId/:noteId` | Admin |

---

# ❤️ Health Check

| Method | Endpoint | Description |
|:------:|----------|-------------|
| GET | `/healthcheck` | Returns API status and uptime |

---

# 🔑 Authentication Flow

```text
Register
    │
    ▼
Verify Email
    │
    ▼
Login
    │
    ▼
Access Token + Refresh Token
    │
    ▼
Protected APIs
    │
    ▼
Access Token Expired
    │
    ▼
Refresh Token
    │
    ▼
Generate New Access Token
```

---

# 📦 Standard API Response

Every endpoint follows a consistent response format.

### ✅ Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

---

### ❌ Error Response

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# 🔒 Authorization Levels

| Level | Description |
|--------|-------------|
| 🌍 Public | Accessible without authentication |
| 🔐 Authenticated | Requires valid JWT |
| 👥 Project Member | User must belong to the project |
| 🛠 Project Admin | Elevated project-level permissions |
| 👑 Admin | Full administrative privileges |

---

# 📈 API Summary

| Resource | Endpoints |
|-----------|----------:|
| Authentication | 10 |
| Projects | 9 |
| Tasks | 8 |
| Notes | 5 |
| Health Check | 1 |
| **Total** | **33** |

---

> 💡 The API follows REST principles, centralized error handling, standardized response objects, JWT-based authentication, and Role-Based Access Control (RBAC), making it suitable for scalable and maintainable backend applications.


# 🚀 Getting Started

Follow the steps below to set up the project locally.

## Prerequisites

Before running the application, ensure the following software is installed on your machine.

| Software | Recommended Version |
|-----------|--------------------:|
| Node.js | >= 18.x |
| MongoDB Atlas | Latest |
| npm | >= 9.x |
| Git | Latest |

---

# 📥 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-github-username>/project-management-platform.git

cd project-management-platform
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MONGODB_URI=

CORS_ORIGIN=

ACCESS_TOKEN_SECRET=

ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=

REFRESH_TOKEN_EXPIRY=10d

SMTP_HOST=

SMTP_PORT=

SMTP_USER=

SMTP_PASS=

EMAIL_FROM=
```

---

### 4️⃣ Start Development Server

```bash
npm run dev
```

---

### 5️⃣ Start Production Server

```bash
npm start
```

---

Once the database connection is established, the server will be available at

```text
http://localhost:5000
```

---

# 🧪 Testing the APIs

The APIs can be tested using

- Postman
- Thunder Client
- Insomnia

Every secured endpoint requires a valid JWT Access Token.

---

# 📦 API Response Structure

Every endpoint follows a standardized response format.

### Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

---

### Error Response

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# 📸 Screenshots

> Add screenshots or GIF demonstrations here.

### Authentication

```
assets/
 └── authentication.png
```

---

### Dashboard

```
assets/
 └── dashboard.png
```

---

### Project Workspace

```
assets/
 └── projects.png
```

---

### Task Management

```
assets/
 └── tasks.png
```

---

### API Testing

```
assets/
 └── postman.png
```

---

# 🚀 Future Enhancements

- Docker Support
- Redis Caching
- Swagger / OpenAPI Documentation
- WebSocket Notifications
- Activity Timeline
- Audit Logs
- Project Analytics Dashboard
- Email Notifications
- CI/CD Pipeline
- Unit & Integration Testing
- Rate Limiting
- API Versioning

---

# 🤝 Contributing

Contributions are always welcome.

### Contribution Workflow

```bash
Fork Repository

       │

Create Feature Branch

       │

Commit Changes

       │

Push Branch

       │

Open Pull Request
```

### Clone your Fork

```bash
git clone https://github.com/<your-username>/project-management-platform.git
```

### Create a Feature Branch

```bash
git checkout -b feature/amazing-feature
```

### Commit your Changes

```bash
git commit -m "feat: add amazing feature"
```

### Push to GitHub

```bash
git push origin feature/amazing-feature
```

Finally, create a Pull Request.

---

# 📈 Project Statistics

| Category | Value |
|-----------|-------|
| Architecture | MVC |
| Authentication | JWT |
| Authorization | RBAC |
| Database | MongoDB |
| Runtime | Node.js |
| Framework | Express.js |
| File Upload | Multer |
| Email Service | Nodemailer |
| API Style | REST |
| Environment | dotenv |

---

# 👨‍💻 Author

**Krishna Agarwal**

🎓 **B.Tech in Computer Science & Engineering**  
**Jaypee Institute of Information Technology (JIIT), Noida**

Backend Developer | MERN Stack Developer | DSA Problem Solving Skills

### Connect With Me

- GitHub : https://github.com/krishna2720

- LinkedIn : https://www.linkedin.com/in/krishna-agarwal-a6a518321/

- Email : krishna.125766@gmail.com

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates further improvements.

---

<div align="center">

### 🚀 Built with ❤️ using Node.js, Express.js & MongoDB

**Thank you for visiting this repository!**

⭐ Happy Coding ⭐

</div>