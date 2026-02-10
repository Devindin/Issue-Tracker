# Quick Permission Implementation Guide

## ✅ What's Already Working

1. **Permission middleware created** ✅
   - File: `backend/middleware/permissionMiddleware.js`
   - Functions: `requirePermission()`, `requireAnyPermission()`, `requireAllPermissions()`, `requireRole()`

2. **Issue routes protected** ✅
   - Create: Requires `canCreateIssues`
   - Update: Requires `canEditIssues`
   - Delete: Requires `canDeleteIssues`

3. **User management protected** ✅
   - Create/Update/Delete users: Checks `canManageUsers`

## 🔧 Next Steps to Complete Permission System

### 1. Protect Project Routes

**File:** `backend/routes/ProjectRoutes.js`

Add at the top:
```javascript
const { requirePermission, requireRole } = require("../middleware/permissionMiddleware");
```

Update routes:
```javascript
// Only managers and admins can create projects
router.post("/", authMiddleware, requireRole(['manager', 'admin']), async (req, res) => {
  // ... existing code
});

// Only managers and admins can update projects
router.put("/:id", authMiddleware, requireRole(['manager', 'admin']), async (req, res) => {
  // ... existing code
});

// Only admins can delete projects
router.delete("/:id", authMiddleware, requireRole('admin'), async (req, res) => {
  // ... existing code
});
```

### 2. Filter Issues by Permission

**File:** `backend/routes/IssueRoutes.js`

Update the GET /issues route (around line 7):

```javascript
// Get all issues for the user's company with optional search and filters
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search, status, priority, severity, project } = req.query;
    
    // Get user to check permissions
    const User = require("../models/User");
    const currentUser = await User.findById(req.user?.userId).select('permissions role');
    
    // Build query
    const query = { company: req.user?.companyId };
    
    // If user doesn't have canViewAllIssues permission and is not admin
    // Only show issues they're assigned to or reported
    if (currentUser && currentUser.role !== 'admin' && !currentUser.permissions?.canViewAllIssues) {
      query.$or = [
        { assignee: req.user?.userId },
        { reporter: req.user?.userId }
      ];
    }
    
    // ... rest of existing code (search, status, priority filters)
    
    const issues = await Issue.find(query)
      .populate("assignee", "name email")
      .populate("reporter", "name email")
      .populate("project", "name key icon")
      .sort({ createdAt: -1 });
    
    // ... rest of existing response
  }
  // ... catch block
});
```

### 3. Protect Export Functionality

**File:** `backend/routes/IssueRoutes.js`

Add a new route for exporting:
```javascript
// Export issues (CSV/JSON)
router.get("/export", authMiddleware, requirePermission('canExportData'), async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    
    const issues = await Issue.find({ company: req.user?.companyId })
      .populate("assignee", "name email")
      .populate("reporter", "name email")
      .populate("project", "name key icon")
      .sort({ createdAt: -1 });
    
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=issues.json');
      return res.json(issues);
    }
    
    // CSV format
    const csv = [
      ['ID', 'Title', 'Status', 'Priority', 'Assignee', 'Project', 'Created'].join(','),
      ...issues.map(issue => [
        issue._id,
        `"${issue.title}"`,
        issue.status,
        issue.priority,
        issue.assignee?.name || 'Unassigned',
        issue.project?.name || 'No Project',
        issue.createdAt
      ].join(','))
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=issues.csv');
    res.send(csv);
  } catch (error) {
    console.error("Export error:", error);
    return res.status(500).json({ message: error?.message || "Export failed" });
  }
});
```

Then update frontend to call this endpoint instead of doing client-side export.

### 4. Protect Reports Route

Create: `backend/routes/ReportRoutes.js`

