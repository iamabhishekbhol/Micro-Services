const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

module.exports.userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decodedToken.id);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
