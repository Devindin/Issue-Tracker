# Permission System Quick Reference

## Role Hierarchy

```
   Admin (Full Access)
    └── All Permissions Enabled
    └── Bypasses All Checks
    └── Company Owner

   Manager (Operational Control)
    └── Create/Edit/Delete Issues ✅
    └── Manage Users ✅
    └── View Reports ✅
    └── Export Data ✅
    └── Assign Issues ✅

   QA (Testing & Reporting)
    └── Create/Edit Issues ✅
    └── Assign Issues ✅
    └── View Reports ✅
    └── Export Data ✅
    └── NO: Delete, User Management ❌

💻 Developer (Implementation)
    └── Create/Edit Issues ✅
    └── View All Issues ✅
    └── NO: Delete, Assign, Reports, Users ❌

👤 Viewer (Read-Only)
    └── View Issues Only ✅
    └── NO: Any Write Actions ❌
```

## Permission Matrix

| Action | Viewer | Developer | QA | Manager | Admin |
|--------|:------:|:---------:|:--:|:-------:|:-----:|
| View Issues | Limited* | ✅ | ✅ | ✅ | ✅ |
| Create Issues | ❌ | ✅ | ✅ | ✅ | ✅ |
| Edit Issues | ❌ | ✅ | ✅ | ✅ | ✅ |
| Delete Issues | ❌ | ❌ | ❌ | ✅ | ✅ |
| Assign Issues | ❌ | ❌ | ✅ | ✅ | ✅ |
| View Reports | ❌ | ❌ | ✅ | ✅ | ✅ |
| Export Data | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage Projects | ❌ | ❌ | ❌ | ✅** | ✅ |

*Limited = Only if `canViewAllIssues` is true, otherwise only sees assigned/reported issues
**Recommended implementation, currently not enforced

## Code Examples

### Backend Route Protection

```javascript
// Require specific permission
router.post("/issues", authMiddleware, requirePermission('canCreateIssues'), handler);

// Require role
router.post("/projects", authMiddleware, requireRole(['manager', 'admin']), handler);

// Require any permission
router.get("/data", authMiddleware, requireAnyPermission(['canViewReports', 'canExportData']), handler);

// Require all permissions
router.post("/bulk", authMiddleware, requireAllPermissions(['canEditIssues', 'canDeleteIssues']), handler);
```

### Frontend Permission Check

```typescript
import { hasPermission } from '../utils/permissions';
import { useSelector } from 'react-redux';

const { user } = useSelector((state: any) => state.auth);

// Check permission
if (hasPermission(user, 'canCreateIssues')) {
  // Show create button
}

// Check role
if (user?.role === 'admin') {
  // Show admin panel
}
```

### Using Permission Gate Component

```tsx
<PermissionGate permission="canDeleteIssues">
  <button onClick={deleteIssue}>Delete</button>
</PermissionGate>

<PermissionGate role={['admin', 'manager']}>
  <AdminPanel />
</PermissionGate>
```

## Default Permission Objects

### Viewer
```javascript
{
  canCreateIssues: false,
  canEditIssues: false,
  canDeleteIssues: false,
  canAssignIssues: false,
  canViewAllIssues: false,
  canManageUsers: false,
  canViewReports: false,
  canExportData: false
}
```

### Developer
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

### QA
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

### Manager
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

### Admin
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
// Plus: Admin bypasses all permission checks!
```

## File Locations

### Backend
- `backend/models/User.js` - User schema with roles/permissions
- `backend/middleware/authmiddleware.js` - JWT authentication
- `backend/middleware/permissionMiddleware.js` - Permission checking ✨ NEW
- `backend/routes/IssueRoutes.js` - Protected issue routes ✅
- `backend/routes/UserRoutes.js` - Protected user routes ✅
- `backend/routes/ProjectRoutes.js` - Needs protection ⚠️

### Frontend
- `frontend/src/types/settings.ts` - TypeScript types
- `frontend/src/Components/UserManagementTab.tsx` - User management UI
- `frontend/src/utils/permissions.ts` - Permission helpers (to create)
- `frontend/src/Components/PermissionGate.tsx` - Permission component (to create)

## Common Patterns

### Custom Permissions
```javascript
// Create user with custom permissions
const user = new User({
  name: "Custom User",
  email: "custom@example.com",
  password: "password123",
  role: "developer",
  permissions: {
    ...defaultPermissions.developer,
    canViewReports: true  // Custom: Give this developer report access
  }
});
```

### Checking Multiple Conditions
```javascript
// Backend: User must be manager/admin OR have specific permission
const canPerformAction = (user) => {
  return user.role === 'admin' || 
         user.role === 'manager' || 
         user.permissions?.canManageUsers;
};
```

### Frontend: Hide/Show UI Elements
```tsx
const { user } = useSelector((state: any) => state.auth);

return (
  <div>
    {/* Always visible */}
    <IssueList />
    
    {/* Only for users who can create */}
    {hasPermission(user, 'canCreateIssues') && (
      <CreateIssueButton />
    )}
    
    {/* Only for admins and managers */}
    {hasRole(user, ['admin', 'manager']) && (
      <DeleteButtons />
    )}
  </div>
);
```

## Security Reminders

1. ⚠️ **Always protect routes on backend** - Frontend checks are just UX
2. 🔐 **Admin bypasses everything** - Use admin role carefully
3. 🏢 **Company isolation is critical** - Always filter by companyId
4. 📝 **Log sensitive actions** - Track who did what
5. 🔄 **Test with all roles** - Make sure permissions work as expected

## Testing Users

Create test users for each role:
```javascript
// Admin user (created during company registration)
role: 'admin' - Full access

// Manager user
role: 'manager' - Can manage users and delete issues

// QA user  
role: 'qa' - Can assign issues and view reports

// Developer user
role: 'developer' - Can create/edit issues

// Viewer user
role: 'viewer' - Read-only access
```

Then test each action with each user to verify permissions work correctly!
