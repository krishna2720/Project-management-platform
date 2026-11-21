<div align="center">

# Project Management Platform

Collaborative project and task management with a REST API and a React web application.

[![Node.js](https://img.shields.io/badge/Node.js-20.19%2B-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

</div>

## Overview

Project Management Platform is a full-stack application for organizing team work in project-based workspaces. Users can create projects, manage membership and roles, track tasks and subtasks, and keep project notes in one place.

The backend exposes a versioned REST API built with Node.js, Express, MongoDB, and Mongoose. The React frontend uses the same API for authentication, project dashboards, and project management.

## Features

- **Authentication:** registration, login, logout, current-user lookup, access and refresh JWTs, password hashing with bcrypt, email verification, and password recovery.
- **Project workspaces:** create, view, update, and delete projects; add members by email; update member roles.
- **Role-based access control:** project membership roles are `admin`, `project_admin`, and `member`.
- **Task management:** create, view, update, delete, and assign project tasks with `todo`, `in_progress`, and `done` statuses.
- **Subtasks:** create, update, and delete subtasks; optionally generate suggested subtasks with the Gemini API.
- **Project notes:** create, view, edit, and delete project notes.
- **Responsive web interface:** authentication screens, project dashboard, task and note views, team management, loading states, and API error feedback.

## Technology

| Area | Technologies |
|---|---|
| Backend | Node.js, Express 5, JavaScript |
| Database | MongoDB, Mongoose |
| Frontend | React 19, Vite 6, JavaScript |
| Styling and UI | Tailwind CSS, responsive CSS, Lucide React |
| API and routing | Axios, React Router DOM |
| Authentication | JSON Web Tokens (JWT), bcrypt, HTTP cookies |
| Validation and email | express-validator, Nodemailer, Mailgen |
| Optional AI integration | Google Gemini API |

## Architecture

```text
React + Vite
     │
     │  /api/v1 requests
     ▼
Express routes
     │
     ├── Authentication and project-permission middleware
     ├── Request validation
     ▼
Controllers ── Services and utilities
     │
     ▼
Mongoose models
     │
     ▼
MongoDB
```

The backend separates routes, controllers, models, middleware, validators, and shared utilities. A `ProjectMember` collection links users to projects and stores each member's project-specific role.

## Project structure

```text
project-management-platform/
├── src/                         # Express API
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   └── index.js
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   └── pages/
│   ├── index.html
│   └── vite.config.js
├── public/                      # Express static files
├── package.json                 # Backend scripts and dependencies
└── README.md
```

## Getting started

### Prerequisites

- Node.js 20.19 or later and npm
- A MongoDB connection string
- Mailtrap SMTP credentials for email workflows
- A Gemini API key only if using AI subtask generation

### 1. Clone the repository

```bash
git clone https://github.com/krishna2720/Project-management-platform.git
cd Project-management-platform
```

### 2. Install dependencies

Run these commands from the repository root:

```bash
npm install
cd frontend
npm install
cd ..
```

### 3. Configure the backend

Create a `.env` file in the repository root. Keep it private; do not commit credentials.

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=replace_with_a_long_random_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=replace_with_a_different_long_random_secret
REFRESH_TOKEN_EXPIRY=10d

MAILTRAP_SMTP_HOST=your_smtp_host
MAILTRAP_SMTP_PORT=your_smtp_port
MAILTRAP_SMTP_USER=your_smtp_username
MAILTRAP_SMTP_PASS=your_smtp_password

FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password
GEMINI_API_KEY=your_gemini_api_key
```

`PORT` defaults to `3000` in the server code. The frontend's Vite proxy defaults to `http://localhost:5000`; use `PORT=5000` as above, or set `VITE_BACKEND_URL` in the frontend environment to the port where your API is running. Gemini is only needed for AI-generated subtasks.

### 4. Start the backend

From the repository root:

```bash
npm run dev
```

The API starts after a successful MongoDB connection. With the example configuration, it listens on `http://localhost:5000`.

### 5. Start the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Vite runs on `http://localhost:5173` and proxies `/api` requests to the backend. The API client uses `/api/v1` as its base path. To point the deployed frontend at a separately hosted API, set `VITE_API_URL` to the full API base URL, such as `https://api.example.com/api/v1`.

## API

Base path: `/api/v1`

Protected endpoints require a valid access token. Project-specific operations also check the caller's membership and role where configured.

| Resource | Method and path | Purpose |
|---|---|---|
| Health | `GET /healthcheck` | Check API availability |
| Auth | `POST /auth/register` | Register a user |
| Auth | `POST /auth/login` | Sign in |
| Auth | `POST /auth/logout` | Sign out |
| Auth | `POST /auth/current-user` | Get the authenticated user |
| Auth | `POST /auth/refresh-token` | Rotate tokens |
| Auth | `GET /auth/verify-email/:verificationToken` | Verify an email |
| Auth | `POST /auth/forgot-password` | Request a password reset |
| Auth | `POST /auth/reset-password/:resetToken` | Set a new password |
| Auth | `POST /auth/change-password` | Change a password while signed in |
| Auth | `POST /auth/resend-email-verification` | Resend a verification email |
| Projects | `GET /projects`, `POST /projects` | List or create projects |
| Projects | `GET /projects/:projectId` | Get a project |
| Projects | `PUT /projects/:projectId`, `DELETE /projects/:projectId` | Update or delete a project |
| Members | `GET /projects/:projectId/members` | List project members |
| Members | `POST /projects/:projectId/members` | Add a member by email |
| Members | `PUT /projects/:projectId/members/:userId` | Update a member's role |
| Members | `DELETE /projects/:projectId/members/:userId` | Remove a member |
| Tasks | `GET /tasks/:projectId`, `POST /tasks/:projectId` | List or create project tasks |
| Tasks | `GET /tasks/:projectId/:taskId` | Get task details |
| Tasks | `PUT /tasks/:projectId/:taskId`, `DELETE /tasks/:projectId/:taskId` | Update or delete a task |
| Subtasks | `POST /tasks/:projectId/:taskId/subtasks` | Create a subtask |
| Subtasks | `PUT /tasks/:projectId/:taskId/:subTaskId` | Update a subtask |
| Subtasks | `DELETE /tasks/:projectId/:taskId/:subTaskId` | Delete a subtask |
| Subtasks | `POST /tasks/:projectId/:taskId/ai-subtasks` | Generate subtasks with Gemini |
| Notes | `GET /notes/:projectId`, `POST /notes/:projectId` | List or create project notes |
| Notes | `GET /notes/:projectId/:noteId` | Get note details |
| Notes | `PUT /notes/:projectId/:noteId`, `DELETE /notes/:projectId/:noteId` | Update or delete a note |

### Access control

| Operation | Access enforced by current routes |
|---|---|
| List and create projects | Authenticated user |
| View a project | Project member with `admin`, `project_admin`, or `member` role |
| Update a project | Project `admin` |
| Delete a project | Project `admin`; the controller also requires the caller to be its creator |
| List project members | Authenticated user; the route does not check project membership |
| Add, update, or remove a member | Project `admin` |
| List or view tasks | Project `admin` or `member` |
| Create, update, or delete tasks | Project `admin` |
| Create or delete subtasks; generate AI subtasks | Project `admin` |
| Update a subtask | Project `admin` or `member` |
| Read project notes | Project `admin` or `member` |
| Create, update, or delete project notes | Project `admin` |

`project_admin` is a defined role and can view project details, but task and note routes do not currently grant it the `admin` permissions.

## Additional server routes

The Express app also defines `GET /` (plain-text greeting), `GET /api/v1/jokes` (sample JSON), `GET /instagram`, and `GET /krishna` (plain-text responses). These are demo routes and are separate from the project-management API.

## Frontend scripts

Run these from `frontend/`:

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build in frontend/dist
npm run preview   # Preview the production build
npm run lint      # Run ESLint
```

## Current scope

The repository includes backend and frontend build/lint tooling. It does not currently define an automated backend test suite. Task attachment fields and Multer configuration are present in the backend, but task file uploads are not wired into the task routes.

## Author

**Krishna Agarwal** · [GitHub](https://github.com/krishna2720) · [LinkedIn](https://www.linkedin.com/in/krishna-agarwal-a6a518321/)
