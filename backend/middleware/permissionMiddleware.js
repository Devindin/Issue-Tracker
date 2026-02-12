const User = require('../models/User');

const requirePermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      // Get user with permissions
      const user = await User.findById(req.user?.userId).select('permissions role');
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Admin role bypasses all permission checks
      if (user.role === 'admin') {
        return next();
      }

      // Check specific permission
      if (user.permissions && user.permissions[permissionName]) {
        return next();
      }

      // Permission denied
      return res.status(403).json({ 
        message: `You don't have permission to perform this action. Required: ${permissionName}`,
        requiredPermission: permissionName
      });
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ message: 'Error checking permissions' });
    }
  };
};

//  Check multiple permissions (user needs at least one)
 
const requireAnyPermission = (permissionNames) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user?.userId).select('permissions role');
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Admin role bypasses all permission checks
      if (user.role === 'admin') {
        return next();
      }

      // Check if user has any of the required permissions
      const hasPermission = permissionNames.some(permission => 
        user.permissions && user.permissions[permission]
      );

      if (hasPermission) {
        return next();
      }

      return res.status(403).json({ 
        message: `You don't have permission to perform this action. Required one of: ${permissionNames.join(', ')}`,
        requiredPermissions: permissionNames
      });
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ message: 'Error checking permissions' });
    }
  };
};

//Check multiple permissions (user needs all of them)
 
const requireAllPermissions = (permissionNames) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user?.userId).select('permissions role');
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Admin role bypasses all permission checks
      if (user.role === 'admin') {
        return next();
      }

      // Check if user has all required permissions
      const hasAllPermissions = permissionNames.every(permission => 
        user.permissions && user.permissions[permission]
      );

      if (hasAllPermissions) {
        return next();
      }

      return res.status(403).json({ 
        message: `You don't have all required permissions. Required: ${permissionNames.join(', ')}`,
        requiredPermissions: permissionNames
      });
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ message: 'Error checking permissions' });
    }
  };
};


 //Require specific role
 
const requireRole = (roles) => {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user?.userId).select('role');
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (roleArray.includes(user.role)) {
        return next();
      }

      return res.status(403).json({ 
        message: `Access denied. Required role: ${roleArray.join(' or ')}`,
        requiredRoles: roleArray
      });
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({ message: 'Error checking role' });
    }
  };
};


 // Attach user permissions to request for later use
 
const attachPermissions = async (req, res, next) => {
  try {
    if (req.user?.userId) {
      const user = await User.findById(req.user.userId).select('permissions role');
      if (user) {
        req.userPermissions = user.permissions;
        req.userRole = user.role;
      }
    }
    next();
  } catch (error) {
    console.error('Error attaching permissions:', error);
    next(); // Continue even if error
  }
};

module.exports = {
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireRole,
  attachPermissions
};
