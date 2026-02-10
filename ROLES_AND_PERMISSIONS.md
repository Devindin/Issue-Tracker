# 🔐 User Roles & Permissions System

## Overview
The Issue Tracker uses a **Role-Based Access Control (RBAC)** system with fine-grained permissions. Each user has a **role** that determines their base permissions, which can be further customized.

---

## 📊 User Roles

### 1. 👤 **Viewer** (Most Restricted)
**Default Permissions:**
- ❌ Cannot create issues
- ❌ Cannot edit issues
- ❌ Cannot delete issues
- ❌ Cannot assign issues
- ✅ Can view all issues (if enabled)
- ❌ Cannot manage users
- ❌ Cannot view reports
- ❌ Cannot export data

**Use Case:** External stakeholders, clients, or read-only observers

---

### 2. 💻 **Developer**
**Default Permissions:**
- ✅ Can create issues
- ✅ Can edit issues
- ❌ Cannot delete issues
- ❌ Cannot assign issues
- ✅ Can view all issues
- ❌ Cannot manage users
- ❌ Cannot view reports
- ❌ Cannot export data

**Use Case:** Software developers, engineers working on issues

---

### 3. 🧪 **QA (Quality Assurance)**
**Default Permissions:**
- ✅ Can create issues
- ✅ Can edit issues
- ❌ Cannot delete issues
- ✅ Can assign issues
- ✅ Can view all issues
- ❌ Cannot manage users
- ✅ Can view reports
- ✅ Can export data

**Use Case:** Quality assurance testers, bug reporters

---

### 4. 👔 **Manager**
**Default Permissions:**
- ✅ Can create issues
- ✅ Can edit issues
- ✅ Can delete issues
- ✅ Can assign issues
- ✅ Can view all issues
- ✅ Can manage users (create/edit/delete)
- ✅ Can view reports
- ✅ Can export data

**Use Case:** Project managers, team leads

---

### 5. 🔑 **Admin** (Full Access)
**Default Permissions:**
- ✅ All permissions enabled
- ✅ Bypasses all permission checks
- ✅ Can manage company settings
- ✅ Company owner role

**Use Case:** Company owners, system administrators

---

## 🎯 Permission Flags

### Issue Management
| Permission | Description | Roles with Access |
|-----------|-------------|-------------------|
| `canCreateIssues` | Create new issues | Developer, QA, Manager, Admin |
| `canEditIssues` | Modify existing issues | Developer, QA, Manager, Admin |
| `canDeleteIssues` | Delete issues permanently | Manager, Admin |
| `canAssignIssues` | Assign issues to users | QA, Manager, Admin |
| `canViewAllIssues` | View all company issues | All roles (configurable) |

### User Management
| Permission | Description | Roles with Access |
|-----------|-------------|-------------------|
| `canManageUsers` | Create, edit, delete users | Manager, Admin |

### Reporting & Data
| Permission | Description | Roles with Access |
|-----------|-------------|-------------------|
| `canViewReports` | Access reports section | QA, Manager, Admin |
| `canExportData` | Export data to CSV/JSON | QA, Manager, Admin |

---

## 🔧 Implementation Details

### Backend Implementation

#### 1. **User Model** (`backend/models/User.js`)
```javascript
{
  role: 'admin' | 'manager' | 'developer' | 'qa' | 'viewer',
  permissions: {
    canCreateIssues: Boolean,
    canEditIssues: Boolean,
    canDeleteIssues: Boolean,
    canAssignIssues: Boolean,
    canViewAllIssues: Boolean,
    canManageUsers: Boolean,
    canViewReports: Boolean,
    canExportData: Boolean
  }
}
```

#### 2. **Permission Middleware** (`backend/middleware/permissionMiddleware.js`)

**Available Middleware Functions:**

```javascript
// Check single permission
requirePermission('canCreateIssues')

// Check if user has ANY of the permissions
requireAnyPermission(['canEditIssues', 'canDeleteIssues'])

// Check if user has ALL permissions
requireAllPermissions(['canManageUsers', 'canViewReports'])

// Check role
requireRole('admin')  // or ['admin', 'manager']

// Attach permissions to request object
attachPermissions
```

**Usage Example:**
```javascript
router.post("/", authMiddleware, requirePermission('canCreateIssues'), async (req, res) => {
  // Only users with canCreateIssues permission can reach here
});
```

#### 3. **Protected Routes**

**Issues Routes** (`backend/routes/IssueRoutes.js`):
- `GET /issues` - ✅ Authenticated only (view based on canViewAllIssues)
- `POST /issues` - ✅ **PROTECTED**: `requirePermission('canCreateIssues')`
- `PUT /issues/:id` - ✅ **PROTECTED**: `requirePermission('canEditIssues')`
- `DELETE /issues/:id` - ✅ **PROTECTED**: `requirePermission('canDeleteIssues')`

**User Routes** (`backend/routes/UserRoutes.js`):
- `GET /users` - ✅ Authenticated only
- `POST /users` - ✅ **PROTECTED**: Checks `canManageUsers`
- `PUT /users/:id` - ✅ **PROTECTED**: Checks `canManageUsers`
- `DELETE /users/:id` - ✅ **PROTECTED**: Checks `canManageUsers`

**Project Routes** (`backend/routes/ProjectRoutes.js`):
- Currently **NOT PROTECTED** ⚠️ (See recommendations below)

---

## 🚀 How to Use

### Creating a User with Specific Permissions

