const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authMiddleware = require('../middleware/authmiddleware');
const Company = require('../models/Company');
const User = require('../models/User');
require("dotenv").config();

// Register company and owner
router.post('/register-company', async (req, res) => {
  try {
    const { companyName, companyDescription, name, email, password } = req.body;

    // Validate required fields
    if (!companyName || !name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if company email already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company email already exists' });
    }

    // Create company
    const company = new Company({
      name: companyName,
      email,
      description: companyDescription,
      owner: null // Will set after creating user
    });
    await company.save();

    // Create user as company owner
    const user = new User({
      name,
      email,
      password,
      role: 'admin',
      company: company._id,
      permissions: {
        canCreateIssues: true,
        canEditIssues: true,
        canDeleteIssues: true,
        canAssignIssues: true,
        canViewAllIssues: true,
        canManageUsers: true,
        canViewReports: true,
        canExportData: true
      }
    });
    await user.save();

    // Update company owner
    company.owner = user._id;
    await company.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, companyId: company._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Company registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: {
          id: company._id,
          name: company.name,
          description: company.description
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: error?.message || 'Server error',
    });
  }
});

module.exports = router;