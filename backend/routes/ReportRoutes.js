const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
const { requirePermission } = require("../middleware/permissionMiddleware");
const Issue = require("../models/Issue");

// Get reports data (fetches issues to generate reports dynamically on client side)
router.get("/", authMiddleware, requirePermission('canViewReports'), async (req, res) => {
  try {
    const issues = await Issue.find({ company: req.user?.companyId })
      .populate("assignee", "name email")
      .populate("reporter", "name email")
      .populate("project", "name key icon")
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      issues: issues.map(issue => ({
        id: issue._id,
        title: issue.title,
        description: issue.description,
        status: issue.status,
        priority: issue.priority,
        severity: issue.severity,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
        completedAt: issue.completedAt || undefined
      }))
    });
  } catch (error) {
    console.error("Reports API error:", error);
    res.status(500).json({ success: false, message: error?.message || "Failed to generate reports" });
  }
});

module.exports = router;
