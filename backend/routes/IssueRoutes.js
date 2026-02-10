const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const Issue = require("../models/Issue");

// Get all issues for the user's company with optional search and filters
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search, status, priority, severity } = req.query;
    
    // Build query
    const query = { company: req.user?.companyId };
    
    // Add search filter (case-insensitive)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add status filter
    if (status && status !== 'All') {
      query.status = status;
    }
    
    // Add priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }
    
    // Add severity filter
    if (severity && severity !== 'All') {
      query.severity = severity;
    }

    const issues = await Issue.find(query)
      .populate("assignee", "name email")
      .populate("reporter", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Issues fetched successfully",
      issues: issues.map(issue => ({
        id: issue._id,
        title: issue.title,
        description: issue.description,
        status: issue.status,
        priority: issue.priority,
        severity: issue.severity,
        assignee: issue.assignee ? {
          id: issue.assignee._id,
          name: issue.assignee.name,
          email: issue.assignee.email
        } : null,
        assigneeId: issue.assignee?._id || null,
        reporter: issue.reporter ? {
          id: issue.reporter._id,
          name: issue.reporter.name,
          email: issue.reporter.email
        } : null,
        reporterId: issue.reporter?._id || null,
        company: issue.company,
        completedAt: issue.completedAt,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Fetch issues error:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
});

// Create issue
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const {
      title,
      description,
      status = "Open",
      priority = "Medium",
      severity = "Minor",
      assigneeId,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const issue = new Issue({
      title,
      description,
      status,
      priority,
      severity,
      reporter: req.user?.userId,
      company: req.user?.companyId,
      ...(assigneeId ? { assignee: assigneeId } : {}),
    });

    await issue.save();

    return res.status(201).json({
      message: "Issue created successfully",
      issue: {
        id: issue._id,
        title: issue.title,
        description: issue.description,
        status: issue.status,
        priority: issue.priority,
        severity: issue.severity,
        assignee: issue.assignee || null,
        reporter: issue.reporter,
        company: issue.company,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create issue error:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
});

module.exports = router;
