# 🎯 Issue Tracker - Complete Project Documentation

A full-stack issue tracking system with role-based access control, project management, and comprehensive user management features. Built with React + TypeScript frontend and Node.js + Express backend.

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [User Roles & Permissions](#-user-roles--permissions)
- [API Documentation](#-api-documentation)
- [Database Models](#-database-models)
- [Frontend Architecture](#-frontend-architecture)
- [Backend Architecture](#-backend-architecture)
- [Security Features](#-security-features)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## ✨ Features

### Core Functionality
- 🎫 **Issue Management**: Create, edit, delete, and track issues
- 📊 **Project Management**: Organize issues by projects
- 👥 **User Management**: Multi-user system with role-based access
- 🏢 **Multi-tenant**: Company-based data isolation
- 🔐 **Authentication**: JWT-based secure authentication
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

### Advanced Features
- ✅ **Role-Based Access Control (RBAC)**: 5 user roles with granular permissions
- 🔍 **Advanced Filtering**: Search and filter issues by multiple criteria
- 📈 **Reports & Analytics**: Visual dashboards and statistics
- 💾 **Data Export**: Export issues to CSV/JSON formats
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS and Framer Motion animations
- 🔄 **Real-time Updates**: Redux Toolkit Query for efficient data synchronization

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.x |
| **TypeScript** | Type Safety | 5.x |
| **Vite** | Build Tool | 5.x |
| **Redux Toolkit** | State Management | 2.x |
| **RTK Query** | Data Fetching | Included |
| **React Router** | Routing | 6.x |
| **Tailwind CSS** | Styling | 3.x |
| **Framer Motion** | Animations | 11.x |
| **Formik** | Form Management | 2.x |
| **Yup** | Form Validation | 1.x |
| **React Icons** | Icons | 5.x |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime | 18.x+ |
| **Express** | Web Framework | 4.x |
| **MongoDB** | Database | 6.x+ |
| **Mongoose** | ODM | 8.x |
| **JWT** | Authentication | 9.x |
| **bcrypt** | Password Hashing | 5.x |
| **dotenv** | Environment Config | 16.x |
| **cors** | CORS Middleware | 2.x |

---

## 📂 Project Structure

```
Issue-Tracker/
├── backend/                    # Backend Node.js application
│   ├── middleware/            # Custom middleware
│   │   ├── authmiddleware.js     # JWT authentication
│   │   └── permissionMiddleware.js # Permission checking
│   ├── models/                # MongoDB models
│   │   ├── Company.js            # Company model
│   │   ├── User.js               # User model with permissions
│   │   ├── Project.js            # Project model
│   │   └── Issue.js              # Issue model
│   ├── routes/                # API routes
│   │   ├── AuthRoutes.js         # Authentication endpoints
│   │   ├── UserRoutes.js         # User management endpoints
│   │   ├── ProjectRoutes.js      # Project endpoints
│   │   └── IssueRoutes.js        # Issue endpoints
│   ├── index.js               # Express app entry point
│   └── package.json           # Backend dependencies
│
├── frontend/                  # Frontend React application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── app/             # Redux store configuration
│   │   │   └── stores.ts
│   │   ├── Components/      # Reusable components
│   │   │   ├── IssueCard.tsx
│   │   │   ├── DeleteModal.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── UserManagementTab.tsx
│   │   │   └── ... (30+ components)
│   │   ├── features/        # Redux features (API slices)
│   │   │   ├── auth/           # Authentication
│   │   │   ├── issues/         # Issues management
│   │   │   ├── projects/       # Projects management
│   │   │   ├── users/          # User management
│   │   │   ├── dashboard/      # Dashboard data
│   │   │   └── reports/        # Reports data
│   │   ├── Layout/          # Layout components
│   │   │   └── PageLayout.tsx
│   │   ├── Pages/           # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Issues.tsx
│   │   │   ├── CreateIssue.tsx
│   │   │   ├── EditIssue.tsx
│   │   │   ├── ViewIssue.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── ... (15+ pages)
│   │   ├── services/        # API configuration
│   │   │   └── apiSlice.ts
│   │   ├── types/           # TypeScript types
│   │   │   ├── index.ts
│   │   │   ├── user.ts
│   │   │   ├── issue.ts
│   │   │   └── settings.ts
|   |   ├── utils/
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # App entry point
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.ts       # Vite configuration
│   ├── tailwind.config.js   # Tailwind configuration
│   └── tsconfig.json        # TypeScript configuration
│
├── .gitignore
├── README.md                # This file
├── ROLES_AND_PERMISSIONS.md # Detailed permission docs
├── PERMISSION_SETUP_GUIDE.md # Implementation guide
└── PERMISSION_QUICK_REFERENCE.md # Quick reference
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **MongoDB**: Version 6.x or higher ([Download](https://www.mongodb.com/try/download/community))
  - Can use MongoDB Atlas for cloud database
- **Git**: For cloning the repository
- **npm** or **yarn**: Package manager (comes with Node.js)

### System Requirements
- Operating System: Windows 10+, macOS 10.15+, or Linux
- RAM: 4GB minimum, 8GB recommended
- Disk Space: 500MB for dependencies

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/issue-tracker.git
cd issue-tracker
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Copy .env.example to .env or create new file
touch .env

# Edit .env file with your configuration (see Environment Configuration section)
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional - for custom API URL)
touch .env
```

---

## ⚙️ Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/issue-tracker
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/issue-tracker?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRES_IN=7d

# CORS Configuration (optional)
CLIENT_URL=http://localhost:5173

# Optional: For production
# MONGO_URI=your_production_mongodb_uri
# JWT_SECRET=your_secure_production_secret
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory (optional):

```env
# API Base URL (default: http://localhost:5000)
VITE_API_URL=http://localhost:5000

# For production:
# VITE_API_URL=https://your-production-api.com
```

### Important Security Notes

⚠️ **NEVER commit `.env` files to version control!**

- The `.env` files are already in `.gitignore`
- Change `JWT_SECRET` to a strong, random string (minimum 32 characters)
- Use different secrets for development and production
- Keep your MongoDB credentials secure

---

## 🏃 Running the Application

### Development Mode

#### Start Backend Server

```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev  # (requires nodemon installed globally)
```

Backend will run on: **http://localhost:5000**

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on: **http://localhost:5173**

### Production Build

#### Build Frontend

```bash
cd frontend
npm run build
# Creates optimized production build in dist/ folder
```

#### Serve Frontend Build

```bash
# Install serve globally (optional)
npm install -g serve
serve -s dist -p 3000
```

#### Production Backend

```bash
cd backend
NODE_ENV=production node index.js
```

### Quick Start Script

Create a `start.sh` (Linux/Mac) or `start.bat` (Windows) in root:

**Linux/Mac (start.sh):**
```bash
#!/bin/bash
# Start backend
cd backend && npm start &
# Start frontend
cd ../frontend && npm run dev
```

**Windows (start.bat):**
```batch
@echo off
start cmd /k "cd backend && npm start"
start cmd /k "cd frontend && npm run dev"
```

---

## 🔐 User Roles & Permissions

The system implements a comprehensive **Role-Based Access Control (RBAC)** system with 5 distinct roles and 8 granular permissions.

### User Roles Hierarchy

```
🔑 Admin (Company Owner)
  └── Full system access, bypasses all permission checks
  └── Default role for company registration

👔 Manager
  └── Operational control
  └── Can manage users, delete issues, view reports

🧪 QA (Quality Assurance)
  └── Testing and reporting focus
  └── Can assign issues, view reports, export data

💻 Developer
  └── Implementation focus
  └── Can create and edit issues

👤 Viewer
  └── Read-only access
  └── Limited visibility based on permissions
```

### Permission Matrix

| Permission | Viewer | Developer | QA | Manager | Admin |
|-----------|:------:|:---------:|:--:|:-------:|:-----:|
| **Create Issues** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Edit Issues** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Delete Issues** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Assign Issues** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **View All Issues** | Configurable | ✅ | ✅ | ✅ | ✅ |
| **Manage Users** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **View Reports** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Export Data** | ❌ | ❌ | ✅ | ✅ | ✅ |

### Permission Flags

```typescript
interface UserPermissions {
  canCreateIssues: boolean;    // Create new issues
  canEditIssues: boolean;      // Modify existing issues
  canDeleteIssues: boolean;    // Delete issues permanently
  canAssignIssues: boolean;    // Assign issues to other users
  canViewAllIssues: boolean;   // View all company issues vs. only assigned
  canManageUsers: boolean;     // Create, edit, delete users
  canViewReports: boolean;     // Access reports and analytics
  canExportData: boolean;      // Export data to CSV/JSON
}
```

### Default Permission Sets

<details>
<summary>Click to expand role configurations</summary>

**Viewer:**
```javascript
{
  canCreateIssues: false,
  canEditIssues: false,
  canDeleteIssues: false,
  canAssignIssues: false,
  canViewAllIssues: false,  // Only sees assigned/reported issues
  canManageUsers: false,
  canViewReports: false,
  canExportData: false
}
```

**Developer:**
```javascript
{
  canCreateIssues: true,
  canEditIssues: true,
  canDeleteIssues: false,
  canAssignIssues: false,
  canViewAllIssues: true,
  canManageUsers: false,
  canViewReports: false,
  canExportData: false
}
```

**QA:**
```javascript
{
  canCreateIssues: true,
  canEditIssues: true,
  canDeleteIssues: false,
  canAssignIssues: true,
  canViewAllIssues: true,
  canManageUsers: false,
  canViewReports: true,
  canExportData: true
}
```

**Manager:**
```javascript
{
  canCreateIssues: true,
  canEditIssues: true,
  canDeleteIssues: true,
  canAssignIssues: true,
  canViewAllIssues: true,
  canManageUsers: true,
  canViewReports: true,
  canExportData: true
}
```

**Admin:**
```javascript
{
  canCreateIssues: true,
  canEditIssues: true,
  canDeleteIssues: true,
  canAssignIssues: true,
  canViewAllIssues: true,
  canManageUsers: true,
  canViewReports: true,
  canExportData: true
}
// Plus: Admin role bypasses ALL permission checks
```

</details>

### Custom Permissions

Permissions can be customized per user when creating or editing:

```javascript
// Example: Give a developer access to reports
{
  role: "developer",
  permissions: {
    ...defaultDeveloperPermissions,
    canViewReports: true  // Custom override
  }
}
```

For complete permission documentation, see:
- [ROLES_AND_PERMISSIONS.md](ROLES_AND_PERMISSIONS.md) - Detailed explanation
- [PERMISSION_SETUP_GUIDE.md](PERMISSION_SETUP_GUIDE.md) - Implementation guide
- [PERMISSION_QUICK_REFERENCE.md](PERMISSION_QUICK_REFERENCE.md) - Quick lookup

---

## 📡 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints

#### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register-company` | Register new company and admin user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user info | Yes |

**Register Company:**
```bash
POST /api/auth/register-company
Content-Type: application/json

{
  "companyName": "Acme Corp",
  "companyDescription": "Software company",
  "name": "John Doe",
  "email": "john@acme.com",
  "password": "securePassword123"
}

Response: {
  "message": "Company registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@acme.com",
    "role": "admin",
    "company": { ... }
  }
}
```

**Login:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@acme.com",
  "password": "securePassword123"
}

Response: {
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

#### 👥 User Management Endpoints

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|---------------------|
| GET | `/users` | Get all company users | Authenticated |
| GET | `/users/:id` | Get user by ID | Authenticated |
| POST | `/users` | Create new user | `canManageUsers` |
| PUT | `/users/:id` | Update user | `canManageUsers` |
| DELETE | `/users/:id` | Delete user | `canManageUsers` |

**Create User:**
```bash
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@acme.com",
  "password": "password123",
  "role": "developer",
  "status": "active"
}
```

#### 🎫 Issue Endpoints

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|---------------------|
| GET | `/issues` | Get all issues (filtered) | Authenticated |
| GET | `/issues/:id` | Get issue by ID | Authenticated |
| POST | `/issues` | Create issue | `canCreateIssues` |
| PUT | `/issues/:id` | Update issue | `canEditIssues` |
| DELETE | `/issues/:id` | Delete issue | `canDeleteIssues` |

**Query Parameters for GET /issues:**
- `search` - Search in title/description
- `status` - Filter by status (Open, In Progress, Resolved, Closed)
- `priority` - Filter by priority (Low, Medium, High, Critical)
- `severity` - Filter by severity (Minor, Major, Critical)
- `project` - Filter by project ID

**Create Issue:**
```bash
POST /api/issues
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Login page not responsive",
  "description": "The login page doesn't work on mobile devices",
  "status": "Open",
  "priority": "High",
  "severity": "Major",
  "assigneeId": "507f1f77bcf86cd799439011",
  "projectId": "507f1f77bcf86cd799439012"
}
```

#### 📊 Project Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/projects` | Get all projects | Yes |
| GET | `/projects/:id` | Get project by ID | Yes |
| POST | `/projects` | Create project | Yes |
| PUT | `/projects/:id` | Update project | Yes |
| DELETE | `/projects/:id` | Delete project | Yes |

**Create Project:**
```bash
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Complete website redesign project",
  "key": "WR",
  "icon": "🎨",
  "color": "#3B82F6",
  "lead": "507f1f77bcf86cd799439011",
  "members": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439013"],
  "startDate": "2026-01-01",
  "endDate": "2026-06-30"
}
```

### Error Responses

All endpoints follow consistent error format:

```json
{
  "message": "Error description",
  "error": "Optional detailed error"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

## 💾 Database Models

### Company Model

```javascript
{
  name: String,           // Company name
  description: String,    // Company description
  owner: ObjectId,        // Reference to User (admin)
  createdAt: Date,
  updatedAt: Date
}
```

### User Model

```javascript
{
  name: String,
  email: String,          // Unique per company
  password: String,       // Hashed with bcrypt
  role: String,           // admin, manager, developer, qa, viewer
  company: ObjectId,      // Reference to Company
  permissions: {
    canCreateIssues: Boolean,
    canEditIssues: Boolean,
    canDeleteIssues: Boolean,
    canAssignIssues: Boolean,
    canViewAllIssues: Boolean,
    canManageUsers: Boolean,
    canViewReports: Boolean,
    canExportData: Boolean
  },
  status: String,         // active, inactive
  avatar: String,         // Avatar URL
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}

// Compound Index: email + company (unique together)
```

### Project Model

```javascript
{
  name: String,
  description: String,
  key: String,            // Unique project key (e.g., "WEB")
  icon: String,           // Emoji icon
  color: String,          // Hex color code
  lead: ObjectId,         // Reference to User
  members: [ObjectId],    // Array of User references
  company: ObjectId,      // Reference to Company
  status: String,         // active, archived, completed
  startDate: Date,
  endDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Issue Model

```javascript
{
  title: String,
  description: String,
  status: String,         // Open, In Progress, Resolved, Closed
  priority: String,       // Low, Medium, High, Critical
  severity: String,       // Minor, Major, Critical
  assignee: ObjectId,     // Reference to User (optional)
  reporter: ObjectId,     // Reference to User
  project: ObjectId,      // Reference to Project
  company: ObjectId,      // Reference to Company
  completedAt: Date,      // When issue was resolved/closed
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Frontend Architecture

### State Management

**Redux Toolkit** with **RTK Query** for efficient data fetching:

```typescript
// Store structure
{
  auth: {
    user: User | null,
    token: string | null
  },
  api: {
    queries: { ... },
    mutations: { ... }
  }
}
```

### API Slices

- **authApi** - Authentication endpoints
- **issueApi** - Issue CRUD operations
- **projectApi** - Project management
- **userApi** - User management
- **dashboardApi** - Dashboard statistics
- **employeeApi** - Employee data

### Key Components

<details>
<summary>Click to expand component list</summary>

**Layout:**
- `PageLayout` - Main page wrapper with navigation

**Pages:**
- `Login`, `Register` - Authentication
- `Dashboard` - Overview with statistics
- `Issues`, `CreateIssue`, `EditIssue`, `ViewIssue` - Issue management
- `ProjectsPage`, `CreateProject`, `EditProject`, `ViewProject` - Project management
- `EmployeesPage` - Employee management
- `Reports` - Analytics and reports
- `Settings` - User settings with tabs

**Reusable Components:**
- `IssueCard` - Issue display card
- `DeleteModal` - Confirmation modal
- `StatusModal` - Success/error modals
- `Pagination` - Page navigation
- `MetricCard`, `StatCard` - Dashboard cards
- `PriorityChart`, `StatusChart`, `TrendChart` - Visual charts
- `UserManagementTab` - User management interface
- `ProtectedRoute` - Route authentication wrapper

</details>

### Routing

```typescript
/ - Dashboard (protected)
/login - Login page
/register - Registration page
/issues - Issues list (protected)
/issues/new - Create issue (protected)
/issues/:id - View issue (protected)
/issues/:id/edit - Edit issue (protected)
/projects - Projects list (protected)
/projects/new - Create project (protected)
/projects/:id - View project (protected)
/projects/:id/edit - Edit project (protected)
/employees - Employees list (protected)
/reports - Reports page (protected)
/settings - Settings page (protected)
```

### Styling

- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Responsive Design** with mobile-first approach
- **Custom Color Palette** 
  - Primary: Indigo (#4F46E5)
  - Success: Green (#10B981)
  - Warning: Yellow (#F59E0B)
  - Error: Red (#EF4444)

---

## 🏗️ Backend Architecture

### Middleware Stack

```javascript
app.use(cors());              // CORS handling
app.use(express.json());      // JSON parsing
app.use(authMiddleware);      // JWT verification (protected routes)
app.use(permissionMiddleware); // Permission checking
```

### Custom Middleware

**authMiddleware.js:**
- Verifies JWT token
- Attaches user info to request: `req.user`, `req.userId`, `req.companyId`

**permissionMiddleware.js:**
- `requirePermission(permission)` - Check single permission
- `requireAnyPermission([permissions])` - Require at least one
- `requireAllPermissions([permissions])` - Require all
- `requireRole(role)` - Check user role
- `attachPermissions` - Add permissions to request object

### Route Structure

```javascript
/api/auth/*       - Authentication (public)
/api/users/*      - User management (protected)
/api/issues/*     - Issue management (protected)
/api/projects/*   - Project management (protected)
```

### Security Features

1. **Password Security**
   - Bcrypt hashing with salt rounds: 10
   - Passwords never returned in API responses
   - Minimum length enforced

2. **JWT Security**
   - Tokens expire in 7 days (configurable)
   - Secret key stored in environment variable
   - Token includes: userId, companyId, role

3. **Data Isolation**
   - All queries filtered by companyId
   - Users can only access their company's data
   - Email uniqueness per company (not global)

4. **Permission Enforcement**
   - Backend validates all permissions
   - Admin role bypasses checks
   - Permission denied returns 403 status

---

## 🛡️ Security Features

### Authentication
- ✅ JWT-based authentication
- ✅ Secure password hashing (bcrypt)
- ✅ Token expiration
- ✅ Protected routes

### Authorization
- ✅ Role-based access control
- ✅ Granular permissions
- ✅ Backend permission validation
- ✅ Company-based data isolation

### Data Protection
- ✅ MongoDB injection prevention (Mongoose)
- ✅ CORS configuration
- ✅ Sensitive data filtering
- ✅ Environment variable security

### Best Practices
- ✅ No passwords in responses
- ✅ Compound indexes for performance
- ✅ Input validation (Yup, Formik)
- ✅ Error handling middleware
- ✅ Request logging

### Recommendations

⚠️ **For Production:**

1. **Use HTTPS** - Enable SSL/TLS
2. **Rate Limiting** - Prevent brute force attacks
3. **Helmet.js** - Security headers
4. **Input Sanitization** - Prevent XSS
5. **Audit Logging** - Track sensitive actions
6. **Regular Updates** - Keep dependencies updated
7. **Backup Strategy** - Regular database backups
8. **Monitoring** - Application performance monitoring

---

## 🧪 Testing

### Manual Testing

1. **Create Test Users:**
```bash
# In MongoDB or via API
- Admin user (created during registration)
- Manager user (via Settings -> Users)
- Developer user
- QA user
- Viewer user
```

2. **Test Permission Scenarios:**
   - Login as each role
   - Try creating/editing/deleting issues
   - Verify correct error messages (403 vs 404)
   - Check UI elements visibility

3. **Test Data Isolation:**
   - Register multiple companies
   - Verify users only see their company's data
   - Test cross-company access attempts

### Testing Checklist

- [ ] User registration and login
- [ ] Company creation
- [ ] User management (CRUD)
- [ ] Issue management (CRUD)
- [ ] Project management (CRUD)
- [ ] Permission enforcement for all roles
- [ ] Data filtering by company
- [ ] Search and filter functionality
- [ ] Export functionality
- [ ] Dashboard statistics
- [ ] Mobile responsiveness
- [ ] Error handling

### Automated Testing (Future)

```bash
# Backend tests (to be implemented)
cd backend
npm test

# Frontend tests (to be implemented)
cd frontend
npm test
```

---

## 🔧 Troubleshooting

### Common Issues

#### Backend won't start

**Problem:** `Error: Cannot find module`
```bash
Solution:
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Problem:** `MongooseError: Operation buffering timed out`
```bash
Solution:
- Check MongoDB is running: mongod
- Verify MONGO_URI in .env
- Check network connectivity
```

**Problem:** `Error: secretOrPrivateKey must have a value`
```bash
Solution:
- Add JWT_SECRET to backend/.env
- Ensure it's at least 32 characters
```

#### Frontend won't start

**Problem:** `Failed to resolve import`
```bash
Solution:
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Problem:** API calls fail with CORS error
```bash
Solution:
- Check backend is running
- Verify CLIENT_URL in backend/.env
- Check VITE_API_URL in frontend/.env
```

#### Permission Issues

**Problem:** Getting 403 errors unexpectedly
```bash
Solution:
- Check user role in database
- Verify permissions in user document
- Check route protection in backend
- Review ROLES_AND_PERMISSIONS.md
```

**Problem:** Admin can't perform actions
```bash
Solution:
- Verify user.role === 'admin'
- Check middleware order in routes
- Ensure admin bypass logic is working
```

#### Database Issues

**Problem:** Duplicate key error
```bash
Solution:
- Check compound indexes (email + company)
- Verify unique constraints
- Clear test data if needed
```

**Problem:** Data not showing
```bash
Solution:
- Check companyId filtering
- Verify user is authenticated
- Check API response in network tab
- Verify permissions allow viewing
```

### Useful Commands

```bash
# Check MongoDB connection
mongosh
> show dbs
> use issue-tracker
> show collections

# View logs
# Backend logs appear in terminal where npm start was run

# Clear MongoDB completely (BE CAREFUL!)
> db.dropDatabase()

# Check Node version
node --version

# Check MongoDB version
mongod --version

# Check port usage
# Windows:
netstat -ano | findstr :5000
# Mac/Linux:
lsof -i :5000
```

### Debug Mode

Enable debug logging:

**Backend:**
```javascript
// In backend/index.js
const DEBUG = true;
app.use((req, res, next) => {
  if (DEBUG) console.log(`${req.method} ${req.path}`);
  next();
});
```

**Frontend:**
```typescript
// Redux Toolkit DevTools enabled by default in development
// Check Redux DevTools extension in browser
```

---

## 📚 Additional Resources

### Documentation Files
- [ROLES_AND_PERMISSIONS.md](ROLES_AND_PERMISSIONS.md) - Complete permission system documentation
- [PERMISSION_SETUP_GUIDE.md](PERMISSION_SETUP_GUIDE.md) - Step-by-step implementation guide
- [PERMISSION_QUICK_REFERENCE.md](PERMISSION_QUICK_REFERENCE.md) - Quick permission lookup

### External Links
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🤝 Contributing

### Development Workflow

1. Create a new branch for your feature
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes
3. Test thoroughly with all user roles
4. Commit with descriptive messages
```bash
git commit -m "Add: Description of feature"
```

5. Push and create pull request
```bash
git push origin feature/your-feature-name
```

### Coding Standards

**Backend:**
- Use async/await for asynchronous operations
- Include error handling in all routes
- Add console.log for debugging (prefix with component name)
- Follow existing route structure

**Frontend:**
- Use TypeScript for type safety
- Follow React functional components pattern
- Use Redux Toolkit Query for API calls
- Keep components small and focused
- Use Tailwind classes for styling


---



## 🗺️ Roadmap

### Planned Features

- [ ] Email notifications
- [ ] Real-time updates with WebSocket
- [ ] File attachments for issues
- [ ] Comment system
- [ ] Activity timeline
- [ ] Advanced search with filters
- [ ] Dark mode
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Audit logging
- [ ] Two-factor authentication
- [ ] Password reset via email
- [ ] User avatars upload
- [ ] Project templates
- [ ] Issue templates
- [ ] Custom fields
- [ ] Integration with GitHub/Jira
- [ ] Email reports
- [ ] Advanced analytics

---


