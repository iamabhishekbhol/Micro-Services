const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklisttoken.model");
const { model } = require("mongoose");

module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Set token in cookie
    res.cookie("token", token);
    delete user._doc.password; // Remove password from user object
    // Send response
    res.status(201).send({ token, message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid password" });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    delete user._doc.password; // Remove password from user object; // Remove password from user object
    // Set token in cookie
    res.cookie("token", token);
    // Send response
    res.send({ token, message: "User logged in successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers["authorization"];
    await blacklistTokenModel.create({ token });
    // Clear the cookie
    res.clearCookie("token");
    // Send response
    res.status(200).send({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.profile = async (req, res) => {
  try {
    const user = req.user;
    // Send response
    res.send({ message: "User profile", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
