const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Issue = require("../models/Issue");
const authMiddleware = require("../middleware/authmiddleware");

// Get all projects for the company
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { company: req.companyId };

    if (status) {
      query.status = status;
    }

    const projects = await Project.find(query)
      .populate("lead", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    // Get issue counts for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const issueCount = await Issue.countDocuments({ 
          project: project._id,
          company: req.companyId 
        });
        const openIssueCount = await Issue.countDocuments({ 
          project: project._id,
          company: req.companyId,
          status: { $in: ["Open", "In Progress"] }
        });
        return {
          ...project.toObject(),
          issueCount,
          openIssueCount,
        };
      })
    );

    res.json({ 
      success: true,
      projects: projectsWithCounts 
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch projects",
      error: error.message 
    });
  }
});

// Get single project by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      company: req.companyId,
    })
      .populate("lead", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: "Project not found" 
      });
    }

    // Get issue counts
    const issueCount = await Issue.countDocuments({ 
      project: project._id,
      company: req.companyId 
    });
    const openIssueCount = await Issue.countDocuments({ 
      project: project._id,
      company: req.companyId,
      status: { $in: ["Open", "In Progress"] }
    });

    res.json({ 
      success: true,
      project: {
        ...project.toObject(),
        issueCount,
        openIssueCount,
      }
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch project",
      error: error.message 
    });
  }
});

// Create new project
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, key, lead, members, color, icon, startDate, endDate } = req.body;

    // Check if project key already exists for this company
    const existingProject = await Project.findOne({
      company: req.companyId,
      key: key.toUpperCase(),
    });

    if (existingProject) {
      return res.status(400).json({ 
        success: false,
        message: "Project with this key already exists" 
      });
    }

    const project = new Project({
      name,
      description,
      key: key.toUpperCase(),
      lead: lead || req.userId,
      members: members || [req.userId],
      company: req.companyId,
      color,
      icon,
      startDate,
      endDate,
    });

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate("lead", "name email")
      .populate("members", "name email");

    res.status(201).json({ 
      success: true,
      message: "Project created successfully",
      project: populatedProject 
    });
  } catch (error) {
    console.error("Error creating project:", error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: "Project with this key already exists" 
      });
    }
    res.status(500).json({ 
      success: false,
      message: "Failed to create project",
      error: error.message 
    });
  }
});

// Update project
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, description, key, lead, members, status, color, icon, startDate, endDate } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      company: req.companyId,
    });

    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: "Project not found" 
      });
    }

    // If key is being changed, check for duplicates
    if (key && key.toUpperCase() !== project.key) {
      const existingProject = await Project.findOne({
        company: req.companyId,
        key: key.toUpperCase(),
        _id: { $ne: req.params.id },
      });

      if (existingProject) {
        return res.status(400).json({ 
          success: false,
          message: "Project with this key already exists" 
        });
      }
    }

    // Update fields
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (key) project.key = key.toUpperCase();
    if (lead) project.lead = lead;
    if (members) project.members = members;
    if (status) project.status = status;
    if (color) project.color = color;
    if (icon) project.icon = icon;
    if (startDate) project.startDate = startDate;
    if (endDate !== undefined) project.endDate = endDate;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("lead", "name email")
      .populate("members", "name email");

    res.json({ 
      success: true,
      message: "Project updated successfully",
      project: updatedProject 
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update project",
      error: error.message 
    });
  }
});

// Delete project
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      company: req.companyId,
    });

    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: "Project not found" 
      });
    }

    // Check if project has issues
    const issueCount = await Issue.countDocuments({ 
      project: project._id,
      company: req.companyId 
    });

    if (issueCount > 0) {
      return res.status(400).json({ 
        success: false,
        message: `Cannot delete project with ${issueCount} existing issue(s). Please move or delete issues first.` 
      });
    }

    await Project.deleteOne({ _id: req.params.id });

    res.json({ 
      success: true,
      message: "Project deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete project",
      error: error.message 
    });
  }
});

// Archive/Unarchive project
router.patch("/:id/archive", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      company: req.companyId,
    });

    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: "Project not found" 
      });
    }

    project.status = project.status === "archived" ? "active" : "archived";
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("lead", "name email")
      .populate("members", "name email");

    res.json({ 
      success: true,
      message: `Project ${project.status === "archived" ? "archived" : "restored"} successfully`,
      project: updatedProject 
    });
  } catch (error) {
    console.error("Error archiving project:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to archive project",
      error: error.message 
    });
  }
});

module.exports = router;