```javascript
// Default role permissions are automatically applied
const userData = {
  name: "John Doe",
  email: "john@example.com",
  password: "securePassword123",
  role: "developer", // Uses developer defaults
};

// Override specific permissions
const userDataWithCustomPermissions = {
  name: "Jane Doe",
  email: "jane@example.com",
  password: "securePassword123",
  role: "viewer",
  permissions: {
    canViewAllIssues: true, // Custom: Allow this viewer to see all issues
    canCreateIssues: true,  // Custom: Allow creating issues
  }
};
```

### Frontend Permission Checks

```typescript
// Get user from Redux state
const { user } = useSelector((state: any) => state.auth);

// Check permission
if (user?.permissions?.canCreateIssues) {
  // Show create issue button
}

// Check role
if (user?.role === 'admin') {
  // Show admin panel
}
```

---

## ⚠️ Current Issues & Recommendations

### ❌ **Missing Implementations**

1. **Project Management Permissions**
   - Projects routes have NO permission checks
   - Anyone authenticated can create/edit/delete projects
   - **Recommendation:** Add project-specific permissions

2. **Report Access Not Enforced**
   - `canViewReports` is defined but not enforced
   - Reports page is accessible to all authenticated users
   - **Recommendation:** Protect reports routes

3. **Export Data Not Enforced**
   - `canExportData` is checked in frontend only
   - Backend doesn't validate permission
   - **Recommendation:** Add backend validation

4. **View All Issues Not Enforced**
   - `canViewAllIssues` should filter which issues users can see
   - Currently, all authenticated users see all company issues
   - **Recommendation:** Filter issues based on permission

---

## 🔨 Recommended Improvements

### 1. Add Project Permissions

Add to `User` model:
```javascript
permissions: {
  // ... existing permissions
  canCreateProjects: Boolean,
  canEditProjects: Boolean,
  canDeleteProjects: Boolean,
  canManageProjectMembers: Boolean,
}
```

Update role defaults:
- **Viewer**: No project permissions
- **Developer**: View projects only
- **QA**: View + assign to projects
- **Manager**: Create, edit, manage members
- **Admin**: Full control

### 2. Implement Report Protection

```javascript
// In backend/routes/ReportRoutes.js
router.get("/", authMiddleware, requirePermission('canViewReports'), async (req, res) => {
  // Generate reports
});
```

### 3. Filter Issues by Permission

```javascript
// In backend/routes/IssueRoutes.js
router.get("/", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId);
  
  let query = { company: req.user.companyId };
  
  // If user cannot view all issues, only show their own
  if (!user.permissions.canViewAllIssues && user.role !== 'admin') {
    query.$or = [
      { assignee: req.user.userId },
      { reporter: req.user.userId }
    ];
  }
  
  const issues = await Issue.find(query);
  // ...
});
```

### 4. Add Activity Logging

```javascript
// Log permission-protected actions
{
  user: userId,
  action: 'CREATE_ISSUE',
  resource: 'Issue',
  resourceId: issueId,
  timestamp: Date.now()
}
```

### 5. Frontend Permission Component

```typescript
// components/ProtectedAction.tsx
interface ProtectedActionProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const ProtectedAction: React.FC<ProtectedActionProps> = ({ 
  permission, 
  fallback, 
  children 
}) => {
  const { user } = useSelector((state: any) => state.auth);
  
  if (user?.role === 'admin') return <>{children}</>;
  if (user?.permissions?.[permission]) return <>{children}</>;
  
  return <>{fallback || null}</>;
};

// Usage:
<ProtectedAction permission="canCreateIssues">
  <button>Create Issue</button>
</ProtectedAction>
```

---

## 📝 Testing Permissions

### Test Scenarios

1. **Viewer Role**
   - ✅ Can login
   - ✅ Can view issues (if canViewAllIssues = true)
   - ❌ Cannot create issues
   - ❌ Cannot edit issues
   - ❌ Cannot delete issues

2. **Developer Role**
   - ✅ Can create issues
   - ✅ Can edit issues
   - ❌ Cannot delete issues
   - ❌ Cannot manage users

3. **Manager Role**
   - ✅ Can create users
   - ✅ Can delete issues
   - ✅ Can export data
   - ✅ Full issue management

4. **Admin Role**
   - ✅ Bypasses all permission checks
   - ✅ Full system access

---

## 🔐 Security Best Practices

1. **Always check permissions on the backend** - Never trust frontend checks alone
2. **Admin role bypasses all checks** - Use sparingly
3. **Validate company scope** - Ensure users only access their company's data
4. **Log sensitive actions** - Track who did what and when
5. **Use HTTPS** - Protect tokens and credentials in transit
6. **Rotate JWT secrets** - Regularly update JWT_SECRET
7. **Implement rate limiting** - Prevent brute force attacks
8. **Set token expiration** - Currently set to 7 days

---

## 📚 Related Files

- `backend/models/User.js` - User model with roles and permissions
- `backend/middleware/authmiddleware.js` - JWT authentication
- `backend/middleware/permissionMiddleware.js` - Permission checking
- `backend/routes/UserRoutes.js` - User management with permission checks
- `backend/routes/IssueRoutes.js` - Issue management with permission checks
- `backend/routes/AuthRoutes.js` - Authentication and registration
- `frontend/src/Components/UserManagementTab.tsx` - Frontend user management
- `frontend/src/types/settings.ts` - TypeScript type definitions

---

## 🆘 Support

For questions about roles and permissions:
1. Check this documentation
2. Review the middleware implementations
3. Test with different user roles
4. Consult the code examples above

**Remember:** Admin users have full access and bypass all permission checks!
