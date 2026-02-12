const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
const User = require("../models/User");

//////////////////////////////// Get current user's profile ///////////////////////////////
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("=== GET /users/profile ===");
    console.log("User ID:", req.user?.userId);

    const user = await User.findById(req.user?.userId)
      .select("-password")
      .populate("company", "name description");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        location: user.location || '',
        website: user.website || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        role: user.role,
        company: {
          id: user.company._id,
          name: user.company.name,
          description: user.company.description,
        },
      },
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
});

//////////////////////////////// Update current user's profile ////////////////////////////////
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, location, website, bio, avatar } = req.body;

    console.log("=== PUT /users/profile ===");
    console.log("User ID:", req.user?.userId);
    console.log("Update data:", { name, phone, location, website, bio, avatar: avatar ? '[PROVIDED]' : '[NONE]' });

    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the provided fields
    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (location !== undefined) user.location = location.trim();
    if (website !== undefined) user.website = website.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    console.log("Profile updated successfully");

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        website: user.website,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
});

///////////////////////////////////// Get all users in the company //////////////////////////
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("=== GET /users ===");
    console.log("Company ID:", req.user?.companyId);

    const users = await User.find({ company: req.user?.companyId })
      .select("-password")
      .populate("company", "name description")
      .sort({ createdAt: -1 });

    console.log(`Found ${users.length} users`);

    return res.status(200).json({
      message: "Users fetched successfully",
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        permissions: user.permissions,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Fetch users error:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
});

/////////////////////// Get single user by ID /////////////////////////////////
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("=== GET /users/:id ===");
    console.log("Requested ID:", id);
    console.log("User company ID:", req.user?.companyId);

    const user = await User.findOne({ 
      _id: id, 
      company: req.user?.companyId 
    })
      .select("-password")
      .populate("company", "name description");

    console.log("Found user:", user ? `Yes (ID: ${user._id})` : "No");

    if (!user) {
      console.log("Returning 404 - User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Returning 200 with user data");
    return res.status(200).json({
      message: "User fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        permissions: user.permissions,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        company: {
          id: user.company._id,
          name: user.company.name,
          description: user.company.description,
        },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Fetch user error:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
});

//////////////////////////////// Create a new user under the logged-in company ///////////////////////////
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "viewer",
      permissions = {},
      status = "active",
    } = req.body;

    console.log("=== POST /users ===");
    console.log("Creating user for company:", req.user?.companyId);
    console.log("User data:", { name, email, role, status });

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Name, email, and password are required" 
      });
    }

    // Check if user already exists in THIS company only
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim(),
      company: req.user?.companyId  // Email must be unique per company, not globally
    });
    if (existingUser) {
      return res.status(400).json({ 
        message: "User with this email already exists in your company" 
      });
    }

    // Check if requester has permission to manage users
    const requester = await User.findById(req.user?.userId);
    if (!requester?.permissions?.canManageUsers && requester?.role !== 'admin') {
      return res.status(403).json({ 
        message: "You don't have permission to create users" 
      });
    }

    // Set default permissions based on role
    const defaultPermissions = {
      viewer: {
        canCreateIssues: false,
        canEditIssues: false,
        canDeleteIssues: false,
        canAssignIssues: false,
        canViewAllIssues: true,
        canManageUsers: false,
        canViewReports: false,
        canExportData: false
      },
      developer: {
        canCreateIssues: true,
        canEditIssues: true,
        canDeleteIssues: false,
        canAssignIssues: false,
        canViewAllIssues: true,
        canManageUsers: false,
        canViewReports: false,
        canExportData: false
      },
      qa: {
        canCreateIssues: true,
        canEditIssues: true,
        canDeleteIssues: false,
        canAssignIssues: true,
        canViewAllIssues: true,
        canManageUsers: false,
        canViewReports: true,
        canExportData: false
      },
      manager: {
        canCreateIssues: true,
        canEditIssues: true,
        canDeleteIssues: true,
        canAssignIssues: true,
        canViewAllIssues: true,
        canManageUsers: true,
        canViewReports: true,
        canExportData: true
      },
      admin: {
        canCreateIssues: true,
        canEditIssues: true,
        canDeleteIssues: true,
        canAssignIssues: true,
        canViewAllIssues: true,
        canManageUsers: true,
        canViewReports: true,
        canExportData: true
      }
    };

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      company: req.user?.companyId,
      permissions: { ...defaultPermissions[role], ...permissions },
      status,
    });

    await user.save();

    console.log("User created successfully:", user._id);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        permissions: user.permissions,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
});

///////////////////////////////////////////// Update user by ID //////////////////////////////////////////
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      role,
      permissions,
      status,
      avatar,
    } = req.body;

    console.log("=== PUT /users/:id ===");
    console.log("Updating user:", id);

    // Find user and verify it belongs to user's company
    const user = await User.findOne({ 
      _id: id, 
      company: req.user?.companyId 
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if requester has permission to manage users
    const requester = await User.findById(req.user?.userId);
    if (!requester?.permissions?.canManageUsers && requester?.role !== 'admin') {
      return res.status(403).json({ 
        message: "You don't have permission to update users" 
      });
    }

    // Prevent self-demotion for admins
    if (user._id.toString() === req.user?.userId && role && role !== user.role) {
      if (user.role === 'admin' && role !== 'admin') {
        return res.status(400).json({ 
          message: "You cannot change your own admin role" 
        });
      }
    }

    // Update fields
    if (name !== undefined) user.name = name.trim();
    if (email !== undefined) {
      // Check if email is being changed to an existing email IN THIS COMPANY
      const existingUser = await User.findOne({ 
        email: email.toLowerCase().trim(),
        company: req.user?.companyId,  // Email must be unique per company
        _id: { $ne: id }
      });
      if (existingUser) {
        return res.status(400).json({ 
          message: "User with this email already exists in your company" 
        });
      }
      user.email = email.toLowerCase().trim();
    }
    if (role !== undefined) user.role = role;
    if (permissions !== undefined) user.permissions = permissions;
    if (status !== undefined) user.status = status;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    console.log("User updated successfully:", user._id);

    return res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        permissions: user.permissions,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
});

///////////////////////////////////////// Delete user by ID //////////////////////////////////////
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("=== DELETE /users/:id ===");
    console.log("Requested ID:", id);
    console.log("User company ID:", req.user?.companyId);

    // Prevent self-deletion
    if (id === req.user?.userId) {
      return res.status(400).json({ 
        message: "You cannot delete your own account" 
      });
    }

    // Check if requester has permission to manage users
    const requester = await User.findById(req.user?.userId);
    if (!requester?.permissions?.canManageUsers && requester?.role !== 'admin') {
      return res.status(403).json({ 
        message: "You don't have permission to delete users" 
      });
    }

    // Find and delete user (verify it belongs to user's company)
    const user = await User.findOneAndDelete({ 
      _id: id, 
      company: req.user?.companyId 
    });

    console.log("Found and deleted user:", user ? `Yes (ID: ${user._id})` : "No");

    if (!user) {
      console.log("Returning 404 - User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Returning 200 - User deleted successfully");
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
});

module.exports = router;
