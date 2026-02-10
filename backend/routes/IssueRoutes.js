const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const Issue = require("../models/Issue");

// Get all issues for the user's company with optional search and filters
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search, status, priority, severity, project } = req.query;
    
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
    
    // Add project filter
    if (project && project !== 'All') {
      query.project = project;
    }

    const issues = await Issue.find(query)
      .populate("assignee", "name email")
      .populate("reporter", "name email")
      .populate("project", "name key icon")
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
        project: issue.project ? {
          _id: issue.project._id,
          name: issue.project.name,
          key: issue.project.key,
          icon: issue.project.icon
        } : null,
        projectId: issue.project?._id || null,
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
      projectId,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    if (!projectId) {
      return res.status(400).json({ message: "Project is required - all issues must belong to a project" });
    }

    // Validate assigneeId if provided (must be a valid MongoDB ObjectId or empty)
    if (assigneeId && assigneeId !== "" && !/^[0-9a-fA-F]{24}$/.test(assigneeId)) {
      return res.status(400).json({ message: "Invalid assignee ID format" });
    }

    // Validate projectId (must be a valid MongoDB ObjectId)
    if (projectId && !/^[0-9a-fA-F]{24}$/.test(projectId)) {
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    const issue = new Issue({
      title,
      description,
      status,
      priority,
      severity,
      reporter: req.user?.userId,
      company: req.user?.companyId,
      project: projectId,
      ...(assigneeId && assigneeId !== "" ? { assignee: assigneeId } : {}),
    });

    await issue.save();

    // Populate project data
    await issue.populate("project", "name key icon");

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
        assigneeId: issue.assignee || null,
        reporter: issue.reporter,
        reporterId: issue.reporter,
        project: issue.project ? {
          _id: issue.project._id,
          name: issue.project.name,
          key: issue.project.key,
          icon: issue.project.icon
        } : null,
        projectId: issue.project?._id || null,
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

// Get single issue by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("=== GET /issues/:id ===");
    console.log("Requested ID:", id);
    console.log("User company ID:", req.user?.companyId);

    const issue = await Issue.findOne({ 
      _id: id, 
      company: req.user?.companyId 
    })
      .populate("assignee", "name email")
      .populate("reporter", "name email")
      .populate("project", "name key icon");

    console.log("Found issue:", issue ? `Yes (ID: ${issue._id})` : "No");

    if (!issue) {
      console.log("Returning 404 - Issue not found");
      return res.status(404).json({ message: "Issue not found" });
    }

    console.log("Returning 200 with issue data");
    return res.status(200).json({
      message: "Issue fetched successfully",
      issue: {
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
        project: issue.project ? {
          _id: issue.project._id,
          name: issue.project.name,
          key: issue.project.key,
          icon: issue.project.icon
        } : null,
        projectId: issue.project?._id || null,
        company: issue.company,
        completedAt: issue.completedAt,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
      },
    });
  } catch (error) {
    console.error("Fetch issue error:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
});

// Update issue by ID
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      priority,
      severity,
      assigneeId,
      projectId,
    } = req.body;

    // Find issue and verify it belongs to user's company
    const issue = await Issue.findOne({ 
      _id: id, 
      company: req.user?.companyId 
    });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Validate assigneeId if provided (must be a valid MongoDB ObjectId, null, or empty string)
    if (assigneeId !== undefined && assigneeId !== null && assigneeId !== "" && !/^[0-9a-fA-F]{24}$/.test(assigneeId)) {
      return res.status(400).json({ message: "Invalid assignee ID format" });
    }

    // Validate projectId if provided (must be a valid MongoDB ObjectId)
    if (projectId !== undefined && projectId !== null && projectId !== "" && !/^[0-9a-fA-F]{24}$/.test(projectId)) {
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    // Update fields
    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) issue.status = status;
    if (priority !== undefined) issue.priority = priority;
    if (severity !== undefined) issue.severity = severity;
    if (assigneeId !== undefined) {
      issue.assignee = (assigneeId && assigneeId !== "") ? assigneeId : null;
    }
    if (projectId !== undefined && projectId !== "") {
      issue.project = projectId;
    }

    await issue.save();

    // Populate and return updated issue
    await issue.populate("assignee", "name email");
    await issue.populate("reporter", "name email");
    await issue.populate("project", "name key icon");

    return res.status(200).json({
      message: "Issue updated successfully",
      issue: {
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
        project: issue.project ? {
          _id: issue.project._id,
          name: issue.project.name,
          key: issue.project.key,
          icon: issue.project.icon
        } : null,
        projectId: issue.project?._id || null,
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
      },
    });
  } catch (error) {
    console.error("Update issue error:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
});

// Delete issue by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("=== DELETE /issues/:id ===");
    console.log("Requested ID:", id);
    console.log("User company ID:", req.user?.companyId);

    // Find and delete issue (verify it belongs to user's company)
    const issue = await Issue.findOneAndDelete({ 
      _id: id, 
      company: req.user?.companyId 
    });

    console.log("Found and deleted issue:", issue ? `Yes (ID: ${issue._id})` : "No");

    if (!issue) {
      console.log("Returning 404 - Issue not found");
      return res.status(404).json({ message: "Issue not found" });
    }

    console.log("Returning 200 - Issue deleted successfully");
    return res.status(200).json({
      message: "Issue deleted successfully",
    });
  } catch (error) {
    console.error("Delete issue error:", error);
    return res.status(500).json({ message: error?.message || "Server error" });
  }
});

module.exports = router;
