const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authMiddleware = require('../middleware/authmiddleware');
require("dotenv").config();

module.exports = router;