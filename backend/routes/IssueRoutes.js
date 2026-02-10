const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const Issue = require("../models/Issue");

// Create issue
router.post("/", authMiddleware, async (req, res) => {
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