```javascript
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
const { requirePermission } = require("../middleware/permissionMiddleware");
const Issue = require("../models/Issue");

// Get reports data
router.get("/", authMiddleware, requirePermission('canViewReports'), async (req, res) => {
  try {
    const issues = await Issue.find({ company: req.user?.companyId });
    
    // Calculate statistics
    const stats = {
      total: issues.length,
      byStatus: {},
      byPriority: {},
      bySeverity: {},
    };
    
    issues.forEach(issue => {
      stats.byStatus[issue.status] = (stats.byStatus[issue.status] || 0) + 1;
      stats.byPriority[issue.priority] = (stats.byPriority[issue.priority] || 0) + 1;
      stats.bySeverity[issue.severity] = (stats.bySeverity[issue.severity] || 0) + 1;
    });
    
    res.json({ success: true, stats });
  } catch (error) {
    console.error("Reports error:", error);
    res.status(500).json({ message: error?.message || "Failed to generate reports" });
  }
});

module.exports = router;
```

Register in `backend/index.js`:
```javascript
const reportRoutes = require("./routes/ReportRoutes");
app.use("/api/reports", reportRoutes);
```

### 5. Frontend Permission Helper

Create: `frontend/src/utils/permissions.ts`

```typescript
interface User {
  role: string;
  permissions?: {
    [key: string]: boolean;
  };
}

export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.permissions?.[permission] || false;
};

export const hasRole = (user: User | null, role: string | string[]): boolean => {
  if (!user) return false;
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(user.role);
};

export const hasAnyPermission = (user: User | null, permissions: string[]): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return permissions.some(permission => user.permissions?.[permission]);
};
```

Usage in components:
```typescript
import { hasPermission } from '../utils/permissions';
import { useSelector } from 'react-redux';

const MyComponent = () => {
  const { user } = useSelector((state: any) => state.auth);
  
  return (
    <>
      {hasPermission(user, 'canCreateIssues') && (
        <button>Create Issue</button>
      )}
      
      {hasPermission(user, 'canDeleteIssues') && (
        <button>Delete Issue</button>
      )}
    </>
  );
};
```

### 6. Add Permission Component

Create: `frontend/src/Components/PermissionGate.tsx`

```typescript
import React from 'react';
import { useSelector } from 'react-redux';
import { hasPermission, hasRole } from '../utils/permissions';

interface PermissionGateProps {
  permission?: string;
  role?: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({ 
  permission, 
  role,
  fallback = null, 
  children 
}) => {
  const { user } = useSelector((state: any) => state.auth);
  
  let hasAccess = false;
  
  if (permission) {
    hasAccess = hasPermission(user, permission);
  } else if (role) {
    hasAccess = hasRole(user, role);
  }
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGate;
```

Usage:
```tsx
<PermissionGate permission="canCreateIssues">
  <button onClick={createIssue}>Create Issue</button>
</PermissionGate>

<PermissionGate role={['admin', 'manager']}>
  <UserManagementPanel />
</PermissionGate>
```

## 🧪 Testing Checklist

After implementing:

- [ ] Create test users for each role (viewer, developer, qa, manager, admin)
- [ ] Test each role can only perform allowed actions
- [ ] Verify backend returns 403 for unauthorized actions
- [ ] Check frontend hides/shows buttons based on permissions
- [ ] Test that admin bypasses all permission checks
- [ ] Verify users can only see data from their company
- [ ] Test custom permission overrides work

## 📝 Important Notes

1. **Always protect routes on backend first** - Frontend checks are for UX only
2. **Admin role is god mode** - They bypass ALL permission checks
3. **Test thoroughly** - Create users with different roles and test each action
4. **Log important actions** - Consider adding audit logging for sensitive operations

## 🚀 Quick Start

1. The permission middleware is already created
2. Issue routes are already protected
3. Follow steps 1-6 above to complete the implementation
4. Test with different user roles
5. Adjust permissions as needed for your use case

---

**Current Status:**
- ✅ Permission system infrastructure complete
- ✅ Issue routes protected
- ✅ User management protected
- ⚠️ Projects need protection
- ⚠️ Reports need protection
- ⚠️ Export functionality needs backend check
- ⚠️ Issue filtering by permission needed
