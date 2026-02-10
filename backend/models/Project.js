const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    key: {
      type: String,
      required: [true, "Project key is required"],
      uppercase: true,
      trim: true,
      maxlength: [10, "Project key cannot exceed 10 characters"],
      match: [/^[A-Z][A-Z0-9]*$/, "Project key must start with a letter and contain only uppercase letters and numbers"],
    },
    status: {
      type: String,
      enum: ["active", "archived", "completed"],
      default: "active",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    color: {
      type: String,
      default: "#6366f1", // indigo-500
    },
    icon: {
      type: String,
      default: "📁",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for company and key uniqueness
projectSchema.index({ company: 1, key: 1 }, { unique: true });

// Compound index for company and name
projectSchema.index({ company: 1, name: 1 });

// Index for faster queries
projectSchema.index({ company: 1, status: 1 });

// Virtual for issue count (can be populated separately)
projectSchema.virtual("issueCount", {
  ref: "Issue",
  localField: "_id",
  foreignField: "project",
  count: true,
});

// Ensure virtuals are included in JSON
projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
